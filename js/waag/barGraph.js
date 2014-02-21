WAAG.BarGraph = function BarGraph(properties, _subDomain) {

  //console.log("bargraph contructor");
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 350 - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom;
      
  var xaxis, yaxis, svgDomain;
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
    x.domain(data.map(function(d) { return d.hour; }));
    
    y = d3.scale.linear()
       .range([height, 0]);
    y.domain([0, d3.max(data, function(d) { return d.value; })]);    
    

     xAxis = setXaxis(data, svgDomain, width, height, [0, 6, 12, 18, 23], "time (hours)", false);
     yAxis = setYaxis(data, svgDomain, width, height, 2, "units", false);
              
    initted=true;
    
    
    updateDataSet(properties, properties.tickerData.data[0].kci, 0);      
    

  };
  


	function updateGraph(data, description, yUnits){
	  
	  var max=d3.max(data, function(d) { return d.value; }); 
	  var maxRound=Math.round(max/10) * 10;
	  y.domain([0, max]); 
	  
	  yAxis = setYaxis(data, svgDomain, width, height, 2, yUnits, true);
    
    var time=250+(Math.random()*750);
	  
    svgDomain.select("#y_axis")
        .transition().duration(time)  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .call(yAxis);  

    svgDomain.select("#y_axis_label")
        .text(description);
        
    svgDomain.select("#y_axis_units")
        .text(maxRound+" "+yUnits);
   
    var vis=svgDomain.selectAll(".bar").data(data, function(d, i){return i});
    
    vis.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.hour); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return height - y(0); })
        .style("fill", function(d) { if(d.hour>hNow) return "none" })
        .style("stroke-width", function(d) { if(d.hour>hNow) return 0.25+"px" })
        //.style("shape-rendering", function(d) { if(d.hour>hNow) return "crispEdges" })
        .style("stroke", function(d) { if(d.hour>hNow) return "#666" })
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
            //updateDummySet(data);
			      
			    });

        
    vis.transition()
        .duration(time)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
        
    vis.exit().transition()
        .duration(time)
        .style("opacity", 0 )
        .remove();        

	};
	
  
  updateDataSet = function(_properties, kci, index){
    
    console.log("updating data set "+kci);
    activeIndex=index;
    updateGraph(_properties.tickerData.data[index].kciData, properties.tickerData.data[index].description, properties.tickerData.data[index].units);
  }
  
  this.updateDataSet=updateDataSet;
  init();
  return this;   

};