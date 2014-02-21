WAAG.MultiLineGraph = function MultiLineGraph(properties, _subDomain) {

  //console.log("linegraph contructor");
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 350 - margin.left - margin.right,
      height = 120 - margin.top - margin.bottom;
      
  var x, x1, y, xaxis, yaxis, line, svgDomain, legend;
  var color;
  var parties;
  var activeIndex=0;

  
  function init(){
    
    var data = properties.tickerData.data[0].kciData;
    
	  var subDomain = _subDomain;
      svgDomain = subDomain.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("position", "absolute")
        .style("left", 1+"em")
        .style("top", 1.25+"em")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       
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
        if(d.value==null){
          d.value=data[0].value;
          console.log(d);
        }
        d.active=false;
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
        
        var subjectsHistory = color.domain().map(function(name) {
              return {
                name: name,
                values: dataHistory.map(function(d) {
                  return {hour: d.hour, value: +d.value[name]};
                })
              };
          });
        
        var max;
        var max1 = d3.max(subjectsNow, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
        var max2 = d3.max(subjectsHistory, function(c) { return d3.max(c.values, function(v) { return v.value; }); });
        if(max1>max2){
          max=max1;
        }else{
          max=max2;
        }
        
        x = d3.scale.ordinal()
           .rangeRoundBands([0, width], 0.1);   
        x1 = d3.scale.ordinal(); 

        y = d3.scale.linear()
           .range([height, 0]);

       x.domain(data.map(function(d) { return d.hour; }));
       y.domain([0, max ]);
            
       xAxis = setXaxis(data, svgDomain, width, height, [0, 6, 12, 18, 23], "time (hours)", false);
             
       yAxis = d3.svg.axis()
             .scale(y)
             .orient("right")
             .ticks(4)
             //.tickValues([0, 25, 50, 75, 100]);
             //.ticks(10, "%");

        svgDomain.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + ",0)")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-38em")
            .style("text-anchor", "end")
            .text(properties.tickerData.data[0].description);
            
            // add legend   
      legend = svgDomain.append("g")
      	  .attr("class", "legend")
      	  .attr("x", w - 65)
      	  .attr("y", 25)
      	  .attr("height", 100)
      	  .attr("width", 100);

      legend.selectAll('g').data(subjectsNow, function(d, i) { return i; })
          .enter()
          .append('g')
          .each(function(d, i) {
            var g = d3.select(this);
            g.append("rect")
              .attr("x",i*6)
              .attr("y", 0)
              .attr("width", 5)
              .attr("height", 5)
              .style("fill", function(d) { return color(d.name); })
              .on("mouseover", function(d) {
                
                    d3.selectAll("#"+d.name+"-now").style("stroke-width", 3+"px" );
                    d3.selectAll("#"+d.name+"-history").style("stroke-width", 1.5+"px" );
                    d.active=true;
                    toolTip.transition()        
                        .duration(100)      
                        .style("opacity", .9);      
                    toolTip.html("name "+d.name)  
                        .style("left", (d3.event.pageX) + -12+"px")     
                        .style("top", (d3.event.pageY - 24) + "px");    
                    })                  
               .on("mouseout", function(d) {       
                 d3.selectAll("#"+d.name+"-now").style("stroke-width", 0.25+"px" );
                 d3.selectAll("#"+d.name+"-history").style("stroke-width", 0.25+"px" );
                  d.active=false;
                  toolTip.transition()        
                      .duration(250)      
                      .style("opacity", 0);   
              })
              .on("click", function(d){
                  //updateDummySet(data);

               });

            // g.append("text")
            //   .attr("x", 36)
            //   .attr("y", i * 11)
            //   .attr("height",30)
            //   .attr("width",100)
            //   .text(d.name);

          });      	  
      	       

      updateGraph(subjectsNow, subjectsHistory);

  };

	function updateGraph(dataNow, dataHistory){

	  var time=250+(Math.random()*750);

      var visLineNow = svgDomain.selectAll("path.lineNow").data(dataNow, function(d, i) { return i; });

      visLineNow.enter().append("path")
          .attr("class", "lineNow")
          .attr("id", function(d){ 
            return d.name+"-now" })
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


      visLineNow.transition()
          .duration(time)
          .attr("d", function(d) { return line(d.values); })

      visLineNow.exit().transition()
          .duration(time)
          .style("opacity", 0 )
          .remove();  
          
      
      var visLineHistory = svgDomain.selectAll("path.lineHistory").data(dataHistory, function(d, i) { return i; });

      visLineHistory.enter().append("path")
          .attr("class", "lineHistory")
          .attr("id", function(d){ 
            return d.name+"-history" })
          .attr("d", function(d) { 
            //console.log(d);
            return line(d.values); })
          .style("stroke", function(d) { return color(d.name); })
          .style("stroke-width", 0.5+"px")
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


      visLineHistory.transition()
          .duration(time)
          .attr("d", function(d) { return line(d.values); })

      visLineHistory.exit().transition()
          .duration(time)
          .style("opacity", 0 )
          .remove(); 


	};
	
  updateDataSet = function(_properties, kci, index){
    
    //console.log("updating data set "+kci);
    activeIndex=index;
    updateGraph(_properties.tickerData.data[index].kciData);
  }
    
  this.updateDataSet=updateDataSet;
  init();
  return this;   

};