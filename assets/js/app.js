var svgWidth = 750;
var svgHeight = 550;
var margin = { top: 0, right: 0, bottom: 50, left: 50};
var width = svgWidth - margin.left;
var height = svgHeight -margin.bottom;
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
var pickX = "poverty";
var pickY = "healthcare";

(async function(){
  var dataFetch = await d3.csv("assets/data/data.csv");
  dataFetch.forEach(function(data) {
    data.poverty    = +data.poverty;
    data.age        = +data.age;
    data.income     = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity    = +data.obesity;
    data.smokes     = +data.smokes;
  });

var scaleX = xScale(dataFetch, pickX);
var scaleY = yScale(dataFetch, pickY);
//The d3.axisBottom() function in D3.js is used to create a bottom horizontal axis. This function will varruct a new bottom-oriented axis generator for the given scale, with empty tick arguments, a tick size of 6 and padding of 3.
var xaxis = d3.axisBottom(scaleX);
//The d3.axisLeft() function in D3.js is used to create a left vertical axis. This function will varruct a new left-oriented axis generator for the given scale, with empty tick arguments, a tick size of 6 and padding of 3.
var yaxis = d3.axisLeft(scaleY);
var chartBottom = chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xaxis);
var chartLeft = chart.append("g")
    .call(yaxis);

  // Scatterplot
var dataPlot = chart.selectAll("g circle")
    .data(dataFetch)
    .enter()
    .append("g");
var stateCircle = dataPlot.append("circle")
    .attr("cx", d => scaleX(d[pickX]))
    .attr("cy", d => scaleY(d[pickY]))
    .attr("r", 13)
    .classed("stateCircle", true);
var stateText = dataPlot.append("text")
    .text(d => d.abbr)
    .attr("dx", d => scaleX(d[pickX]))
    .attr("dy", d => scaleY(d[pickY]) + 4)
    .classed("stateText", true);


var labelX = chart.append("g")
    .attr("transform", `translate(${width}, ${height})`);
  var povertyX = labelX.append("text")
    .attr("x", -375)
    .attr("y", 35)
    .attr("value", "poverty") 
    .text("In Poverty (%)")
    .classed("active", true);
  var ageX = labelX.append("text")
    .attr("x", -500)
    .attr("y", 35)
    .attr("value", "age") 
    .text("Age (Median)")
    .classed("inactive", true);
  var incomeX = labelX.append("text")
    .attr("x", -200)
    .attr("y", 35)
    .attr("value", "income") 
    .text("Household Income (Median)")
    .classed("inactive", true);

var labelY = chart.append("g")
  .attr("transform", "rotate(-90)")
  var healthY = labelY.append("text")
    .attr("x", -275)
    .attr("y", -30)
    .attr("value", "healthcare") 
    .text("Lacks Healthcare (%)")
    .classed("active", true);
  var smokeY = labelY.append("text")
    .attr("x", -135)
    .attr("y", -30)
    .attr("value", "smokes") 
    .text("Smokes (%)")
    .classed("inactive", true);
  var obeseY = labelY.append("text")
    .attr("x", -415)
    .attr("y", -30)
    .attr("value", "obesity") 
    .text("Obese (%)")
    .classed("inactive", true);

dataPlot = updateToolTip(dataPlot, pickX, pickY);

labelX.selectAll("text").on("click", function() {
  var value = d3.select(this).attr("value");
  if (value !== pickX) {
    pickX = value;
    scaleX = xScale(dataFetch, pickX);
    chartBottom = chartBottomRender(scaleX, chartBottom);
    stateCircle = stateCircleRender(stateCircle, scaleX, pickX);
    stateText = stateTextRender(stateText, scaleX, pickX);
    dataPlot = updateToolTip(dataPlot, pickX, pickY);

  if (pickX === "age") {
    ageX.classed("active", true).classed("inactive", false);
    povertyX.classed("active", false).classed("inactive", true);
    incomeX.classed("active", false).classed("inactive", true);
  }
  else if (pickX === "poverty") {
    povertyX.classed("active", true).classed("inactive", false);
    ageX.classed("active", false).classed("inactive", true);
    incomeX.classed("active", false).classed("inactive", true);
  }
  else {
    incomeX.classed("active", true).classed("inactive", false);
    ageX.classed("active", false).classed("inactive", true);
    povertyX.classed("active", false).classed("inactive", true);
  }}});

 labelY.selectAll("text").on("click", function() {
  var value = d3.select(this).attr("value");
  if (value !== pickY) {
    pickY = value;
    scaleY = yScale(dataFetch, pickY);
    chartLeft = renderYAxes(scaleY, chartLeft);
    stateCircle = renderYCircles(stateCircle, scaleY, pickY);
    stateText = renderYText(stateText, scaleY, pickY);
    dataPlot = updateToolTip(dataPlot, pickX, pickY);

  if (pickY === "obesity"){
    obeseY.classed("active", true).classed("inactive", false);
    healthY.classed("active", false).classed("inactive", true);
    smokeY.classed("active", false).classed("inactive", true);
  }
  else if (pickY === "healthcare"){
    healthY.classed("active", true).classed("inactive", false);
    obeseY.classed("active", false).classed("inactive", true);
    smokeY.classed("active", false).classed("inactive", true);
  }
  else {
    smokeY.classed("active", true).classed("inactive", false);
    obeseY.classed("active", false).classed("inactive", true);
    healthY.classed("active", false).classed("inactive", true);
  }}});

})()

function xScale(csvData, pickX) {
  var scaleX = d3.scaleLinear().domain([
    d3.min(csvData, d => d[pickX]) * 0.9,
    d3.max(csvData, d => d[pickX]) * 1.1
    ])
    .range([0, width]);
  return scaleX;
}
function yScale(csvData, pickY) {
  var scaleY = d3.scaleLinear().domain([
    d3.min(csvData, d => d[pickY]) - 1,
    d3.max(csvData, d => d[pickY]) + 1
    ])
    .range([height, 0]);
  return scaleY;
}
function chartBottomRender(xScale2, chartBottom) {
  var xaxis = d3.axisBottom(xScale2);
  chartBottom.transition()
    .duration(250)
    .call(xaxis);
  return chartBottom;
}
function renderYAxes(yScale2, chartLeft) {
  var yaxis = d3.axisLeft(yScale2);
  chartLeft.transition()
    .duration(250)
    .call(yaxis);
  return chartLeft;
}
function stateCircleRender(dataPlot, xScale2, pickX) {
  dataPlot.transition()
    .duration(250)
    .attr("cx", d => xScale2(d[pickX]));
  return dataPlot;
}
function renderYCircles(dataPlot, yScale2, pickY) {
  dataPlot.transition()
    .duration(250)
    .attr("cy", d => yScale2(d[pickY]));
  return dataPlot;
}
function stateTextRender(dataPlot, xScale2, pickX) {
  dataPlot.transition()
    .duration(250)
    .attr("dx", d => xScale2(d[pickX]));
  return dataPlot;
}
function renderYText(dataPlot, yScale2, pickY) {
  dataPlot.transition()
    .duration(250)
    .attr("dy", d => yScale2(d[pickY])+5);
  return dataPlot;
}

function updateToolTip(dataPlot, pickX, pickY) {
  var xlabel = "";
  if (pickX === "poverty") {
    xlabel = "Poverty";
  } else if (pickX === "age"){
    xlabel = "Age";
  } else {
    xlabel = "Income";
  }
  var ylabel = "";
  if (pickY === "healthcare") {
    ylabel = "Healthcare";
  } else if (pickY === "obesity"){
    ylabel = "Obesity";
  } else {
    ylabel = "Smokes";
  }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([120, 0])
    .html(function(d) {
  if (pickX === "income"){
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    var incomelevel = formatter.format(d[pickX]);
    return (`${d.state}<br><br>${xlabel}: ${incomelevel}<br>${ylabel}: ${d[pickY]}`)
    } else {
    return (`${d.state}<br><br>${xlabel}: ${d[pickX]}<br>${ylabel}: ${d[pickY]}`)
    };
    });

  dataPlot.call(toolTip);
  dataPlot.on("mouseover", function(data) {toolTip.show(data, this);})
  dataPlot.on("mouseout", function(data) {toolTip.hide(data, this);});
return dataPlot;
}