WAAG.BarGraph = function BarGraph(properties, _subDomain) {

  //console.log("bargraph contructor");
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 350 - margin.left - margin.right,
      height = 90 - margin.top - margin.bottom;
      
  var x,y,xaxis,yaxis, svgDomain;
    
  var data=[];
  
  function init(){
    for(var i=0; i<properties.tickerData.length; i++){
  	  properties.tickerData[i].kciData=[];
  	};	

    if(properties.tickerData[0].kci=="dummy"){
      data=getDummyData();
      setGraph(); 
    }else{
      getGraphData(properties.tickerData[0].kci, 0, false);
    };
    
  };
  
  function getGraphData(kci, index, initted){
    console.log(properties.tickerData[index].kciData.length);
    
    if(properties.tickerData[index].kciData.length>0){
      //update data set
      return;
    }

    d3.json("http://loosecontrol.tv:4567/"+kci+"/admr.nl.amsterdam/history", function(results){
      properties.tickerData[index].kciData=[];
     for(var i=0; i<results.length; i++){
         var d=new Date();
         d.setTime(results[i].timestamp*1000);
         var h=d.getHours();
         var object={hour:h, timestamp:d, value:results[i][kci+":admr.nl.amsterdam"]}
         properties.tickerData[index].kciData.push(object);

     };

     properties.tickerData[index].kciData.sort(function(a, b) { return d3.ascending(a.hour, b.hour)});
     data=properties.tickerData[index].kciData
     if(initted){
       //update the grap here
     }else{
       setGraph();
     }
     
    });

  };


	function setGraph(){

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

      updateGraph(data);

  };

	function updateGraph(data){

    var vis=svgDomain.selectAll(".bar").data(data, function(d, i){return i});
    
    vis.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.hour); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return height - y(0); })
        .style("fill", function(d) { if(d.hour>hNow) return "none" })
        .style("shape-rendering", function(d) { if(d.hour>hNow) return "crispEdges" })
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
            updateDummySet(data);
			      
			    });

    var time=250+(Math.random()*750);    
    vis.transition()
        .duration(time)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
        
    vis.exit().transition()
        .duration(time)
        .style("opacity", 0 )
        .remove();        

	};

	function updateDummySet(data){
    
	  data=getDummyData();
	  updateGraph(data);
	  
	};
	
	
  
  updateDataSet = function(){
    console.log("updating data set");
  }
  
  this.updateDataSet=updateDataSet;
  init();
  return this;   

};