WAAG.AreaGraph = function AreaGraph(properties, _subDomain) {

  //console.log("linegraph contructor");
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 350 - margin.left - margin.right,
      height = 90 - margin.top - margin.bottom;
      
  var x,y,xaxis,yaxis, line, svgDomain;
  var activeIndex=0;
  
  function init(){
    
    var data = properties.tickerData[0].kciData;
    
	  var subDomain = _subDomain;
      svgDomain = subDomain.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("position", "absolute")
        .style("left", 1+"em")
        .style("top", 3+"em")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    
     x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);


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
              .tickValues([0, 50, 100]);
              //.ticks(10, "%"); 
              
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
            
                    

      updateGraph(data);

  };

	function updateGraph(data){

	  var time=250+(Math.random()*750);
	  
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