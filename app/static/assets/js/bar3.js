// @TODO: YOUR CODE HERE!
var barSvgWidth = 960 * 1.25;
var barSvgHeight = 960 * 1.25;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var padding

var barWidth = barSvgWidth - margin.left - margin.right;
var barHeight = barSvgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var barSvg = d3
  .select(".barChart")
  .append("svg")
  .attr("width", barSvgWidth)
  .attr("height", barSvgHeight);

// Append an SVG group
var rectChartGroup = barSvg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv('/static/assets/data/data.csv').then(function(healthData) {
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
  var dropdownDiv = d3.select('.barSelect').append('div').classed('form-group', true).append('label')
    .attr('for', 'barChartSelect')
    .text('Select X Axis Data Vector');
  var dropdown = dropdownDiv.append('select').classed('form-control', true).attr('id', 'barChartSelect');
  var dropdownOptions = dropdown.selectAll('option').data(headers).enter()
                                .append('option')
                                .text(d => d)
                                .attr('value', d => d);

  var chosenSelect = headers[0]
  

	var xLinearScaleRect = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => +d[chosenSelect])])
    .rangeRound([0, barWidth])


  var yBandScaleRect = d3.scaleBand()
    .domain(healthData.map(d => d.state))
    .range([barHeight, 0])
    .paddingInner(0.05)
    // .paddingOuter(0.05)

  var topAxisRect = d3.axisTop(xLinearScaleRect);
  var leftAxisRect = d3.axisLeft(yBandScaleRect);
          

  var xAxisRect = rectChartGroup.append("g")
    .classed("x axis", true)
    // .attr("transform", `translate(0, ${height})`)
    .call(topAxisRect);
  // append y axis
  var yAxisRect = rectChartGroup.append("g")
    .classed("y axis", true)
    //.attr("transform", `translate(${width})`)
    .call(leftAxisRect);

  var xAxisGroupRect = rectChartGroup.append("g")
    .attr("transform", `translate(${barWidth / 2}, ${barHeight + 20})`)
    .classed("axis-text", true);


  var xAxisLabelRect = xAxisGroupRect.append("text")
    .attr("x", 0)
    .attr("y", -(barHeight + 25))
    .attr("value", `${chosenSelect}`) // value to grab for event listener
    .classed("barXLabel", true)
    .text(`${chosenSelect}`);

  var colors = d3.scaleQuantize()
    .domain([0, d3.max(healthData, d => +d[chosenSelect])])
    .range(healthData.map(d => "rgb(0, " + (d[chosenSelect] * 10) + ", " + (d[chosenSelect] * 10)  + ")"))
  var colors2 = d3.scaleQuantize()
    .domain([0, d3.max(healthData, d => +d[chosenSelect])])
    .range(healthData.map(d => "rgb(0, " + (d[chosenSelect] * 1) + ", " + (d[chosenSelect] * 10)  + ")"))

  var rectGroups = rectChartGroup.selectAll("rect")
	  .data(healthData)
	  .enter()
    .append('rect')
    .attr("x", 0)
    .attr("y", function(d, i) { return yBandScaleRect(d.state)})
    .attr('width', d => xLinearScaleRect(d[chosenSelect]))
    .attr('height', yBandScaleRect.bandwidth())
    .attr("opacity", ".8")
    .style('fill', d => (d[chosenSelect] < +average(healthData, chosenSelect)) ? colors(d[chosenSelect]) :  colors2(d[chosenSelect]))
    .classed('bar', true)
    .on("mouseover", function() {
      d3.select(this)
      .attr('fill', "purple")
      console.log(this)
    })
    .on("mouseout", function() {
      d3.select(this)
    });
  var rectLabelsGroup = rectChartGroup.append('g')
    .classed('rectLabel', true)

  var rectLabels = rectLabelsGroup.selectAll('text')
    .data(healthData)
    .enter()
    .append('text')
    .text(d => d[chosenSelect])
    .attr("x", d => xLinearScaleRect(d[chosenSelect]) - 30)
    .attr("y", function(d, i) { return yBandScaleRect(d.state) + 13.5})
    .style('font-size', 9)
    .style('fill', 'silver')
    .style('text-align', 'center')
    .classed('rectLabel', true)


  var rectToolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, -0])
    .html(function(d) {
      return (`${d.state}: ${chosenSelect}: ${d[chosenSelect]}`);
    });

  rectGroups.call(rectToolTip);

  rectGroups.on("mouseover", function(data) {
    d3.select(this).style('fill', "purple")
    rectToolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      d3.select(this).style('fill', d => (d[chosenSelect] < +average(healthData, chosenSelect)) ? colors(d[chosenSelect]) :  colors2(d[chosenSelect]))

      rectToolTip.hide(data);
  });
  var sortOrder = false;
  d3.select('.barChart').on('click', function(d) {
    sortOrder = !sortOrder
    healthData = healthData.sort((a,b) => (sortOrder) ? d3.ascending(a[chosenSelect], b[chosenSelect]) : d3.descending(a[chosenSelect], b[chosenSelect]))
    console.log(average(healthData, chosenSelect))
    // yBandScaleRect.select('.domain').remove()
    yBandScaleRect.domain(healthData.map(d => d.state))
    xLinearScaleRect.domain([0, d3.max(healthData, d => +d[chosenSelect])])
    yBandScaleRect.range([barHeight, 0])
    var topAxisRect = d3.axisTop(xLinearScaleRect);
    var leftAxisRect = d3.axisLeft(yBandScaleRect);
  

    d3.selectAll("rect")
              .data(healthData)
              .order()
              .transition()
              .duration(1000)
              .attr("x", 0)
              .attr("y", function(d, i) { return yBandScaleRect(d.state)})
              .attr('width', d => xLinearScaleRect(d[chosenSelect]))
              .attr('height', yBandScaleRect.bandwidth())
              .style('fill', d => (d[chosenSelect] < +average(healthData, chosenSelect)) ? colors(d[chosenSelect]) :  colors2(d[chosenSelect]))

                    
    rectLabelsGroup.selectAll("text")
              .data(healthData)
              .order()
              .transition()
              .duration(1000)
              .text(d => d[chosenSelect])
              .attr("x", d => xLinearScaleRect(d[chosenSelect]) - 30)
              .attr("y", function(d, i) { return yBandScaleRect(d.state) + 13})
                 
    d3.select(".x.axis")
            .transition()
            .duration(1000)
          	.call(topAxisRect);
    d3.select(".y.axis")
            .transition()
            .duration(1000)
          	.call(leftAxisRect);
  })
  var alphaSortOrder = false
  d3.select('#alphabetize').on('click', function(d) {
    alphaSortOrder = !alphaSortOrder
    healthData = healthData.sort((a,b) => (alphaSortOrder) ? d3.descending(a['state'], b['state']) : d3.ascending(a['state'], b['state']))
    var button = d3.select(this).select('i')
    if (alphaSortOrder) {
      button.attr('class', 'fas fa-sort-alpha-down')
    } else {
      button.attr('class', 'fas fa-sort-alpha-up')
    }
    // (button.attr('class', 'fas fa-sort-alpha-up')) ? button.attr('class', 'fas fa-sort-alpha-down') : button.attr('class', 'fas fa-sort-alpha-up');
    // yBandScaleRect.select('.domain').remove()
    yBandScaleRect.domain(healthData.map(d => d.state))
    xLinearScaleRect.domain([0, d3.max(healthData, d => +d[chosenSelect])])
    yBandScaleRect.range([barHeight, 0])
    var topAxisRect = d3.axisTop(xLinearScaleRect);
    var leftAxisRect = d3.axisLeft(yBandScaleRect);
  

    d3.selectAll("rect")
              .data(healthData)
              .order()
              .transition()
              .duration(1000)
              .attr("x", 0)
              .attr("y", function(d, i) { return yBandScaleRect(d.state)})
              .attr('width', d => xLinearScaleRect(d[chosenSelect]))
              .attr('height', yBandScaleRect.bandwidth())
              .style('fill', d => (d[chosenSelect] < +average(healthData, chosenSelect)) ? colors(d[chosenSelect]) :  colors2(d[chosenSelect]))

                    
    rectLabelsGroup.selectAll("text")
              .data(healthData)
              .order()
              .transition()
              .duration(1000)
              .text(d => d[chosenSelect])
              .attr("x", d => xLinearScaleRect(d[chosenSelect]) - 30)
              .attr("y", function(d, i) { return yBandScaleRect(d.state) + 13})
                 
    d3.select(".x.axis")
            .transition()
            .duration(1000)
          	.call(topAxisRect);
    d3.select(".y.axis")
            .transition()
            .duration(1000)
          	.call(leftAxisRect);
  })

	var selector = d3.select("#barChartSelect")
    	.on("change", function(d){
        var value = d3.select(this).node().value;
        if (value !== chosenSelect) {

          // replaces chosenSelect with value
          chosenSelect = value;
          xLinearScaleRect.domain([0, d3.max(healthData, d => +d[chosenSelect])])
  
          console.log(chosenSelect)
          xLinearScaleRect.domain([0, d3.max(healthData, d => +d[chosenSelect])])

        	// yAxisRect.scaleLinear(xLinearScaleRect);

        	d3.selectAll("rect")
              .transition()
              .duration(1000)
              .attr("x", 0)
              .attr("y", function(d, i) { return yBandScaleRect(d.state)})
              .attr('width', d => xLinearScaleRect(d[chosenSelect]))
              .attr('height', yBandScaleRect.bandwidth())
              .style('fill', d => (d[chosenSelect] < +average(healthData, chosenSelect)) ? colors(d[chosenSelect]) :  colors2(d[chosenSelect]))

                    
          rectLabelsGroup.selectAll("text")
              .data(healthData)
              .transition()
              .duration(1000)
              .text(d => d[chosenSelect])
              .attr("x", d => xLinearScaleRect(d[chosenSelect]) - 30)
              .attr("y", function(d, i) { return yBandScaleRect(d.state) + 13})
                 
          d3.select(".x.axis")
              .transition()
              .duration(1000)
              .call(topAxisRect);
          d3.select(".y.axis")
              .transition()
              .duration(1000)
              .call(leftAxisRect);
        }
      });



});
