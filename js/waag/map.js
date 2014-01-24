WAAG.Map = function Map(domains) {

  console.log("map constructor");
  var container;
  var mapScale=125000;
	var svg, projection, path, map, main_map;
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
  		   .attr("id", "map");
  		   
  		   
  		main_map = map.append("g")
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
           
      getGeoData("admr.nl.amsterdam/nodes?admr::admn_level=5", "main_map");     		   

  };
  
  function getGeoData(url, domain){
  	  
  	d3.json(apiUrl+url+apiGeom, function(results){
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

        if(domain=="main_map"){
          updateRegionsMap(data);
        }else if(domain=="transport"){
          updateTrafficMap(data, domain);
        }
  			
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
   			  .on("mouseover", function(d){
   			    d3.select(this).style("stroke-width", 1+"px" );
   			    d3.select(this).style("fill", "#F9F1EA" );
  			    toolTip.transition()        
                .duration(100)      
                .style("opacity", .9);      
            toolTip.html(d.name)  
                .style("left", (d3.event.pageX) + 10+"px")     
                .style("top", (d3.event.pageY - 28 - 10) + "px");    
            })
      			.on("mouseout", function(d){
      			  d3.select(this).style("stroke-width", 0.25+"px" );
      			  d3.select(this).style("fill", "white" );
              toolTip.transition()        
                  .duration(250)      
                  .style("opacity", 0);			  
      			  
      			})
    			  .on("click", function(d){
    			        			    
      			})

  };
  
  updateTrafficMap = function(data, domain){
  	//console.log("setting traffic map "+data);
  	
  	data.forEach(function(d){
	     var g= d.layers["divv.traffic"];
	    
	     var tt=parseInt(g.data.traveltime);
	     var tt_ff=parseInt(g.data.traveltime_freeflow);
       d.visData=tt/tt_ff;
       
       //console.log("trafel perc ="+d.visData);
       if(d.visData<0 || isNaN(d.visData) || d.visData=="Infinity"){
            d.visData=0.1;
        }
        
        d.visLabel=g.data.velocity;
    });
    
    var max =  d3.max(data, function(d) {return d.visData; });
	  
	  var color = d3.scale.linear()
            .domain([1, max])
            .range(['green', 'red']);
    
  	
  	var visTraffic=d3.select("#map_"+domain);
  	
    var vis=visTraffic.selectAll("path").data(data, function(d, i){return d.cdk_id});

		vis.enter().append("path")
  			  .attr("id", function(d, i){return d.cdk_id})
  			  .attr("d", path)
  			  .style("fill", "none")
  			  .style("stroke-width", function(d){return 0})
  			  .style("stroke", function(d) { return color(d.visData)})
  			  .on("mouseover", function(d){
  			    toolTip.transition()        
                .duration(100)      
                .style("opacity", .9);      
            toolTip.html(d.name+"<br> value: "+d.visLabel+" km/u")  
                .style("left", (d3.event.pageX) + 5+"px")     
                .style("top", (d3.event.pageY - 28 - 5) + "px");    
            })
      		.on("mouseout", function(d){
            toolTip.transition()        
                .duration(250)      
                .style("opacity", 0);			  
    			  
    			})
  			  .on("click", function(d){
  			        			    
    			})
  			
  	    vis.transition()
            .duration(500)
            .style("stroke-width", function(d){return (d.visData/2)})

         vis.exit().transition()
            .duration(250)
            .style("stroke-width", function(d){return 0})
            .remove();		  

	}
  
  addDomainLayer = function(domain){
      map.append("g")
        .attr("id", "map_"+domain)
        .attr("class", "Oranges");
        
    if(domain=="transport"){
      getGeoData("nodes?layer=divv.traffic", domain);
    };
  
    console.log("adding domain layer "+domain);
  };
  
  function zoomed() {
	    //console.log(d3.event);
      map.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  };


  init();
  this.addDomainLayer=addDomainLayer;
  return this;   

};