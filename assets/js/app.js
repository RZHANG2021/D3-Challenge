// @TODO: YOUR CODE HERE!
var svgWidth = 660;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(stateData) {
     console.log (stateData)
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      // .domain(d3.extent(stateData, d => d.poverty))
      .domain([d3.min(stateData, d => d.poverty)*0.9, d3.max(stateData, d => d.poverty)*0.9])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.healthcare)*0.9])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // // Step 5:append circles and text under the class g circles-group, render the value 
    // // ==============================
        
    var Circles = svg.selectAll("g", "Circles-group").data(stateData).enter();
    Circles
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .attr("fill", "lightblue")
    .attr("opacity", ".75");

    
    Circles
    .append("text")
    .text(d => d.abbr)
    .attr('font-size',8)
    .attr("dx", d => xLinearScale(d.poverty)-3)
    .attr("dy", d => yLinearScale(d.healthcare)+3)
    .attr("fill", "black");


    // // Step 6: Initialize tool tip
    // // ==============================
    // var toolTip = d3.tip()
    //   .attr("class", "d3-tip ")
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`${d.state}<br>Poverty %: ${d.poverty}<br>Healthcare %: ${d.healthcare}`);
    //   });

    // // Step 7: Create tooltip in the chart
    // // ==============================
    // theCircles.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    // theCircles.on("click", function(data) {
    //   toolTip.show(data, this);
    // })
    //   // onmouseout event
    //   .on("mouseout", function(data) {
    //     toolTip.hide(data);
    //   });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks of Healthcare % ");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty % ");
  }).catch(function(error) {
    console.log(error);
  });
