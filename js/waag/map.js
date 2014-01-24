WAAG.Map = function Map(domains) {

  console.log("map constructor");
  var container;
  var mapScale=125000;
	var svg, projection, path, map;
	var centered, zoom;
	var defs, filter, feMerge;
	var rangeCB=9; //range colorbrewer


	function init(){
      
      var stage = d3.select("#stage");
      container = stage.append("div")
        .attr("class", "map_container")
        .attr("id", "map_container")
        .style("top", menuHeight+(domains.length*widgetHeight)+"em");
        
  		projection = d3.geo.mercator()
  			     .translate([ (768/2) , (576/2) ])
  			     .scale([mapScale]);

  		projection.center([4.9000,52.3725])

  		path = d3.geo.path()
  		      .projection(projection)
  		      .pointRadius(10);

  		zoom = d3.behavior.zoom()
          .translate([0, 0])
          .scale(1)
          .scaleExtent([0.05, 18])
          .on("zoom", zoomed);

  		//create svg element            
  		svg = d3.select("#map_container").append("svg")
  		    .attr("width", 768+"px")
  		    .attr("height", 576+"px")
  		    .style("fill", "white")
  		    .call(zoom);   

  		map = svg.append("g")
  		   .attr("id", "main_map")
  		   .attr("class", "Oranges");
 

  	// set dropshadow filters	   
     defs = map.append("defs");

     filter = defs.append("filter")
           .attr("id", "dropshadow")

       filter.append("feGaussianBlur")
           .attr("in", "SourceAlpha")
           .attr("stdDeviation", 1)
           .attr("result", "blur");
       filter.append("feOffset")
           .attr("in", "blur")
           .attr("dx", 0.5)
           .attr("dy", 0.5)
           .attr("result", "offsetBlur");

       feMerge = filter.append("feMerge");

       feMerge.append("feMergeNode")
           .attr("in", "offsetBlur")
       feMerge.append("feMergeNode")
           .attr("in", "SourceGraphic");
           
      getGeoData();     		   

  };
  
  function getGeoData(){
  	  
  	d3.json(apiUrl+"admr.nl.amsterdam/nodes?admr::admn_level=5"+apiGeom, function(results){
  		var data=results.results;
      
      // rewrite results to geojson
      data.forEach(function(d){
        // redefine data structure for d3.geom
        if(d.geom){

        	d.type="Feature";
    			d.geometry=d.geom;
    			delete d.geom;
    			d.centroid = path.centroid(d);
    			d.bounds= path.bounds(d);

        }

    	  });
    	  //console.log(data);
  			updateRegionsMap(data);
  		});

  };
  
  
   updateRegionsMap = function (data){
         
     var vis=d3.select("#main_map");
     
     console.log("adding main map");
     vis.selectAll("path")
   			.data(data)
   			.enter().append("path")
   			  .attr("id", function(d, i){return d.cdk_id;})
   			  .attr("d", path)
   			  .style("fill", "white")
   			  .style("stroke", "#666")
   			  .on("mouseover", function(d){
   			    d3.select(this).style("stroke-width", 1+"px" );
  			    toolTip.transition()        
                .duration(100)      
                .style("opacity", .9);      
            toolTip.html(d.name)  
                .style("left", (d3.event.pageX) + 10+"px")     
                .style("top", (d3.event.pageY - 28 - 10) + "px");    
            })
      			.on("mouseout", function(d){
      			  d3.select(this).style("stroke-width", 0.25+"px" );
              toolTip.transition()        
                  .duration(250)      
                  .style("opacity", 0);			  
      			  
      			})
    			  .on("click", function(d){
    			        			    
      			})

 
  };
  
  function zoomed() {
	    //console.log(d3.event);
      map.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  };


  init();
  return this;   

};