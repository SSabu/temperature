fetch("/json/tempe_temp.json").then(res => res.json()).then((data) => drawChart(data));

drawMap();

const timeSeriesData = [];

const step = 0;

function drawMap() {

  const width = 350;
  const height = 350;

  const svg = d3.select("#map").append("svg")
                .classed("svg-container", true)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 350 350")
                .classed("svg-content", true)
                .append("g");

  const tempe = [-111.929, 33.4197];
  const mesa = [-111.818, 33.4114];
  const phoenix = [-112.016, 33.4333];

  const projection = d3.geoTransverseMercator()
                       .scale(10000)
                       .rotate([112, -35])
                       .translate([200,-90]);

  const path = d3.geoPath()
                 .projection(projection);

  d3.json("/json/county.json").then(county => {

    svg.append("g")
    .selectAll("path")
    .data(county.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", "#000000")
    .style("stroke-width", "1")
    .style("fill","none");

    svg.selectAll("circle")
    .data([tempe, mesa, phoenix]).enter()
    .append("circle")
    .attr("cx", function (d) { return projection(d)[0]; })
    .attr("cy", function (d) { return projection(d)[1]; })
    .attr("r", "3px")
    .attr("fill", function(d,i) { var colors = ["red", "green", "blue"]; return colors[i]; });
  });

};

function drawChart(data) {

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1140 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y-%m-%d");

  data.forEach(function(el) {
    el.Date = parseTime(el.Date);
    el.MaxTemperature = +parseInt(el.MaxTemperature);
    el.MinTemperature = +parseInt(el.MinTemperature);
  });

  var timeSeriesYear = [];

  var year = data[0]["Date"].getFullYear();

  var lastYear = data[data.length-1]["Date"].getFullYear();

  // console.log("this year", year, lastYear);
  // console.log(data);

  var increment = year;

  timeSeriesYear.push(year);

  while(increment<=lastYear) {
    increment += 10;
    timeSeriesYear.push(increment);
  }

  // var tally = 0;

  for (var i=0; i<timeSeriesYear.length; i++) {
    timeSeriesData.push(data.filter(function(el){
      return el.Date.getFullYear()>=timeSeriesYear[i] && el.Date.getFullYear()<timeSeriesYear[i+1];
    }));
  }

  // console.log(timeSeriesYear);
  // console.log(timeSeriesData);

  timeSeriesData.pop();

  // timeSeriesData.forEach(function(el) {
  //   tally += el.length;
  // })

  // console.log(tally);
  //
  // console.log(timeSeriesData);

  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  // define the 1st line
  var valueline = d3.line()
      .x(function(d) { return x(d.Date); })
      .y(function(d) { return y(d.MaxTemperature); });

  // define the 2nd line
  var valueline2 = d3.line()
      .x(function(d) { return x(d.Date); })
      .y(function(d) { return y(d.MinTemperature); });

  const svg = d3.select("#chart").append("svg")
                .classed("svg-container", true)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + (width + 100) + " " + (height + 100))
                .classed("svg-content", true)
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(timeSeriesData[0], function(d) { return d.Date; }));
  y.domain([0, d3.max(timeSeriesData[0], function(d) { return Math.max(d.MaxTemperature, d.MinTemperature); })]);

  x.nice();
  y.nice();

  svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )

  svg.append("path")
    .data([timeSeriesData[0]])
    .attr("class", "line")
    .style("stroke", "red")
    .attr("d", valueline);
    // .on("mouseover", function(d) { console.log(d); });

  // Add the valueline2 path.
  svg.append("path")
      .data([timeSeriesData[0]])
      .attr("class", "line")
      .style("stroke", "steelblue")
      .attr("d", valueline2);
      // .on("mouseover", function(d) { console.log(d); });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  function make_y_gridlines() {
    return d3.axisLeft(y)
        .ticks(5) };
};
