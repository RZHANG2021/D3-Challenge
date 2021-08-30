var svgWidth = 760;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .classed("chart", true)
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  // .attr("class", "chart");
// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.9,
      d3.max(stateData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.9,
      d3.max(stateData, d => d[chosenYAxis]) * 1.1
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(Circles, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    Circles.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return Circles;
}


//function used for updating state labels with a transition to new 
function renderText(texts, newXScale, chosenXAxis,newYScale, chosenYAxis) {

  texts.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
      

  return texts;
}



// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, Circles) {

  // set X labels
  var xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "In Poverty %:";
  }
  else if (chosenXAxis === "age"){
    xlabel = "Age (median):";
  }
  else {
    xlabel = "household Income (median):";
  }

  // set Y labels
  var ylabel ;
  if (chosenYAxis === 'healthcare') {
    ylabel = "No Healthcare %:"
  }
  //percentage obese
  else if (chosenYAxis === 'obesity') {
    ylabel = "Obesity %:"
  }
  //smoking percentage
  else {
    ylabel = "Smokers % :"
  }


  //create tooltip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 2])
    .html(function(d) {
     
      return (`${d.state}<br>${xlabel} ${[chosenXAxis])}<br>${yLabel}${d[chosenYAxis]}`);
    });

    Circles.call(toolTip);

    Circles.on("mouseover", function(data) {
    toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });
    
   
  return Circles
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(stateData, err) {
  
  if (err) throw err;

  // parse data
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // LinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);
  var yLinearScale = yScale(stateData, chosenYAxis);

  
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  
  // append inital circles
  var Circles = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 12)
    .attr("opacity", ".75");

  
  var texts = chartGroup.selectAll(".stateText")
    .data(stateData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .text(d => d.abbr)
    .attr('font-size',8)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("dy", 4);
    


  // Create group for three x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("value", "poverty") // value to grab for event listener
    .classed("aText", true)
    .classed("active", true)
    .text("In Poverty % ");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 38)
    .attr("value", "age") // value to grab for event listener
    .classed("aText", true)
    .classed("inactive", true)
    .text("Age (median):");

    var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 55)
    .attr("value", "income") // value to grab for event listener
    .classed("aText", true)
    .classed("inactive", true)
    .text("HouseholdIncome (median):");

  // Create group for three x-axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform",  `translate(${0 - margin.left/3}, ${(height/3)})`);

  var healthcareLabel = ylabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", -15)
      .attr("value", "healthcare") // value to grab for event listener
      .classed("aText", true)
      .classed("active", true)
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .text("Lacks Healthcare % ");

  var obesityLabel = ylabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", -35)
      .attr("value", "obesity") // value to grab for event listener
      .classed("aText", true)
      .classed("inactive", true)
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .text("Obesity % ");

    var smokesLabel = ylabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", -60)
      .attr("value", "smokes") // value to grab for event listener
      .classed("aText", true)
      .classed("inactive", true)
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .text("Smokers % ");

  // updateToolTip function above csv import
  var Circles = updateToolTip(chosenXAxis,chosenYAxis, Circles);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value != chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        Circles = renderCircles(Circles, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update text with new x values
        texts = renderText(texts, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        Circles = updateToolTip(chosenXAxis, chosenYAxis, Circles);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", true)
                .classed("inactive", false);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
          }
        else {
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
        }
      }
    });
    // y axis labels event listener
  ylabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value != chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      // console.log(chosenYAxis)

      // functions here found above csv import
      // updates Y scale for new data
      yLinearScale = yScale(stateData, chosenYAxis);

      // updates x axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new x values
      Circles = renderCircles(Circles, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      //update text with new x values
      texts = renderText(texts,xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      Circles = updateToolTip(chosenXAxis, chosenYAxis,Circles);

      // changes classes to change bold text
      if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
      }
      else if (chosenYAxis === "obesity") {
          healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          obesityLabel
              .classed("active", true)
              .classed("inactive", false);
          smokesLabel
              .classed("active", false)
              .classed("inactive", true);
        }
      else {
          healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
          obesityLabel
              .classed("active", false)
              .classed("inactive", true);
          smokesLabel
              .classed("active", true)
              .classed("inactive", false);
      }
    }
  });
}).catch(function(error) {
  console.log(error);
});
