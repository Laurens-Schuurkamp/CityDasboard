WAAG.CirclePack = function CirclePack(properties, _subDomain) {

  //console.log("linegraph contructor");
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 350 - margin.left - margin.right,
      height = 90 - margin.top - margin.bottom;
      
  var svgDomain;
  var activeIndex=0;
  var pack;
  var circlePackSize=140;
  var quantizeBrewer;
  var min, max;
  
  function init(){
    
    var data = properties.tickerData[0].kciData;
    
	  var subDomain = _subDomain;

    svgDomain = subDomain.append("svg")
      .attr("width", 140+"px")
      .attr("height", 140+"px")
      .style("position", "absolute")
      .style("left", 14+"em")
      .style("top", -1+"em")
      //.attr("transform", "translate(" + 0 + "," + 240 + ")")
      .append("g")
         
    pack = d3.layout.pack()
      .size([circlePackSize, circlePackSize])
      .value(function(d) { return d.value })
      
    max =  d3.max(data, function(d) { return d.value; });
    min =  d3.min(data, function(d) { return d.value; }); 
    quantizeBrewer = d3.scale.quantile().domain([min, max]).range(d3.range(rangeCB));                

    updateGraph(data);

  };
  
  function updateGraph(data){
    var time=250+(Math.random()*750);
        
    var dataPack={children:data};
   
    var node = svgDomain.selectAll(".node").data(pack.nodes(dataPack), function(d , i ){return i});

    node.enter().append("g")
            .classed("node", true)
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .append("circle")
            .attr("fill", function(d){ return colorbrewer[colorScheme]['9'][quantizeBrewer(d.value)]})
            .attr("r", 0)
            .style("fill-opacity", 0.5)
            .style("stroke", "#666")
            .style("stroke-width", 0.5+"px")
            
            .transition()
            .duration(1000)
            .attr("r", function(d) { return d.r; })
        
        node.append("title").text(function(d) { return d.value})    

        node.transition()
            .duration(1000)
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        
        
        node.select("circle")
          .attr("class", function(d) { return "q" + quantizeBrewer(d.value) + "-9"; }) //colorBrewer
            .transition()
            .duration(1000)
            .attr("r", function(d) { return d.r; })
             
        node.exit().transition()
          .attr("r", 0)
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