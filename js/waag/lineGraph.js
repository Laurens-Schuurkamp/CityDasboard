WAAG.LineGraph = function LineGraph(data, _subDomain) {

  //console.log("linegraph contructor");
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 350 - margin.left - margin.right,
      height = 90 - margin.top - margin.bottom;
      
  var x,y,xaxis,yaxis, line;

	function init(){

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
        
        // x = d3.time.scale()
        //      .rangeRoundBands([0, width], 0.1);

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
      .x(function(d) { return x(d.hour); })
      .y(function(d) { return y(d.value); });         
  
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
            .text("pressure (%)"); 
            
                    

      updateGraph(data, svgDomain);

  };

	function updateGraph(data, _svgDomain){

	  var svgDomain=_svgDomain;
	  var time=250+(Math.random()*750);
	  
    var visLine = svgDomain.selectAll("path.line").data([data], function(d, i) { return i; });
    
    visLine.enter().append("path")
        .attr("class", "line")
        .attr("d" , line);

    
    visLine.transition()
        .duration(time)
        .attr("d" , line);
        
    visLine.exit().transition()
        .duration(time)
        .style("opacity", 0 )
        .remove();
    
    var visDot=svgDomain.selectAll(".dot").data(data, function(d, i){return i});     

       visDot.enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { if(d.hour<hNow) return 1 })
        .attr("cx", function(d) { return x(d.hour); })
        .attr("cy", function(d) { return y(d.value); })
            .on("mouseover", function(d) {
                  toolTip.transition()        
                      .duration(100)      
                      .style("opacity", .9);      
                  toolTip.html("time "+d.hour+ "<br/>value: "  + parseInt(d.value))  
                      .style("left", (d3.event.pageX) + 10+"px")     
                      .style("top", (d3.event.pageY - 28 - 10) + "px");    
                  })                  
             .on("mouseout", function(d) {       
                toolTip.transition()        
                    .duration(250)      
                    .style("opacity", 0);   
            })
            .on("click", function(d){
                updateDummySet(data, _svgDomain);
                   
             });      

        
    visDot.transition()
        .duration(time)
        .attr("cx", function(d) { return x(d.hour); })
        .attr("cy", function(d) { return y(d.value); });
        
    visDot.exit().transition()
        .duration(time)
        .style("opacity", 0 )
        .remove();        

	};
	
	function updateDummySet(data, _svgDomain){
	  console.log("update data set");
	  data=getDummyData();
	  updateGraph(data, _svgDomain);
	  
	};

  init();
  return this;   

};