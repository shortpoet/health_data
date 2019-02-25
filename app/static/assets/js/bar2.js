// @TODO: YOUR CODE HERE!
var svgWidth = 960 * 1.75;
var svgHeight = 500 * 1.75;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var padding

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var barSvg = d3
  .select(".barChart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var rectChartGroup = barSvg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv('/assets/data/data.csv').then(function(healthData) {
  healthData.forEach(data => {
    var obesity = +data.obesity
    var smokes = +data.smokes
    var healthcare = +data.healthcare
    var poverty = +data.poverty
    var age = +data.age
    var income = +data.income
    var state = data.state
    var abbr = data.abbr
    data.obesity = +data.obesity
    data.smokes = +data.smokes
    data.healthcare = +data.healthcare
    data.poverty = +data.poverty
    data.age = +data.age
    data.income = +data.income
    data.state = data.state
    data.abbr = data.abbr
  })
  var headers = d3.keys(healthData[0])
  headers = headers.slice(3,4).concat(headers.slice(5,6)).concat(headers.slice(7,8)).concat(headers.slice(9,10)).concat(headers.slice(12,13)).concat(headers.slice(15,16))
  var dropdownDiv = d3.select('.barChart').append('div').classed('form-group', true).append('label')
    .attr('for', 'barChartSelect')
    .text('Select Y Axis Data Vector');
  var dropdown = dropdownDiv.append('select').classed('form-control', true).attr('id', 'barChartSelect');
  var dropdownOptions = dropdown.selectAll('option').data(headers).enter()
                                .append('option')
                                .text(d => d)
                                .attr('value', d => d);

  var chosenSelect = headers[0]
  

	var yLinearScaleRect = d3.scaleLinear()
            .domain([0, d3.max(healthData, d => +d[chosenSelect])])
            .range([height, 0]);

	var xBandScale = d3.scaleBand()
            .domain(healthData.map(d => d.abbr))
            .rangeRound([0, width])
            .paddingInner(0.05)
            // .paddingOuter(0.05)
  
  var bottomAxisRect = d3.axisBottom(xBandScale);
  var leftAxisRect = d3.axisLeft(yLinearScaleRect);
          

  var xAxisRect = rectChartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxisRect);
  // append y axis
  var yAxisRect = rectChartGroup.append("g")
    .classed("y-axis", true)
    //.attr("transform", `translate(${width})`)
    .call(leftAxisRect);

  var yAxisGroup = rectChartGroup.append("g")
    .attr("transform", `translate(${-(margin.left)}, ${(height / 2)}) rotate(-90)`)
    .classed("axis-text", true);


  var yAxisLabel = yAxisGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", `${chosenSelect}`) // value to grab for event listener
    .classed("barYLabel", true)
    .text(`${chosenSelect}`);

  var rectGroups = rectChartGroup.selectAll("rect")
	  .data(healthData)
	  .enter()
    .append('rect')
    .attr("x", function(d, i) { return xBandScale(d.abbr)})
    .attr("y", d => yLinearScaleRect(d[chosenSelect]))
    .attr('width', xBandScale.bandwidth())
    .attr('height', d => height - yLinearScaleRect(d[chosenSelect]))
    .attr("opacity", ".8")
    .attr("fill", d => "rgb(0, 0, " + Math.round(d[chosenSelect] * 10) + ")")
    .classed('bar', true)
    .append('title')

  var rectToolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, -0])
    .html(function(d) {
      return (`${d.state}: ${chosenSelect}: ${d[chosenSelect]}`);
    });

  rectGroups.call(rectToolTip);

  rectGroups.on("mouseover", function(data) {
    rectToolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      rectToolTip.hide(data);
  });
  
  var rectLabelsGroup = rectChartGroup.append('g')
    .classed('rectLabel', true)

  var rectLabels = rectLabelsGroup.selectAll('text')
    .data(healthData)
    .enter()
    .append('text')
    .text(d => d[chosenSelect])
    // .attr('text-anchor', 'middle')
    .attr("x", function(d, i) { return xBandScale(d.abbr) + 2})
    .attr("y", d => yLinearScaleRect(d[chosenSelect]) + 16)
    .style('font-size', 8)
    .style('fill', 'silver')
    .style('text-align', 'center')
    .classed('rectLabel', true)

	var selector = d3.select("#barChartSelect")
    	.on("change", function(d){
        var value = d3.select(this).node().value;
        if (value !== chosenSelect) {

          // replaces chosenSelect with value
          chosenSelect = value;
          yLinearScaleRect.domain([0, d3.max(healthData, d => +d[chosenSelect])])
  
          console.log(chosenSelect)
          yLinearScaleRect.domain([0, d3.max(healthData, d => +d[chosenSelect])])

        	// yAxisRect.scaleLinear(yLinearScaleRect);

        	d3.selectAll("rect")
              .transition()
              .duration(1000)
              .attr("x", function(d, i) { return xBandScale(d.abbr)})
              .attr("y", d => yLinearScaleRect(d[chosenSelect]))
              .attr('height', d => height - yLinearScaleRect(d[chosenSelect]))
              // .ease("linear")
           		.select("title")
              .text(d => d[chosenSelect]);
          
          rectLabelsGroup.selectAll("text")
              .data(healthData)
              .transition()
              .duration(1000)
              .text(d => d[chosenSelect])
              .attr("x", function(d, i) { return xBandScale(d.abbr) + 2})
              .attr("y", d => yLinearScaleRect(d[chosenSelect]) + 16)
                 
          d3.selectAll("g.y.axis")
          	.transition()
          	.call(leftAxisRect);
        }
      });

    // selector.selectAll("option")
    //   .data(elements)
    //   .enter().append("option")
    //   .attr("value", function(d){
    //     return d;
    //   })
    //   .text(function(d){
    //     return d;
    //   })


});
