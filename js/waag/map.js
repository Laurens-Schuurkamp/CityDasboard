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
      
        container.append("div")
            .attr("class", "mapMenu")
            .style("position", "relative")
            .style("background-color", "#e3ddd7")
            .style("top", 0+"em")
            .style("height", 2+"em")
            .style("margin-bottom", 0.5+"em");
        
      // container.append("div")
      //     .attr("class", "hLine")
      //     .style("position", "relative")
      //     
      //     .style("top", 0+"em")
      //     .style("margin-top", 0.5+"em")
      //     .style("margin-bottom", 0.5+"em");
 
        
  		projection = d3.geo.mercator()
  			     .translate([ (mapWidth*16)/2 , (mapHeight*16)/2 ])
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
           
      //getGeoData("http://api.citysdk.waag.org/admr.nl.amsterdam/nodes?admr::admn_level=5&geom&per_page=1000", "main_map");     		   

  };
  
  function getGeoData(url, layerId){
  	  
  	//d3.json(apiUrlSDK+url+apiGeom, function(results){
    d3.json(url, function(results){
  		var data=results.results;
      var geomType="type";
      // rewrite results to geojson
      data.forEach(function(d){
        // redefine data structure for d3.geom
        
        
        if(d.geom){

        	d.type="Feature";
    			d.geometry=d.geom;
    			delete d.geom;
    			d.centroid = path.centroid(d);
    			d.bounds= path.bounds(d);
          geomType=d.geometry.type;
        }

    	  });

        if(geomType=="MultiPolygon" || geomType=="Polygon"){
          updatePolygonMap(data, layerId);
        }else if(geomType=="MultiLineString" || geomType=="LineString"){
          updateLinestringMap(data, layerId);
        }else if(geomType=="MultiPoint" || geomType=="Point"){
          updatePointMap(data, layerId);
        }
  			
  		});

  };
  
  
   updatePolygonMap = function (data, layerId){
     
     var visMap=d3.select("#"+layerId);
     var vis=visMap.selectAll("path").data(data, function(d, i){return d.cdk_id});

     vis.enter().append("path")
   			  .attr("id", function(d, i){return d.cdk_id;})
   			  .attr("d", path)
   			  .style("fill", "white")
   			  .on("mouseover", function(d){
   			    d3.select(this).style("stroke-width", 0.1+"px" );
   			    d3.select(this).style("fill", "#f3ece5" );
  			    toolTip.transition()        
                .duration(100)      
                .style("opacity", .9);      
            toolTip.html(d.name)  
                .style("left", (d3.event.pageX) + 10+"px")     
                .style("top", (d3.event.pageY - 28 - 10) + "px");    
            })
      			.on("mouseout", function(d){
      			  d3.select(this).style("stroke-width", 0.05+"px" );
      			  d3.select(this).style("fill", "white" );
              toolTip.transition()        
                  .duration(250)      
                  .style("opacity", 0);			  
      			  
      			})
    			  .on("click", function(d){
    			        			    
      			})

  };
  
  updateLinestringMap = function(data, layerId){
    
  	console.log("setting traffic map "+layerId);
  	
  	data.forEach(function(d){
	     var g= d.layers["divv.traffic"];
	     var tt=parseInt(g.data.traveltime);
	     var tt_ff=parseInt(g.data.traveltime_freeflow);
       d.value=tt/tt_ff;
       
       //console.log("trafel perc ="+d.value);
       if(d.value<0 || isNaN(d.value) || d.value=="Infinity"){
            d.value=0.1;
        }
        
        d.visLabel=g.data.velocity;
    });
    
    var max =  d3.max(data, function(d) {return d.value; });
	  
	  var color = d3.scale.linear()
            .domain([1, max])
            .range(['#333', '#F16912']);
    
  	
  	var visMap=d3.select("#"+layerId);
    var vis=visMap.selectAll("path").data(data, function(d, i){return d.cdk_id});

		vis.enter().append("path")
  			  .attr("id", function(d, i){return d.cdk_id})
  			  .attr("d", path)
  			  .style("fill", "none")
  			  .style("stroke-width", function(d){return 0})
  			  .style("stroke", function(d) { return color(d.value)})
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
            .style("stroke-width", function(d){return (d.value/2)})

         vis.exit().transition()
            .duration(250)
            .style("stroke-width", function(d){return 0})
            .remove();		  

	}
	
	updatePointMap = function(data, layerId){
    
    console.log("setting traffic map "+layerId);
	  
	  data.forEach(function(d){
	    d.value=Math.random()*3;
	     
    });

    var max =  d3.max(data, function(d) { return d.value; });
    
    var colorScale = d3.scale.linear().domain([0,max]).range(['white', 'blue']);
    var quantizeBrewer = d3.scale.quantile().domain([0, max]).range(d3.range(9));
    var scalingGeo = d3.scale.linear().domain([0, max]).range(d3.range(100));

  	var visTraffic=d3.select("#"+layerId);
    var vis=visTraffic.selectAll("path").data(data, function(d, i){return d.cdk_id});

  	
		vis.enter().append("path")
  			  .attr("id", function(d, i){return d.cdk_id})
  			  .attr("d", function(d){
                        path.pointRadius(d.value);
                        return path(d);
                      })
  			  .style("fill-opacity", 1)
  			  .style("stroke-width", 0.1+"px")
  			  .style("opacity", 0)
  			  .attr("class", function(d) { return "q" + quantizeBrewer([d.value]) + "-9"; }) //colorBrewer
          .on("mouseover", function(d){
  			    toolTip.transition()        
                .duration(100)      
                .style("opacity", .9);      
            toolTip.html(d.name+"<br> delay: "+Math.round(d.value * 100) / 100+" min")  
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
  			
  			vis.attr("class", function(d) { return "q" + quantizeBrewer([d.value]) + "-9"; }) //colorBrewer
  	    
  	    vis.transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("d", function(d){
              path.pointRadius(d.value);
              return path(d);
            })

         vis.exit().transition()
            .duration(250)
            .attr("d", 0)
            .remove();		
  			

	}
  
  addDomainLayer = function(_properties){
    
    var layers=[_properties.subDomainA, _properties.subDomainB];
    
    for (var i=0; i<layers.length; i++){
      if(layers[i]!=false && layers[i].mapUrl!="dummy"){
        
        
        console.log("adding map layer :"+layers[i].id);
          var layerId="map_"+layers[i].id;
          
          map.append("g")
            .attr("id", layerId)
            .attr("class", "Oranges");
            
          getGeoData(layers[i].mapUrl, layerId);  
      }
      
    }

  };
  
  function zoomed() {
	    //console.log(d3.event);
      map.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  };


  init();
  this.addDomainLayer=addDomainLayer;
  return this;   

};