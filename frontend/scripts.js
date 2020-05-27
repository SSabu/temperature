fetch("/json/phoenix_temp.json").then(res => res.json()).then((data) => drawChart(data));

drawMap();

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
       .attr("id", function(d,i){ var ids=["tempe", "mesa", "phoenix"]; return ids[i]; })
       .attr("fill", function(d,i) { var colors = ["red", "green", "blue"]; return colors[i]; });

    svg.append("text")
       .text("Maricopa County Temperature Stations")
       .attr("x", function(d) { var textSelection = d3.selectAll('text'); var textLength = textSelection._groups[0][textSelection._groups[0].length-1].getComputedTextLength(); return (width - textLength-10)/2; })
       .attr("y", 40);

   svg.append("text")
      .text("(click on station to see data)")
      .attr("x", function(d) { var textSelection = d3.selectAll('text'); var textLength = textSelection._groups[0][textSelection._groups[0].length-1].getComputedTextLength(); return (width - textLength-10)/2; })
      .attr("y", 55)
      .style("font-size","13px");

   svg.append("circle")
      .attr("cx", 200)
      .attr("cy", 260)
      .attr("r", 3)
      .attr("fill", "blue");

  svg.append("text")
     .attr("x", 205)
     .attr("y", 264)
     .style("font-size", "11px")
     .text("Phoenix ASOS Station");

  svg.append("circle")
     .attr("cx", 200)
     .attr("cy", 280)
     .attr("r", 3)
     .attr("fill", "red");

  svg.append("text")
     .attr("x", 205)
     .attr("y", 284)
     .style("font-size", "11px")
     .text("Tempe Station");

  svg.append("circle")
     .attr("cx", 200)
     .attr("cy", 300)
     .attr("r", 3)
     .attr("fill", "green");

  svg.append("text")
     .attr("x", 205)
     .attr("y", 304)
     .style("font-size", "11px")
     .text("Mesa Station");

    d3.select("#phoenix")
      .attr("cursor","pointer")
      .on("click", function() {

        // console.log("phoenix");

        $("#chart").empty();
        $("#title").empty();
        $("#title").text("Phoenix ASOS Station Max and Min Temperature Data");

        fetch("/json/phoenix_temp.json").then(res => res.json()).then((data) => drawChart(data));

      });

    d3.select("#mesa")
      .attr("cursor","pointer")
      .on("click", function() {

        // console.log("mesa");

        $("#chart").empty();
        $("#title").empty();
        $("#title").text("Mesa Station Max and Min Temperature Data");

        fetch("/json/mesa_temp.json").then(res => res.json()).then((data) => drawChart(data));

      });

    d3.select("#tempe")
      .attr("cursor","pointer")
      .on("click", function() {

        // console.log("tempe");

        $("#chart").empty();
        $("#title").empty();
        $("#title").text("Tempe Station Max and Min Temperature Data");

        fetch("/json/tempe_temp.json").then(res => res.json()).then((data) => drawChart(data));

      });

  });
};

function drawChart(data) {

  var parseTime = d3.timeParse("%Y-%m-%d");

  data.forEach(function(el) {
    el.Date = parseTime(el.Date);
    el.MaxTemperature = +parseInt(el.MaxTemperature);
    el.MinTemperature = +parseInt(el.MinTemperature);
  });

  var margin = {top: 20, right: 20, bottom: 30, left: 20},
    width = 1140 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var mini_margin = {top: 10, right: 10, bottom: 10, left: 20},
      mini_height = 150 - mini_margin.top - mini_margin.bottom;

  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var mini_x = d3.scaleTime().range([0,width]);
  var mini_y = d3.scaleLinear().range([mini_height, 0]);

  var xAxis = d3.axisBottom(x);
  var mini_xAxis = d3.axisBottom(mini_x);

  var valueline = d3.line()
      .x(function(d) { return x(d.Date); })
      .y(function(d) { return y(d.MaxTemperature); });

  var valueline2 = d3.line()
      .x(function(d) { return x(d.Date); })
      .y(function(d) { return y(d.MinTemperature); });

  var mini_valueLine = d3.line()
                         .x(function(d) { return mini_x(d.Date); })
                         .y(function(d) { return mini_y(d.MaxTemperature); });

  var mini_valueLine2 = d3.line()
                          .x(function(d) { return mini_x(d.Date); })
                          .y(function(d) { return mini_y(d.MinTemperature); });

  const svg = d3.select("#chart").append("svg")
                .classed("svg-container", true)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + (width+100) + " 750")
                .classed("svg-content", true)
                .append("g")
                .attr("transform","translate(" + (3*margin.left) + "," + (margin.top) + ")");

  const svg1 = svg.append("svg")
                .attr("id","clip")
                .attr("width", width)
                .attr("height", height);

  x.domain(d3.extent(data, function(d) { return d.Date; }));
  y.domain([0, d3.max(data, function(d) { return Math.max(d.MaxTemperature, d.MinTemperature); })]);

  mini_x.domain(d3.extent(data, function(d) { return d.Date; }));
  mini_y.domain([0, d3.max(data, function(d) { return Math.max(d.MaxTemperature, d.MinTemperature); })]);

  x.nice();
  y.nice();

  mini_x.nice();

  var focus = svg.append("g")
                 .attr("class", "focus");

  var focus1 = svg1.append("g")
                 .attr("class", "focus");

  var context = svg.append("g")
                   .attr("class", "context")
                   .attr("transform", "translate("+ mini_margin.left+","+mini_margin.top+")");

  var leftHandle = 0;
  var rightHandle = 1140;
  var currentExtent = [0,0];

  var brush = d3.brushX()
                .extent([[leftHandle,0],[rightHandle, mini_height]])
                .on("brush start", updateCurrentExtent)
                .on("brush end", brushed);

  var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

  focus1.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat(""));

  focus1.append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "red")
    .attr("d", valueline);

  focus1.append("path")
      .data([data])
      .attr("class", "line2")
      .style("stroke", "steelblue")
      .attr("d", valueline2);

  focus.append("g")
       .attr("class", "axis axis--x")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

  focus.append("g")
       .attr("class", "axis axis--y")
       .call(d3.axisLeft(y));

  focus.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - (2.5*margin.left))
       .attr("x", 0 - (height/2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text("Temperature (°F)");

  focus.append("text")
       .attr("transform", "translate("+(width/2)+","+ (height + margin.top + 20)+")")
       .style("text-anchor", "middle")
       .text("Time");

  function make_y_gridlines() {
    return d3.axisLeft(y)
        .ticks(5) };

  context.append("path")
         .data([data])
         .attr("class","line")
         .style("stroke", "red")
         .attr("transform", "translate(0,"+ (4*mini_height - 20)+")")
         .attr("d", mini_valueLine);

  context.append("path")
         .data([data])
         .attr("class","line2")
         .style("stroke","steelblue")
         .attr("transform", "translate(0,"+ (4*mini_height - 20)+")")
         .attr("d", mini_valueLine2);

  context.append("g")
         .attr("transform", "translate(0,"+ (5*mini_height - 20)+")")
         .call(mini_xAxis);

  var brushg = context.append("g")
         .attr("class", "brush")
         .on("click", brushed)
         .call(brush)
         .attr("transform", "translate(0,"+ (4*mini_height - 20)+")")
         .call(brush.move, [new Date(1905,0,1),new Date(1910,0,1)].map(x));

 context.append("text")
        .text("adjust extent and position of gray box to highlight data on main chart")
        .attr("x", 0)
        .attr("y", 0)
        .style("font-size","11px")
        .attr("transform", "translate(0,"+ (5*mini_height+30)+")");

 function updateCurrentExtent() {
   	currentExtent = d3.brushSelection(this);
   	}

  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection;

    var p = currentExtent,
      xYear = x(new Date(1905,0,1)),
      left,
      right;

    if (d3.event.selection && s[1] - s[0] >= xYear) {
    if (p[0] == s[0] && p[1] < s[1]) { // case where right handle is extended
      if (s[1] >= width) {
        left = width - xYear
      right = width
      s = [left, right];
      }
      else {
        left = s[1] - xYear/2
      right = s[1] + xYear/2
      s = [left, right];
      }
    }
    else if (p[1] == s[1] && p[0] > s[0]) { // case where left handle is extended
      if (s[0] <= 0) {
        s = [0, xYear];
      }
      else {
        s = [s[0] - xYear/2, s[0] + xYear/2]
      }
    }
    }

    if (!d3.event.selection){ // if no selection took place and the brush was just clicked
    var mouse = d3.mouse(this)[0];
    if (mouse < xYear/2) {
      s = [0,xYear];
    } else if (mouse + xYear/2 > width) {
      s = [width-xYear, width];
    }
    else {
    s = [d3.mouse(this)[0]-xYear/2, d3.mouse(this)[0]+xYear/2];
    }
    }

    x.domain(s.map(mini_x.invert, mini_x));
    focus1.select(".line").attr("d", valueline);
    focus1.select(".line2").attr("d", valueline2);
    focus.select(".axis--x").call(xAxis);
    }

  function zoomed() {
	  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
	  var t = d3.event.transform;
	  x.domain(t.rescaleX(xAxis).domain());
	  focus1.select(".line").attr("d", valueline);
    focus1.select(".line2").attr("d", valueline2);
	  focus.select(".axis--x").call(xAxis);
	  context.select(".brush").call(brush.move, mini_x.range().map(t.invertX, t));
	 }

};
