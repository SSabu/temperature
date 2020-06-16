fetch("/json/phoenix_temp.json").then(res => res.json()).then(function(data) { drawChart(data); createBars(data); });

fetch("/json/county.json").then(res => res.json()).then(function(data) { drawLMap(data); });

// drawMap();

var menu = document.getElementById("stationMenu");
menu.addEventListener("change", generateData);

function generateData(event) {
  if (menu.value == 'phoenix') {
    // alert(1);

    $("#chart").empty();
    $("#title").empty();
    $("#bars").empty();
    $("#axis").empty();
    $("#title").text("Phoenix ASOS Station Max and Min Temperature Data");

    fetch("/json/phoenix_temp.json").then(res => res.json()).then(function(data) { drawChart(data); createBars(data); });

  } else if (menu.value == 'tempe') {

    $("#chart").empty();
    $("#title").empty();
    $("#bars").empty();
    $("#axis").empty();
    $("#title").text("Tempe Station Max and Min Temperature Data");

    fetch("/json/tempe_temp.json").then(res => res.json()).then(function(data) { drawChart(data); createBars(data); });

    // alert(2);
  } else if (menu.value == 'mesa') {
    // alert(3);

    $("#chart").empty();
    $("#title").empty();
    $("#bars").empty();
    $("#axis").empty();
    $("#title").text("Mesa Station Max and Min Temperature Data");

    fetch("/json/mesa_temp.json").then(res => res.json()).then(function(data) { drawChart(data); createBars(data); });

  }
}

function drawLMap(json) {

  var tempMap = L.map('map', { zoomControl: false, attributionControl: false }).setView([33.2918, -112.1991], 7);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
  id: 'mapbox/light-v10',
  accessToken: 'pk.eyJ1Ijoic2FidW1hZm9vIiwiYSI6ImNqMWE3cnlqcTA5dncyd216YjI0bnY4dGEifQ.fgmXgmkvialdBd3D405_BA'
  }).addTo(tempMap);

  var coStyle = {
    fill: false,
    weight: 1,
    color: "#000000",
          };

  var temp = L.geoJSON(json, {style: coStyle}).addTo(tempMap);

  function getColor(stype) {
          switch (stype) {
            case 'Tempe Station':
              return  '#3333cc';
            case 'Mesa Station':
              return '#009900';
            case 'Phoenix ASOS Station':
              return '#ff0000';
          }
        };

  function setWeight(stype) {
          switch (stype) {
            case 'Tempe Station':
              return  0.25;
            case 'Mesa Station':
              return 0.25;
            case 'Phoenix ASOS Station':
              return 1;
          }
        };

  var stations = [{
    "type": "Feature",
    "properties": {
        "name": "Tempe Station",
        "show_on_map": true,
        "selected": false,
      },
    "geometry": {
        "type": "Point",
        "coordinates": [-111.929, 33.4197]
      }
    }, {
    "type": "Feature",
    "properties": {
        "name": "Mesa Station",
        "show_on_map": true,
        "selected": false,
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-111.818, 33.4114]
     }
   },
   {
    "type": "Feature",
    "properties": {
        "name": "Phoenix ASOS Station",
        "show_on_map": true,
        "selected": true,
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-112.016, 33.4333]
     }
   }];

   function showTooltip(e) {
      // e.target.setIcon(highlightMarker);
      e.target.openPopup();
    }

   function hideTooltip(e) {
     // e.target.setIcon(defaultMarker);
     e.target.closePopup();
   }

   var stationLayer = L.geoJSON(stations, {
     filter: function(feature,layer) {
       return feature.properties.show_on_map;
     },
     pointToLayer: function(feature, latlng){
       return L.circleMarker(latlng, {
         radius: 3.25,
         fillColor: getColor(feature.properties.name),
         color: "#000",
         weight: 0.5,
         opacity: 1,
         fillOpacity: 0.8
       })
     },

   }).addTo(tempMap);

   // $('#exampleModalCenter').on('show.bs.modal', function(){
   //     setTimeout(function() {
   //       tempMap.invalidateSize();
   //     }, 10);
   //  });

   var modal = $("#exampleModalCenter");

    modal.on('shown.bs.modal', function(){
      _.defer(tempMap.invalidateSize.bind(tempMap));
    })

    // modal.on('shown.bs.modal', function(){
    //     setTimeout(function() {
    //         map.invalidateSize();
    //    }, 10);
    // })

   // stationLayer.on("click", function(e) {
   //
   //   if (e.layer.feature.properties.name === "Mesa Station") {
   //
   //     stationLayer.setStyle({weight:0.25});
   //
   //     e.layer.setStyle({weight:1});
   //
   //     $("#chart").empty();
   //     $("#title").empty();
   //     $("#bars").empty();
   //     $("#axis").empty();
   //     $("#title").text("Mesa Station Max and Min Temperature Data");
   //
   //     fetch("/json/mesa_temp.json").then(res => res.json()).then(function(data) { drawChart(data); createBars(data); });
   //
   //     d3.select("#tempe").attr("font-weight", null);
   //     d3.select("#mesa").attr("font-weight", "bold");
   //     d3.select("#phoenix").attr("font-weight", null);
   //
   //     d3.select("#phoenix_cirlce").attr("stroke", null);
   //     d3.select("#tempe_circle").attr("stroke", null);
   //     d3.select("#mesa_circle").attr("stroke", "black");
   //
   //   }
   //
   //   if (e.layer.feature.properties.name === "Phoenix ASOS Station") {
   //
   //     stationLayer.setStyle({weight:0.25});
   //
   //     e.layer.setStyle({weight:1});
   //
   //     $("#chart").empty();
   //     $("#title").empty();
   //     $("#bars").empty();
   //     $("#axis").empty();
   //     $("#title").text("Phoenix ASOS Station Max and Min Temperature Data");
   //
   //     fetch("/json/phoenix_temp.json").then(res => res.json()).then(function(data) { drawChart(data); createBars(data); });
   //
   //     d3.select("#tempe").attr("font-weight", null);
   //     d3.select("#mesa").attr("font-weight", null);
   //     d3.select("#phoenix").attr("font-weight", "bold");
   //
   //     d3.select("#phoenix_cirlce").attr("stroke", "black");
   //     d3.select("#tempe_circle").attr("stroke", null);
   //     d3.select("#mesa_circle").attr("stroke", null);
   //
   //   }
   //
   //   if (e.layer.feature.properties.name === "Tempe Station") {
   //
   //     stationLayer.setStyle({weight:0.25});
   //
   //     e.layer.setStyle({weight:1});
   //
   //     $("#chart").empty();
   //     $("#title").empty();
   //     $("#bars").empty();
   //     $("#axis").empty();
   //     $("#title").text("Tempe Station Max and Min Temperature Data");
   //
   //     fetch("/json/tempe_temp.json").then(res => res.json()).then(function(data) { drawChart(data); createBars(data); });
   //
   //     d3.select("#tempe").attr("font-weight", "bold");
   //     d3.select("#mesa").attr("font-weight", null);
   //     d3.select("#phoenix").attr("font-weight", null);
   //
   //     d3.select("#phoenix_cirlce").attr("stroke", null);
   //     d3.select("#tempe_circle").attr("stroke", "black");
   //     d3.select("#mesa_circle").attr("stroke", null);
   //
   //   }
   // });

   const legend = d3.select("#legend").append("svg")
                    .attr("width", 200)
                    .attr("height", 200)
                    .append("g")
                    .attr("transform", "translate(10, 80)");

    legend.append("circle")
          .attr("cx", 22)
          .attr("cy", 50)
          .attr("r", 4)
          .attr("stroke", "black")
          .attr("id","phoenix_circle")
          .attr("fill", "red");

   legend.append("text")
         .attr("x", 30)
         .attr("y", 54)
         .attr("id", "phoenix")
         .style("font-size", "13px")
         .text("Phoenix ASOS Station");

   legend.append("circle")
         .attr("cx", 22)
         .attr("cy", 65)
         .attr("r", 4)
         .attr("stroke", "black")
         .attr("id","tempe_circle")
         .attr("fill", "blue");

   legend.append("text")
         .attr("x", 30)
         .attr("y", 69)
         .attr("id", "tempe")
         .style("font-size", "13px")
         .text("Tempe Station");

   legend.append("circle")
         .attr("cx", 22)
         .attr("cy", 80)
         .attr("r", 4)
         .attr("stroke", "black")
         .attr("id","mesa_circle")
         .attr("fill", "green");

   legend.append("text")
         .attr("x", 30)
         .attr("y", 84)
         .attr("id","mesa")
         .style("font-size", "13px")
         .text("Mesa Station");

};

function drawMap() {

  const width = 150;
  const height = 150;

  // const svg = d3.select("#map").append("svg")
  //               .classed("svg-container", true)
  //               .attr("preserveAspectRatio", "xMinYMin meet")
  //               .attr("viewBox", "0 0 850 850")
  //               .classed("svg-content", true)
  //               .append("g")
  //               .attr("transform", "translate(180,20)");

  const svg = d3.select("#map").append("svg")
                .attr("wdith", width)
                .attr("height", height)
                .append("g");

  const tempe = [-111.929, 33.4197];
  const mesa = [-111.818, 33.4114];
  const phoenix = [-112.016, 33.4333];

  const projection = d3.geoTransverseMercator()
                       .scale(10)
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

        $("#chart").empty();
        $("#title").empty();
        $("#bars").empty();
        $("#axis").empty();
        $("#title").text("Phoenix ASOS Station Max and Min Temperature Data");

        fetch("/json/phoenix_temp.json").then(res => res.json()).then(function(data) { drawChart(data); createBars(data); });

      });

    d3.select("#mesa")
      .attr("cursor","pointer")
      .on("click", function() {

        $("#chart").empty();
        $("#title").empty();
        $("#bars").empty();
        $("#axis").empty();
        $("#title").text("Mesa Station Max and Min Temperature Data");

        fetch("/json/mesa_temp.json").then(res => res.json()).then(function(data) { drawChart(data); createBars(data); });

      });

    d3.select("#tempe")
      .attr("cursor","pointer")
      .on("click", function() {

        $("#chart").empty();
        $("#title").empty();
        $("#bars").empty();
        $("#axis").empty();
        $("#title").text("Tempe Station Max and Min Temperature Data");

        fetch("/json/tempe_temp.json").then(res => res.json()).then(function(data) { drawChart(data); createBars(data); });

      });

  });
};

function drawChart(data) {

  var parseTime = d3.timeParse("%Y-%m-%d"),
  formatDate = d3.timeFormat("%Y-%m-%d"),
  bisectDate = d3.bisector(d => d.Date).left,
  formatValue = d3.format(",.0f");

  data.forEach(function(el) {
    el.Date = parseTime(el.Date);
    el.MaxTemperature = +parseInt(el.MaxTemperature);
    el.MinTemperature = +parseInt(el.MinTemperature);
  });

  var firstDate = data[0]["Date"];
  var firstYear = firstDate.getFullYear();
  var firstMonth = firstDate.getMonth();
  var firstDay = firstDate.getDate();
  var nextYear = firstYear + 5;

  var copy = ["MaxTemperature","MinTemperature"];

  var margin = {top: 20, right: 20, bottom: 30, left: 20},
    width = 940 - margin.left - margin.right,
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
                .attr("viewBox", "0 0 " + (width+100) + " 690")
                .classed("svg-content", true)
                .append("g")
                // .attr("background", "#f2f2f2")
                .attr("transform","translate(" + (3*margin.left) + "," + (margin.top/2) + ")");

  const svg1 = svg.append("svg")
                .attr("width", width)
                .attr("height", height);

  x.domain(d3.extent(data, function(d) { return d.Date; }));
  y.domain([0, d3.max(data, function(d) { return Math.max(d.MaxTemperature, d.MinTemperature); })]);

  mini_x.domain(d3.extent(data, function(d) { return d.Date; }));
  mini_y.domain([0, d3.max(data, function(d) { return Math.max(d.MaxTemperature, d.MinTemperature); })]);

  // x.nice();
  // y.nice(); interpolateRdYlBu #ff8000  #ff9933 #ff0000 - #ff3333 #e60000

  mini_x.nice();

  var colorScale = d3.scaleLinear()
                     .domain([1,3,5])
                     .range(['#ff0066','#ff9933','#ffff00']);

 var colorScale2 = d3.scaleLinear()
                    .domain([1,3,5])
                    .range(['#ff8000','#ffff66']);

 // var color = d3.scaleLinear().domain([1,3])
 //               .interpolate(d3.interpolateRdYlBu)
 //               .range(['#a70028','#a3d1e5']);
 //
 // var color2 = d3.scaleLinear().domain([1,3])
 //                .interpolate(d3.interpolateRdYlBu)
 //                .range(['#fdc779','#64a0c8']);

 // console.log(colorScale(1));
 // console.log(colorScale(3));
 // console.log(colorScale(5));

  var gradient = svg1.append("defs")
                    .append("linearGradient")
                    .attr("id", "gradient")
                    .attr("gradientTransform","rotate(90)");

  var gradient2 = svg1.append("defs")
                    .append("linearGradient")
                    .attr("id", "gradient2")
                    .attr("gradientTransform","rotate(90)");

  var focus = svg.append("g")
                 .attr("class", "focus");

  var focus1 = svg1.append("g")
                 .attr("class", "focus1");

  var context = svg.append("g")
                   .attr("class", "context")
                   .attr("transform", "translate("+ mini_margin.left+","+mini_margin.top+")");

  gradient.append("stop")
               .attr("offset", "0%")
               .attr("stop-color", colorScale(1));

  gradient.append("stop")
          .attr("offset", "50%")
          .attr("stop-color", colorScale(3));

  gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", colorScale(5));

  gradient2.append("stop")
               .attr("offset", "0%")
               .attr("stop-color", colorScale2(1));

  gradient2.append("stop")
          .attr("offset", "50%")
          .attr("stop-color", colorScale2(2));

  gradient2.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", colorScale2(3));

  var leftHandle = 0;
  var rightHandle = 1140;
  var currentExtent = [0,0];

  var brush = d3.brushX()
                .extent([[leftHandle,0],[rightHandle, mini_height]])
                .on("brush end", brushed);

  focus1.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat(""));

  focus1.append("path")
    .data([data])
    .attr("class", "line")
    // .style("stroke", function(d) { return colorScale(d.MaxTemperature)})
    .style("stroke", "url(#gradient)")
    .attr("d", valueline);

  focus1.append("path")
      .data([data])
      .attr("class", "line2")
      // .style("stroke", function(d) { return colorScale(d.MaxTemperature)})
      .style("stroke", "url(#gradient2)")
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
         .style("stroke","url(#gradient)")
         .attr("transform", "translate(0,"+ (4*mini_height - 20)+")")
         .attr("d", mini_valueLine);

  context.append("path")
         .data([data])
         .attr("class","line2")
         .style("stroke","url(#gradient2)")
         .attr("transform", "translate(0,"+ (4*mini_height - 20)+")")
         .attr("d", mini_valueLine2);

  context.append("g")
         .attr("transform", "translate(0,"+ (5*mini_height - 20)+")")
         .call(mini_xAxis);

  var brushg = context.append("g")
         .attr("class", "brush")
         .on("click", brushed)
         .call(brush)
         .attr("transform", "translate(0,"+ (4*mini_height - 20)+")");

  var brushResizePath = function(d) {
    var e = +(d.type == "e"),
        x = e ? 1 : -1,
        y = mini_height / 2;
      return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) + "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
  }

  var handleRight = brushg.selectAll(".handle-custom-w")
                     .data([{type: "w"}])
                     .enter().append("path")
                     .attr("class","handle-custom-w")
                     .attr("stroke","#000")
                     .attr("cursor", "ew-resize")
                     .attr("d", brushResizePath);

  var handleLeft = brushg.selectAll(".handle-custom-e")
                     .data([{type: "e"}])
                     .enter().append("path")
                     .attr("class","handle-custom-e")
                     .attr("stroke","#000")
                     .attr("cursor", "ew-resize")
                     .attr("d", brushResizePath);

  brushg.call(brush.move, [new Date(firstYear+5, firstMonth-1, firstDay), new Date(nextYear+5, firstMonth-1, firstDay)].map(x));

  context.append("text")
         .text("*adjust extent and position of gray box to highlight data on main chart")
         .attr("x", 0)
         .attr("y", 0)
         .style("font-size","11px")
         .attr("transform", "translate(0,"+ (5*mini_height+16)+")");

  function brushed() {

    var s = d3.event.selection;

    var p = currentExtent,
      xYear = mini_x(new Date(firstYear-5, firstMonth, firstDay)),
      left,
      right;

    if (s===null) {

      handleRight.attr("display", "none");
      handleLeft.attr("display", "none");

    }

    if (d3.event.selection && s[1] - s[0] >= xYear) {

      handleRight.attr("display", null).attr("transform","translate(" + [ s[0], -(mini_height/4) ] + ")").attr("stroke","black").attr("fill","black");
      handleLeft.attr("display", null).attr("transform","translate(" + [ s[1], -(mini_height/4) ] + ")").attr("stroke","black").attr("fill","black");

      if (p[0] == s[0] && p[1] < s[1]) {
        if (s[1] >= width) {
          left = width - xYear;
          right = width;
          s = [left, right];
        }
        else {
          left = s[1] - xYear/2;
          right = s[1] + xYear/2;
          s = [left, right];
        }
      }
      else if (p[1] == s[1] && p[0] > s[0]) {
        if (s[0] <= 0) {
          s = [0, xYear];
        }
        else {
          s = [s[0] - xYear/2, s[0] + xYear/2];
        }
      }
    }

    if (s===null) { return; }
    else { x.domain(s.map(mini_x.invert, mini_x)); }

    focus1.select(".line").attr("d", valueline);
    focus1.select(".line2").attr("d", valueline2);
    focus.select(".axis--x").call(xAxis);

    }

    // tooltip call

    // tooltip(copy);

    function tooltip(copy) {

      var labels = focus.selectAll(".lineHoverText")
        .data(copy);

      labels.enter().append("text")
        .attr("class", "lineHoverText")
        .style("fill", "black")
        .attr("text-anchor", "start")
        .attr("font-size",12)
        .attr("dy", (_, i) => 1 + i * 2 + "em")
        .merge(labels);

      var circles = focus.selectAll(".hoverCircle")
        .data(copy);

      circles.enter().append("circle")
        .attr("class", "hoverCircle")
        .style("fill", "black")
        .attr("r", 2.5)
        .merge(circles);

      svg.selectAll(".overlay")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

      function mousemove() {

        var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
                  d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;

        focus.select(".lineHover")
          .attr("transform", "translate(" + x(d.Date) + "," + height + ")");

        focus.select(".lineHoverDate")
          .attr("transform",
            "translate(" + x(d.Date) + "," + (height + margin.bottom) + ")")
          .text(formatDate(d.Date));

        focus.selectAll(".hoverCircle")
          .attr("cy", e => y(d[e]))
          .attr("cx", x(d.Date));

        focus.selectAll(".lineHoverText")
          .attr("transform",
            "translate(" + (x(d.Date)) + "," + height / 2.5 + ")")
          .text(e => e + " " + "º" + formatValue(d[e]));

        x(d.Date) > (width - width / 4)
          ? focus1.selectAll("text.lineHoverText")
            .attr("text-anchor", "end")
            .attr("dx", -10)
          : focus1.selectAll("text.lineHoverText")
            .attr("text-anchor", "start")
            .attr("dx", 10)
      }
    }

};

function createBars(data) {

  $("input[value=90]").prop("checked",true);

  var parseDate = d3.timeParse("%Y-%m-%d");

  function twoDigit(n) { return (n < 10 ? '0' : '') + n; }

  data.forEach(function(obj) {
    let date = obj["Date"];

    obj["Date"] = '' + date.getFullYear() + "-" + twoDigit(date.getMonth()+1) + "-" + twoDigit(date.getDate());
  });

  var dataObj = _.groupBy(data, function(obj) {
    return obj["Date"].slice(0,4);
  });

  const years = Object.keys(dataObj);

  // console.log(dataObj);

  const posObj = {};

  years.forEach(function(year) {

    var first90pos = 0;
    var last90pos = 0;
    var first100pos = 0;
    var last100pos = 0;

    var pos90arr = [];
    var pos100arr = [];

    dataObj[year].forEach(function(el, index) {
      el['Year'] = parseInt(year);
      el['MaxTemperature'] = parseInt(el['MaxTemperature']);
      el['Date'] = parseDate(el['Date']);
      var date = el['Date'];
      var firstJan = new Date(year, 0, 1);
      var differenceInMilliSeconds = date - firstJan;
      el['Day'] = differenceInMilliSeconds / (1000 * 60 * 60 * 24 ) + 1;

      if (el['MaxTemperature'] >= 90) {
        pos90arr.push(index);
      }
      if (el['MaxTemperature'] >= 100) {
        pos100arr.push(index);
      }
    });

    first90pos = pos90arr[0];
    last90pos = pos90arr[pos90arr.length-1]+1;

    first100pos = pos100arr[0];
    last100pos = pos100arr[pos100arr.length-1]+1;

    posObj[year] = [first90pos, last90pos, first100pos, last100pos];

  });

  var dataset90 = [];
  var dataset100 = [];

  years.forEach(function(year, index) {

    var yearDataObj = dataObj[year].slice(posObj[year][0], posObj[year][1]);

    yearDataObj.forEach(function(d) {
      d.Year = +d.Year;
      d.Day = +d.Day;
      d.MaxTemperature = +d.MaxTemperature;
      d.Index = index;
    });

    dataset90.push(...yearDataObj);

  });

  years.forEach(function(year, index) {
    var yrDataObject = dataObj[year].slice(posObj[year][2], posObj[year][3]);

    yrDataObject.forEach(function(d) {
      d.Year = +d.Year;
      d.Day = +d.Day;
      d.MaxTemperature = +d.MaxTemperature;
      d.Index = index;
    });

    dataset100.push(...yrDataObject);

  });

  var colorScale = d3.scaleLinear()
                     .domain(d3.range(80, 130, 10))
                     .range(['steelblue', 'gray', 'indianred']);

  var times = d3.range(365);

  var margin = {top: 40, right: 50, bottom: 70, left: 50};

  var w = 255;

  var gridSize = 5.4;

  var h = 3650;

  var svg = d3.select("#bars")
              .append("svg")
              .attr("width", 540)
              .attr("height", h + margin.left + margin.right)
              .append("g")
              .attr("transform", "translate(40,-10)");

  let distance = 30;

  years.forEach(function(year) {

    var yearLine = svg.append("line")
                      .attr("x1", 0)
                      .attr("x2", 490)
                      .attr("y1", distance+5)
                      .attr("y2", distance+5)
                      .attr("stroke-width", "0.65px")
                      .attr("stroke", "black");

    var begLine = svg.append("line")
                     .attr("x1", 0)
                     .attr("x2", 0)
                     .attr("y1", distance)
                     .attr("y2", distance+9)
                     .attr("stroke-width", "0.65px")
                     .attr("stroke", "black");

    var endLine = svg.append("line")
                     .attr("x1", 490)
                     .attr("x2", 490)
                     .attr("y1", distance)
                     .attr("y2", distance+9)
                     .attr("stroke-width", "0.65px")
                     .attr("stroke", "black");

    var yearLabel = svg.append("text")
                       .text(year)
                       .attr("class", "yearLabel")
                       .attr("x", -8)
                       .attr("y", distance+8)
                       .style("text-anchor", "end");

    distance += 30;

  });

  var tempBar = svg.selectAll(".hour")
                   .data(dataset90)
                   .enter()
                   .append("rect")
                   .attr("x", function(d) { return (d.Day-1)*gridSize/4; })
                   .attr("y", function(d) { return (d.Index+1)*30; })
                   .attr("class", "hour")
                   .attr("width", gridSize/4)
                   .attr("height", gridSize*2)
                   .style("fill", function(d) { return colorScale(d.MaxTemperature); });

   const buttons = d3.selectAll('input');

   var monthAxis = d3.select("#axis")
                     .append("svg")
                     .attr("width", 600)
                     .attr("height", 50)
                     .append("g")
                     .attr("transform", "translate(40,10)");

    monthAxis.append("line")
             .attr("x1", 0)
             .attr("x2", 490)
             .attr("y1", 5)
             .attr("y2", 5)
             .attr("stroke-width", "0.65px")
             .attr("stroke", "black");

   var monthTicks = d3.range(0,13,1);

   // console.log(monthTicks);

   var monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

   monthTicks.forEach(function(tick, index) {

          monthAxis.append("line")
                   .attr("x1", tick*40.83)
                   .attr("x2", tick*40.83)
                   .attr("y1", -3)
                   .attr("y2", 13)
                   .attr("stroke-width", "0.65px")
                   .attr("stroke", "black");

          monthAxis.append("text")
                   .text(monthLabels[index])
                   .attr("class", "yearLabel")
                   .attr("x", tick*40.83)
                   .attr("y", 30)
                   .style("text-anchor", "middle");

   });

   buttons.on('change', function(d) {

     if (this.value === "90") {

       svg.selectAll(".hour").remove();

       var tempBar = svg.selectAll(".hour")
                        .data(dataset90)
                        .enter()
                        .append("rect")
                        .attr("x", function(d) { return (d.Day-1)*gridSize/4; })
                        .attr("y", function(d) { return (d.Index+1)*30; })
                        .attr("class", "hour")
                        .attr("width", gridSize/4)
                        .attr("height", gridSize*2)
                        .style("fill", function(d) { return colorScale(d.MaxTemperature); });
     }

     if (this.value === "100") {

       svg.selectAll(".hour").remove();

       var tempBar = svg.selectAll(".hour")
                        .data(dataset100)
                        .enter()
                        .append("rect")
                        .attr("x", function(d) { return (d.Day-1)*gridSize/4; })
                        .attr("y", function(d) { return (d.Index+1)*30; })
                        .attr("class", "hour")
                        .attr("width", gridSize/4)
                        .attr("height", gridSize*2)
                        .style("fill", function(d) { return colorScale(d.MaxTemperature); });
     }
   });

};
