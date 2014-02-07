WAAG.MultiLineGraph = function MultiLineGraph(properties, _subDomain) {

  //console.log("linegraph contructor");
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 350 - margin.left - margin.right,
      height = 142 - margin.top - margin.bottom;
      
  var x, x1, y, xaxis, yaxis, line, svgDomain;
  var color;
  var parties;
  var activeIndex=0;

  
  function init(){
    
    var data = properties.tickerData[0].kciData;
    
	  var subDomain = _subDomain;
      svgDomain = subDomain.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("position", "absolute")
        .style("left", 1+"em")
        .style("top", 0+"em")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    
     x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);   
     x1 = d3.scale.ordinal(); 

     y = d3.scale.linear()
        .range([height, 0]);

     xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickValues([0, 6, 12, 18, 23])
            //.tickFormat(d3.time.format("%H"));

      yAxis = d3.svg.axis()
              .scale(y)
              .orient("right")
              .tickValues([0, 25, 50, 75, 100]);
              //.ticks(10, "%"); 
              
     //line = d3.svg.line()
     
     line = d3.svg.line()
         .interpolate("basis")
         .x(function(d) { return x(d.hour); })
         .y(function(d) { return y(d.value); })
          
      
      // interpolation  
      // linear - piecewise linear segments, as in a polyline.
      // linear-closed - close the linear segments to form a polygon.
      // step-before - alternate between vertical and horizontal segments, as in a step function.
      // step-after - alternate between horizontal and vertical segments, as in a step function.
      // basis - a B-spline, with control point duplication on the ends.
      // basis-open - an open B-spline; may not intersect the start or end.
      // basis-closed - a closed B-spline, as in a loop.
      // bundle - equivalent to basis, except the tension parameter is used to straighten the spline.
      // cardinal - a Cardinal spline, with control point duplication on the ends.
      // cardinal-open - an open Cardinal spline; may not intersect the start or end, but will intersect other control points.
      // cardinal-closed - a closed Cardinal spline, as in a loop.
      // monotone - cubic interpolation that preserves monotonicity in y. 
      // 
      
      color = d3.scale.category10();
      //color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
      var dataNow=[];
      var dataHistory=[];
      
      data.forEach(function(d) {
        //dataNow.push(d);
        if(d.hour<=hNow){
          //console.log(d)
          dataNow.push(d);
        }else{
          dataHistory.push(d);
        }
      });
      
      
      color.domain(d3.keys(dataNow[0].value).filter(function(key) { return key }));
      
      var subjectsNow = color.domain().map(function(name) {
            return {
              name: name,
              values: dataNow.map(function(d) {
                return {hour: d.hour, value: +d.value[name]};
              })
            };
        });
        


        x.domain(data.map(function(d) { return d.hour; }));

        // y.domain([
        //   d3.min(parties, function(c) { return d3.min(c.values, function(v) { return 0 }); }),
        //   d3.max(parties, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
        // ])
        
        y.domain([0, d3.max(subjectsNow, function(c) { return d3.max(c.values, function(v) { return v.value; }); })  ]);
        


        svgDomain.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svgDomain.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + ",0)")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-38em")
            .style("text-anchor", "end")
            .text(properties.tickerData[0].description); 

      updateGraph(subjectsNow);

  };

	function updateGraph(dataNow, dataHistory){

	  var time=250+(Math.random()*750);

      var visLine = svgDomain.selectAll("path.line").data(dataNow, function(d, i) { return i; });

      visLine.enter().append("path")
          .attr("class", "line")
          .attr("d", function(d) { 
            //console.log(d);
            return line(d.values); })
          .style("stroke", function(d) { return color(d.name); })
          .style("stroke-width", 1+"px")
          .on("mouseover", function(d) {
                toolTip.transition()        
                    .duration(100)      
                    .style("opacity", .9);      
                toolTip.html("name "+d.name+ "<br/>value: "  + parseInt(d.value))  
                    .style("left", (d3.event.pageX) + 10+"px")     
                    .style("top", (d3.event.pageY - 28 - 10) + "px");    
                })                  
           .on("mouseout", function(d) {       
              toolTip.transition()        
                  .duration(250)      
                  .style("opacity", 0);   
          })
          .on("click", function(d){
              //updateDummySet(data);
                 
           });


      visLine.transition()
          .duration(time)
          .attr("d", function(d) { return line(d.values); })

      visLine.exit().transition()
          .duration(time)
          .style("opacity", 0 )
          .remove();  
          
            

    
    // var visDot=svgDomain.selectAll(".dot").data(data, function(d, i){return i});     
    // 
    //    visDot.enter().append("circle")
    //     .attr("class", "dot")
    //     .attr("r", function(d) {
    //       if(d.hour==hNow ){
    //         return 2;
    //       }else if(d.hour<hNow && d.value!=null){
    //         return 0.5;
    //       }else{
    //         return 0;
    //       } })
    //     .attr("cx", function(d) { return x(d.hour); })
    //     .attr("cy", function(d) { return y(d.value); })
    //         .on("mouseover", function(d) {
    //               toolTip.transition()        
    //                   .duration(100)      
    //                   .style("opacity", .9);      
    //               toolTip.html("time "+d.hour+ "<br/>value: "  + parseInt(d.value))  
    //                   .style("left", (d3.event.pageX) + 10+"px")     
    //                   .style("top", (d3.event.pageY - 28 - 10) + "px");    
    //               })                  
    //          .on("mouseout", function(d) {       
    //             toolTip.transition()        
    //                 .duration(250)      
    //                 .style("opacity", 0);   
    //         })
    //         .on("click", function(d){
    //             //updateDummySet(data);
    //                
    //          });      
    // 
    //     
    // visDot.transition()
    //     .duration(time)
    //     .attr("cx", function(d) { return x(d.hour); })
    //     .attr("cy", function(d) { return y(d.value); });
    //     
    // visDot.exit().transition()
    //     .duration(time)
    //     .style("opacity", 0 )
    //     .remove();        

	};
	
  updateDataSet = function(_properties, kci, index){
    
    console.log("updating data set "+kci);
    activeIndex=index;
    updateGraph(_properties.tickerData[index].kciData);
  }
    
  this.updateDataSet=updateDataSet;
  init();
  return this;   

};