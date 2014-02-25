WAAG.AreaGraph = function AreaGraph(properties, _subDomain) {

  //console.log("linegraph contructor");
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 350 - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom;
      
  var x,y,xaxis,yaxis, line, svgDomain, focus;
  var activeIndex=0;
  
  function init(){
    
    var data = properties.tickerData.data[0].kciData;
    
    var subDomain = _subDomain;
      svgDomain = subDomain.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("position", "absolute")
        .style("left", 1+"em")
        .style("top", 2.5+"em")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x = d3.time.scale()
        .range([0, width])
        

    y = d3.scale.linear()
        .range([height, 0]);

    x.domain(d3.extent(data, function(d) { return d.timestamp; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    
    xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(d3.time.hours, 6)
            .tickFormat(d3.time.format('%H'))
    
    svgDomain.append("g")
          .attr("class", "x axis")
          .attr("id", "x_axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
            .attr("id", "x_axis_label")
            .attr("x", 16)
            .attr("y", 6)
            .attr("dy", "1em")
            .style("text-align", "center")
            .text("time (hours)")

    yAxis = setYaxis(data, svgDomain, width, height, 2, "units", false); 
              
    line = d3.svg.line()
     .interpolate("none")
      .x(function(d) { return x(d.timestamp); })
      .y(function(d) { return y(d.value); }); 
      
      
    area = d3.svg.area()
    .interpolate("none")
      .x(function(d) { return x(d.timestamp); })
      .y0(height)
      .y1(function(d) { return y(d.value); });              
  

    
    focus = svgDomain.append("g")
        .attr("class", "focus")
        .style("display", "none");  

     updateDataSet(properties, properties.tickerData.data[0].kci, 0);

  };

	function updateGraph(data, description, yUnits){
    var min=d3.min(data, function(d) { return d.value; });
    if(min<10) min=0;
    
	  var max=d3.max(data, function(d) { return d.value; }); 
	  var maxRound=Math.round(max/10) * 10;
	  y.domain([min, max]); 
	  
	  yAxis = setYaxis(data, svgDomain, width, height, 2, "units", true);
    
    var time=250+(Math.random()*750);
	  
    svgDomain.select("#y_axis")
        .transition().duration(time)  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .call(yAxis);  

    svgDomain.select("#y_axis_label")
        .html(description);
        
    svgDomain.select("#y_axis_units")
        .html(maxRound+" "+yUnits);
        
    svgDomain.select("#y_axis_units_min")
        .html(parseInt(min));

	  var dataArea=[];
    data.forEach(function(d){
	    if(d.hour<hNow){
	      dataArea.push(d);
	    }

    });
	  
    var visLine = svgDomain.selectAll("path.line").data([data], function(d, i) { return i; });
    
    //line
    visLine.enter().append("path")
        .attr("class", "line")
        .attr("d" , line);
    
    visLine.transition()
        .duration(time)
        .attr("d", line);
        
    visLine.exit().transition()
        .duration(time)
        .style("opacity", 0 )
        .remove();
        
    var dataArea=[];
    data.forEach(function(d){
	    if(d.hour<=hNow){
	      dataArea.push(d);
	    }

    });
   
    var visArea = svgDomain.selectAll(".area").data([dataArea], function(d, i) { return i; });    
        
    //area
    visArea.enter().append("path")        
        .attr("class", "area")
        .attr("d", area)
    
    visArea.transition()
        .duration(time)
        .attr("d", area);

    visArea.exit().transition()
        .duration(time)
        .style("opacity", 0 )
        .remove();       
    
    data.forEach(function(d){
        d.units=yUnits;
        d.description=description;
      
    })
    
    var visDot=svgDomain.selectAll(".dot").data(data, function(d, i){return i});     
    
       visDot.enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {
          if(d.hour==hNow ){
            return 2;
          }else if(d.hour<hNow && d.value!=null){
            return 0.5;
          }else{
            return 0;
          } })
        .attr("cx", function(d) { return x(d.timestamp); })
        .attr("cy", function(d) { return y(d.value); })
            .on("mouseover", function(d) {
                  toolTip.transition()        
                      .duration(100)      
                      .style("opacity", .9);      
                  toolTip.html("Time : "+d.hour+ ".00<br/>Value "+d.description+" : "  + parseInt(d.value)+" "+d.units)  
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
    
    visDot.transition()
        .duration(time)
        .attr("cx", function(d) { return x(d.timestamp); })
        .attr("cy", function(d) { return y(d.value); });
    
    visDot.exit().transition()
        .duration(time)
        .style("opacity", 0 )
        .remove();
      
    // svgDomain.append("rect")
    //     .attr("class", "overlay")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .on("mousemove", mouseMove);           
	};
	
	function mouseMove() {
	  //console.log(d3.mouse(this)[0]);
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      //focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
      //focus.select("text").text(formatCurrency(d.close));
  }
	
  updateDataSet = function(_properties, kci, index){
    
    //console.log("updating data set "+kci);
    activeIndex=index;
    updateGraph(_properties.tickerData.data[index].kciData, properties.tickerData.data[index].description, properties.tickerData.data[index].units);
  }
    
  this.updateDataSet=updateDataSet;
  init();
  return this;   

};