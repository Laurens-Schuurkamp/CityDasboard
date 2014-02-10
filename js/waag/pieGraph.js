WAAG.PieGraph = function PieGraph(properties, _subDomain, donutType) {

  var width=150;
  var height=150;    
  var svgDomain;
  var activeIndex=0;

  var quantizeBrewer;
  var min, max;
  var radius = Math.min(width, height) / 2;
  var arc, pie;
  var donut;
  
  function init(){
    
    var data = properties.tickerData.data[0].kciData;
    
	  var subDomain = _subDomain;

    svgDomain = subDomain.append("svg")
      .attr("width", width+"px")
      .attr("height",height+"px")
      .style("position", "absolute")
      .style("left", 14+"em")
      .style("top", -1.5+"em")
      //.attr("transform", "translate(" + 0 + "," + 240 + ")")
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
         
    arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(function(){
        if(donutType){
          return radius - 40
        }else{
          return 0
        }
      });

    pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.value; });  
      
    max =  d3.max(data, function(d) { return d.value; });
    min =  d3.min(data, function(d) { return d.value; }); 
    quantizeBrewer = d3.scale.quantile().domain([min, max]).range(d3.range(rangeCB));                

    updateGraph(data);

  };

  function updateGraph(data){
    var time=250+(Math.random()*750);
    data.sort(function(a, b) { return d3.ascending(a.value, b.value)});
    
    donut = svgDomain.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .style("opacity", 0.75)
        .style("stroke", "#666")
        .style("stroke-width", 0.25+"px")        
        .on("mouseover", function(d) {
              toolTip.transition()        
                  .duration(100)      
                  .style("opacity", .9);      
              toolTip.html("Stadsdeel :......<br/>value: "  + parseInt(d.value))  
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

      donut.transition()
          .duration(500)
          .style("fill", function(d){ return colorbrewer[colorScheme]['9'][quantizeBrewer(d.value)]})
          .attr("d", arc)
          .each(function(d) { this._current = d; }); // store the initial angles



	};
	
	function updatePie(data){
	    //data.sort(function(a, b) { return d3.ascending(a.value, b.value)});
	  
      var time=250+(Math.random()*750);
      donut.data(pie(data));
      donut.transition()
        //.style("fill", function(d){ return colorbrewer[colorScheme]['9'][quantizeBrewer(d.value)]})
        .duration(time).attrTween("d", arcTween); // redraw the arcs

  }
	
	// Store the displayed angles in _current.
  // Then, interpolate from _current to the new angles.
  // During the transition, _current is updated in-place by d3.interpolate.
  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  }
  
	
  updateDataSet = function(_properties, kci, index){
    
    console.log("updating data set "+kci);
    activeIndex=index;
    //updateGraph(_properties.tickerData[index].kciData);
    updatePie(_properties.tickerData.data[index].kciData);
  }
    
  this.updateDataSet=updateDataSet;
  init();
  return this;   

};