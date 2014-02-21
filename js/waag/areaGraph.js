WAAG.AreaGraph = function AreaGraph(properties, _subDomain) {

  //console.log("linegraph contructor");
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 350 - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom;
      
  var x,y,xaxis,yaxis, line, svgDomain;
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
        
    
     x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);


     y = d3.scale.linear()
        .range([height, 0]);

    xAxis = setXaxis(data, svgDomain, width, height, [0, 6, 12, 18, 23], "time (hours)", false);
    yAxis = setYaxis(data, svgDomain, width, height, 2, "units", false); 
              
     line = d3.svg.line()
     .interpolate("none")
      .x(function(d) { return x(d.hour); })
      .y(function(d) { return y(d.value); }); 
      
      
    area = d3.svg.area()
    .interpolate("none")
      .x(function(d) { return x(d.hour); })
      .y0(height)
      .y1(function(d) { return y(d.value); });              
  
      x.domain(data.map(function(d) { return d.hour; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);


     updateDataSet(properties, properties.tickerData.data[0].kci, 0);

  };


	function updateGraph(data, description, yUnits){

	  var max=d3.max(data, function(d) { return d.value; }); 
	  var maxRound=Math.round(max/10) * 10;
	  y.domain([0, max]); 
	  
	  yAxis = setYaxis(data, svgDomain, width, height, 2, "units", true);
    
    var time=250+(Math.random()*750);
	  
    svgDomain.select("#y_axis")
        .transition().duration(time)  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .call(yAxis);  

    svgDomain.select("#y_axis_label")
        .text(description);
        
    svgDomain.select("#y_axis_units")
        .text(maxRound+" "+yUnits);
	  
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
	    if(d.hour<hNow){
	      dataArea.push(d);
	    }

    });
   
    var visArea = svgDomain.selectAll(".area").data([dataArea], function(d, i) { return i; });    
        
    //area
    visArea.enter().append("path")        
        .attr("class", "area")
        .attr("d", area); 
    
    visArea.transition()
        .duration(time)
        .attr("d", area);

    visArea.exit().transition()
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
    // 
    // 
    //               toolTip.transition()        
    //                   .duration(100)      
    //                   .style("opacity", .9);      
    //               toolTip.html("time :"+d.hour+ "<br/>value: "  + parseInt(d.value))  
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
    
    //console.log("updating data set "+kci);
    activeIndex=index;
    updateGraph(_properties.tickerData.data[index].kciData, properties.tickerData.data[index].description, properties.tickerData.data[index].units);
  }
    
  this.updateDataSet=updateDataSet;
  init();
  return this;   

};