WAAG.Domain = function Domain(_propertiesAll) {
  var properties=_propertiesAll;
  var container;
  var subDomianA, subDomianB;
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 350 - margin.left - margin.right,
      height = 90 - margin.top - margin.bottom;
      
  var x,y,xaxis,yaxis;
    

	function init(){
	  

	  var stage = d3.select("#stage");
    container = stage.append("div")
      .attr("class", "domain_container")
      .attr("id", properties.id)
      .style("background-color", properties.color)
      .style("top", menuHeight+(properties.index*widgetHeight)+"em")
      
    
    // header setup  
    var header=container.append("div")
      .attr("id", "header")
      .style("padding", 1+"em")
      //not correct hit area
      
       
    header.append("object")
        .attr("class", "domainIcon")
        .attr("data", properties.icon)
        .attr("type", "image/svg+xml");
      
    header.append("h2")
      .text(properties.label);
          
    header.append("div")
      .attr("class", "hLine")
      .style("margin-top", 0.5+"em")
      .style("margin-bottom", 0.5+"em")
      .style("left", 6+"em");
      
    header.append("div")
      .attr("class", "vLine")
      .style("position", "absolute")
      .style("margin-top", 0.5+"em")
      .style("margin-bottom", 0.5+"em")
      .style("left", 768/2+"px")
      .style("height", 8+"em");
      
      header.append("object")
        .attr("class", "mapIcon")
        .attr("data", "images/svg/icon_map-small.svg")
        .attr("type", "image/svg+xml")    
    
    var hit=header.append("div")
      .attr("class", "mapIcon")
      .on("click", function(){
         activateMap(properties);
        })
      .on("mouseover", function(d) {
          d3.select("body").style("cursor", "pointer");
        })                  
       .on("mouseout", function(d) {       
          d3.select("body").style("cursor", "default");
        });

	  setDomainA(properties.subDomains[0]);
    setDomainB(properties.subDomains[1]);
   
 
	};

	
	function setDomainA(_properties){
	  
	  if(_properties.active==false){
	    return;
	  }
	      
    subDomainA=container.append("div")
      .attr("class", "subDomainA")
      .attr("id", _properties.id);
    
    subDomainA.append("object")
        .attr("class", "subDomainIcon")
        .attr("data", _properties.icon)
        .attr("type", "image/svg+xml");
    

    setGraph(_properties, subDomainA);
    
    
    if(_properties.id=="smartcitizen"){
      subDomainA.append("object")
          .attr("id", "tempGraph")
          .attr("data", "images/svg/icon_tempGraph.svg")
          .attr("type", "image/svg+xml")
          .style("position", "relative")
          .style("left", 20.5+"em")
          .style("top", -0.5+"em")
          .on("mouseover", function(d) {
                toolTip.transition()        
                    .duration(100)      
                    .style("opacity", .9);      
                toolTip.html("temp 22.4")  
                    .style("left", (d3.event.pageX) + 6+"px")     
                    .style("top", (d3.event.pageY - 10) + "px");    
                })
          .on("mouseout", function(d) {       
              toolTip.transition()        
                  .duration(250)      
                  .style("opacity", 0);   
          })
    };
    

	};
	
	
	function setDomainB(_properties){
    
    if(_properties==false){
	    return;
	  }
      
    subDomainB=container.append("div")
      .attr("class", "subDomainB")
      .attr("id", _properties.id)

      
    subDomainB.append("object")
        .attr("class", "subDomainIcon")
        .attr("data", _properties.icon)
        .attr("type", "image/svg+xml")
              
    setGraph(_properties, subDomainB);

	};
	
	function setGraph(_properties, subDomain){
	  
	  var kci=_properties.tickerData[0].kci;
    var dummyData=false;
    if(kci=="dummy"){
      dummyData=true;
      kci="transport.car.pressure";
    }
    
    d3.json("http://loosecontrol.tv:4567/"+kci+"/admr.nl.amsterdam/history", function(results){
      var i=0;
      for( i=0; i<_properties.tickerData.length; i++){
          _properties.tickerData[i].kciData=[];
      };
     
     
     for(var i=0; i<results.length; i++){
         var d=new Date();
         d.setTime(results[i].timestamp*1000);
         var h=d.getHours();
         var value=results[i][kci+":admr.nl.amsterdam"]
         if(dummyData) {
            value=10+(Math.random()*90);
            kci="dummy"; 
          }
         var object={hour:h, timestamp:d, value:value}
         _properties.tickerData[0].kciData.push(object);

     };

     _properties.tickerData[0].kciData.sort(function(a, b) { return d3.ascending(a.hour, b.hour)});
      var graph;
   	  if(_properties.graphType=="bar"){
   	    graph = new WAAG.BarGraph(_properties, subDomain);
   	  }else if (_properties.graphType=="line"){
   	    graph = new WAAG.LineGraph(_properties, subDomain);
   	  }

     createTickerTable(_properties, ["bullet", "description", "value"], subDomain, graph);

     
    });

	};
	
	function updateGraph(_properties, kci, _class){
	  
	  
    var dummyData=false;
    if(kci=="dummy"){
      dummyData=true;
      kci="transport.car.pressure";
    }
    
    var index=0;
    for(var i=0; i<_properties.tickerData.length; i++){
      if(kci==_properties.tickerData[i].kci){
        index=i;
      }
    }
    
    
    d3.json("http://loosecontrol.tv:4567/"+kci+"/admr.nl.amsterdam/history", function(results){

     _properties.tickerData[index].kciData=[];
     for(var i=0; i<results.length; i++){
         var d=new Date();
         d.setTime(results[i].timestamp*1000);
         //console.log(d);
         var h=d.getHours();
         var value=results[i][kci+":admr.nl.amsterdam"]
         if(dummyData) {
           value=10+(Math.random()*90);
           kci="dummy"; 
         }
         var object={hour:h, timestamp:d, value:value}
         _properties.tickerData[index].kciData.push(object);

     };

     _properties.tickerData[index].kciData.sort(function(a, b) { return d3.ascending(a.hour, b.hour)});
     _class.updateDataSet(_properties, kci, index);

     
    });
	  
	  
	};
	
	function createTickerTable(_properties, columns, _domain, _class) {
      
      var data=_properties.tickerData;
      var domain=_domain;

      var table = domain.append("table")
        .attr("class", "tickerTable")

      //var thead = table.append("thead");
      var tbody = table.append("tbody");

      // create & append the header row
      // thead.append("tr")
      //     .selectAll("th")
      //     .data(columns)
      //     .enter()
      //     .append("th")
      //         .text(function(column) { return column; });

      // create a row for each object in the data
      var rows = tbody.selectAll("tr")
          .data(data)
          .enter()
          .append("tr")
          .attr("id", function(d){return d.kci})

      // create a cell in each row for each column
      var cells = rows.selectAll("td")
          .data(function(row) {
              return columns.map(function(column) {     
                  return {column: column, value: row[column], kci:row["kci"]};
              });
          })
          .enter()
          .append("td")
              .style("width", function(d, i){ 
                
                if(d.column=="description"){
                  return "60%";
                }else if(d.column=="value"){
                  return "30%";
                }else{
                  return "10%";
                }

                })
              .style("text-align", function(d){ 
                if(d.column=="description"){
                  return "left";
                }else{
                  return "right";
                }

                })  
              .text(function(d) { return d.value; })
              .on("mouseover", function(d) {
                  d3.select("body").style("cursor", "pointer");
                })                  
               .on("mouseout", function(d) {       
                  d3.select("body").style("cursor", "default");
                })
              .on("click", function(d){
                    //console.log(d.kci);
                    //_class.updateDataSet(d.kci);
                    updateGraph(_properties, d.kci, _class);
               });

      return table;
  }

  init();
  
  return this;   

};
// end domain class

function activateMap(_properties){
  
  var index=parseInt(_properties.index);
  
  console.log("index :"+index);
  var map_container=d3.select("#map_container");
  map_container.transition()
      .duration(750)      
      .style("top", (menuHeight+widgetHeight+(index*widgetHeight))*16+"px");
  
  for(var i=0; i<domainList.length; i++){

      //console.log("domain index :"+parseInt(domainList[i].index)+" --> id :"+domainList[i].mainDomain.id);
      
      if(parseInt(domainList[i].index)<index){
        d3.select("#"+domainList[i].id)
          .transition()
            .duration(750)      
            .style("top", (menuHeight+(domainList[i].index*widgetHeight))*16+"px");
      }else if(parseInt(domainList[i].index)==index){
        d3.select("#"+domainList[i].id)
          .transition()
            .duration(750)      
            .style("top", (menuHeight+(domainList[i].index*widgetHeight))*16+"px");
      
            map.addDomainLayer(_properties);
      
          
      }else if( parseInt(domainList[i].index)>index) {
        d3.select("#"+domainList[i].id)
          .transition()
            .duration(750)      
            .style("top", (menuHeight+mapHeight+(domainList[i].index*widgetHeight))*16+"px");
      }
  	  
    
  };

};