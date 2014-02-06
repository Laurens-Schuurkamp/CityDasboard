WAAG.Map = function Map(domains) {

  console.log("map constructor");
  var container;
  var mapScale=125000;
	var svg, projection, path, map, main_map;
	var centered, zoom;
	var defs, filter, feMerge;
	var rangeCB=9; //range colorbrewer

  var mapMenu;
  var llActive=false;
  var dropDownLayers;
  
  

	function init(){
      
    var stage = d3.select("#stage");
    container = stage.append("div")
      .attr("class", "map_container")
      .attr("id", "map_container")
      .style("top", menuHeight+(domains.length*widgetHeight)+"px");
      
  		projection = d3.geo.mercator()
  			     .translate([ (mapWidth)/2 , (mapHeight)/2 ])
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
  		    .attr("width", mapWidth+"px")
  		    .attr("height", mapHeight+"px")
  		    .style("z-index", 0)
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

       filter.append("GaussianBlur")
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
           
   

       createMapMenu();    
     		   

  };
  
  function createMapMenu(){
    mapMenu = container.append("div")
          .attr("id", "mapMenu")
          .attr("class", "mapMenu")
          .style("position", "absolute")
          .style("background-color", "#e3ddd7")
          .style("top", 0+"px")
          .style("height", 48+"px")
          .style("width", 100+"%")
          .style("opacity", 0.95)
          .style("z-index", 5)

    mapMenu.append("div")
      .attr("class", "vLine")
      .style("position", "absolute")
      .style("margin-top", 0.5+"em")
      .style("margin-bottom", 0.5+"em")
      .style("left", mapWidth/2+"px")
      .style("height", 2+"em");


     var layerList = mapMenu.append('div')
        .attr("class", "layerList")
        .attr("id", "layerList")
        .style("position", "absolute")
        .style("top", 4+"px")
        .style("left", 0.25+"em,")
        .style("padding", 8+"px")
        .style("width", mapWidth/2-16+"px")
        .style("z-index", 10)
        .on("mouseover", function(d) {
            d3.select("body").style("cursor", "pointer");
          })                  
         .on("mouseout", function(d) {       
            d3.select("body").style("cursor", "default");
          })
        .on("click", function(d){
            if(llActive){
              llActive=false;
              deActivateLayerMenu(domains.length);

            }else{
              llActive=true;
              activateLayerMenu(domains.length);

            }


         });


    layerList.append("object")
      .attr("class", "mapIcon")
      .attr("data", "images/svg/icon_layers.svg")
      .attr("type", "image/svg+xml") 
      .style("position", "relative")
      .style("left", 0.5+"em")

    layerList.append("vLine")
      .attr("class", "vLine")
      .style("position", "absolute")
      .style("margin-top", 0.5+"em")
      .style("margin-bottom", 0.5+"em")
      .style("left", 3+"em")
      .style("top", 0+"em")
      .style("height", 1.5+"em"); 

     layerList.append("h3")
        .style("position", "absolute")
        .style("margin-top", 0.5+"em")
        .style("margin-bottom", 0.5+"em")
        .style("left", 3+"em")
        .style("top", 0+"em")
        .style("height", 1.5+"em")
        .text("Layers")

     dropDownLayers=mapMenu.append('div')
        .attr("id", "dropDownLayers")  
        .style("background-color", "#e3ddd7")
        .style("position", "absolute")
        .style("top", -mapWidth+"px")
        .style("left", 0+"px")
        .style("width", mapHeight/2+"px")
        .style("height", domains.length*100+"px") 
        //.style("height", 0+"px")
        .style("z-index", 5)
        .style("opacity", 0)
    
        dropDownLayers.append("hLine")
          .attr("class", "hLine")
          .style("position", "relative")
          .style("margin-top", 0+"em")
          .style("left", 1+"em")
          .style("width", 90+"%")    
        

    var data=domains;
    
    var div = dropDownLayers.selectAll("div")
      .data(data)
      .enter().append("div")
        .style("position", "absolute")
        .style("top", function(d,i){ return i*100+"px" })
        .style("height", 100+"px")
        .style("width", 100+"%")
        
    div.append("object")
          .attr("class", "mapIcon")
          .attr("id", function(d) { return "icon_"+d.id} )
          .attr("data", function(d) { return d.icon})
          .attr("type", "image/svg+xml")
          .style("position", "relative")
          // .style("width", 24+"px")
          // .style("height", "auto")
          .style("top", 0.5+"em")
          .style("left", 0.5+"em");
     
    div.append("h3")
          .style("position", "absolute")
          .style("top", 0.5+"em")
          .style("left", 3+"em")
          .text(function(d) { return d.id}) 
          
    div.append("hLine")
      .attr("class", "hLine")
      .style("position", "relative")
      .style("margin-top", 0+"em")
      .style("left", 3.5+"em")
      .style("width", 80+"%") 
      
    div.append("vLine")
        .attr("class", "vLine")
        .style("position", "absolute")
        .style("margin-top", 0+"em")
        .style("left", 3+"em")
        .style("top", 0.5+"em")
        .style("height", 80+"%")
        
    div.selectAll("ul")
      .data(function(d) { return d.subDomains; })
      .enter()
        .append("li")
        .attr("class", function(d) {return d.id})
        .style("position", "relative")
        .style("left", 4+"em")
        .style("top", -0.5+"em")
        .style("list-style-type", "none")
        .append("h4")
        .text(function(d) {return d.label}) 
        
    div.append("hLine")
      .attr("class", "hLine")
      .style("position", "relative")
      .style("margin-top", 0+"em")
      .style("left", 1+"em")
      .style("width", 90+"%")             
      
    
        
  }
  
  function activateLayerMenu(index){
      console.log(index);
      dropDownLayers.transition()
          .duration(500)
          .style("top", 48+"px")
          .style("opacity", 0.95)  
        
    
  }
  
  function deActivateLayerMenu(index){
          
      dropDownLayers.transition()
          .duration(500)
          .style("top", -mapHeight+"px")  
          .style("opacity", 0)  
    
  }
  
  function getGeoData(url, _data, layerId, page){
  	
  	var data=_data;  
  	//d3.json(apiUrlSDK+url+apiGeom, function(results){
    d3.json(url+"&page="+page, function(results){
  		console.log("results :"+results.results.length);
  		data=data.concat(results.results);
  		
  		if(results.results.length>=1000){

  		  var newPage=parseInt(page+1);
  		  console.log("getting data page :"+newPage);
  		  getGeoData(url, data, layerId, newPage);
  		  return;
  		}

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
    	  
        // max =  d3.max(dataLayer.data, function(d) { return d.subData[activeLayer]; });
        //         min =  d3.min(dataLayer.data, function(d) { return d.subData[activeLayer]; });
        // colorScale = d3.scale.linear().domain([min,max]).range(['white', 'orange']);
        //         quantizeBrewer = d3.scale.quantile().domain([min, max]).range(d3.range(rangeCB));
        //         scalingGeo = d3.scale.linear().domain([min, max]).range(d3.range(max));

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
     
     
     if(layerId=="map_cbs"){
       data.forEach(function(d){
            d.value=10+(Math.random()*90);
        });
     }
     
     var max =  d3.max(data, function(d) { return d.value; });
     var min =  d3.min(data, function(d) { return d.value; }); 
     var quantizeBrewer = d3.scale.quantile().domain([min, max]).range(d3.range(rangeCB));

     var visMap=d3.select("#"+layerId);
     var vis=visMap.selectAll("path").data(data, function(d, i){return d.cdk_id});

     vis.enter().append("path")
   			  .attr("id", function(d, i){return d.cdk_id;})
   			  .attr("d", path)
   			  .style("fill", function(d){ return colorbrewer[colorScheme]['9'][quantizeBrewer([d.value])] })
   			  .style("opacity", 0)
   			  .on("mouseover", function(d){
   			    d3.select(this).style("stroke-width", 0.25+"px" );
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
      			  d3.select(this).style("fill", function(d){ return colorbrewer[colorScheme]['9'][quantizeBrewer([d.value])] })
              toolTip.transition()        
                  .duration(250)      
                  .style("opacity", 0);			  
      			  
      			})
    			  .on("click", function(d){
    			        			    
      			})
      			
        vis.transition()
            .duration(1000)
            .style("fill", function(d){ return colorbrewer[colorScheme]['9'][quantizeBrewer([d.value])] })
            .style("opacity", 0.75)

         vis.exit().transition()
             .duration(500)
            .style("opacity", 0 )
            .remove();			
      			
      			

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
    
    var max =  d3.max(data, function(d) { return d.value; });
    var min =  d3.min(data, function(d) { return d.value; }); 
    var quantizeBrewer = d3.scale.quantile().domain([min, max]).range(d3.range(rangeCB));
	  
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
  			  .style("stroke", function(d){ return colorbrewer[colorScheme]['9'][quantizeBrewer([d.value])] })
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
            .style("stroke", function(d){ return colorbrewer[colorScheme]['9'][quantizeBrewer([d.value])] })
            .style("stroke-width", function(d){return (d.value/2)})

         vis.exit().transition()
            .duration(250)
            .style("stroke-width", function(d){return 0})
            .remove();		  

	}
	
	updatePointMap = function(data, layerId){
    
    console.log("setting traffic map "+layerId);
	  
	  data.forEach(function(d){
	    d.value = 0.1 + Math.random();
	     
    });
    var min =  d3.min(data, function(d) { return d.value; });
    var max =  d3.max(data, function(d) { return d.value; });
    
    var colorScale = d3.scale.linear().domain([min,max]).range(['white', 'blue']);
    var quantizeBrewer = d3.scale.quantile().domain([min, max]).range(d3.range(9));
    var scalingGeo = d3.scale.linear().domain([min, max]).range(d3.range(100));

  	var visPointMap=d3.select("#"+layerId);
    var vis = visPointMap.selectAll("path").data(data, function(d, i){return d.cdk_id});

		vis.enter().append("path")
		     //.filter(function(d){ return d.value > 2; })
  			  .attr("id", function(d, i){return d.cdk_id})
  			  .attr("d", function(d){
                        path.pointRadius(d.value);
                        return path(d);
                      })
  			  .style("fill-opacity", 1)
  			  .style("stroke-width", 0.1+"px")
  			  .style("opacity", 0)
  			  .style("fill", function(d){ return colorbrewer[colorScheme]['9'][quantizeBrewer([d.value])] })
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
  	    
  	    vis.transition()
            .duration(1000)
            .style("opacity", 1)
            .style("fill", function(d){ return colorbrewer[colorScheme]['9'][quantizeBrewer([d.value])] })
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
    
    var layers=_properties.subDomains;
    
    for (var i=0; i<layers.length; i++){
      if(layers[i]!=false && layers[i].mapUrl!="dummy"){
        
        console.log("adding map layer :"+layers[i].id);
          var layerId="map_"+layers[i].id;
          
          map.append("g")
            .attr("id", layerId)
            .attr("class", "Oranges");
          var data=[];
          var page=1;  
          getGeoData(layers[i].mapUrl, data, layerId, page);  
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