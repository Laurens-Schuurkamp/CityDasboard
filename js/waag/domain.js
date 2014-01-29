WAAG.Domain = function Domain(_properties) {
  var properties=_properties;
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
      .attr("id", properties.mainDomain.id)
      .style("background-color", properties.color)
      .style("top", menuHeight+(properties.index*widgetHeight)+"em")
      
    
    // header setup  
    var header=container.append("div")
      .attr("id", "header")
      .style("padding", 1+"em")
      //not correct hit area
      
       
    header.append("object")
        .attr("class", "domainIcon")
        .attr("data", properties.mainDomain.icon)
        .attr("type", "image/svg+xml");
      
    header.append("h2")
      .text(properties.mainDomain.label);
          
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
        .attr("class", "plusIcon")
        .attr("data", "images/svg/icon_map-small.svg")
        .attr("type", "image/svg+xml")    
    
    var hit=header.append("div")
      .attr("class", "plusIcon")
      .on("click", function(){
         repositionDomains(properties.index);
        
        });

	  setDomainA(properties.subDomainA);
    setDomainB(properties.subDomainB);
   
 
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
    
    // create ticker table
    var tickerTable = createTickerTable(_properties.tickerData, ["bullet", "discription", "value"], subDomainA);
    drawGraph(_properties, subDomainA);
    
    
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
        
    var tickerTable = createTickerTable(_properties.tickerData, ["bullet", "discription", "value"], subDomainB);        
    drawGraph(_properties, subDomainB);

	};
	
	function drawGraph(_properties, subDomain){
	  
	  if(_properties.type=="bar"){
	    var barGraph = new WAAG.BarGraph(_properties.graphData, subDomain);
	  }else if (_properties.type=="line"){
	    var lineGraph = new WAAG.LineGraph(_properties.graphData, subDomain);
	  }
	  
	  
    
    
	  
	}

  function createTickerTable(data, columns, _domain) {
    
      var domain=_domain;
    
      var table = domain.append("table")
        .attr("class", "tickerTable")

        
      var thead = table.append("thead");
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
          .append("tr");

      // create a cell in each row for each column
      var cells = rows.selectAll("td")
          .data(function(row) {
              return columns.map(function(column) {
                  //console.log(column);
                  return {column: column, value: row[column]};
              });
          })
          .enter()
          .append("td")
              .style("width", function(d){ 
                if(d.column=="discription"){
                  return "60%";
                }else if(d.column=="value"){
                  return "30%";
                }else{
                  return "10%";
                }

                })
              .style("text-align", function(d){ 
                if(d.column=="discription"){
                  return "left";
                }else{
                  return "right";
                }

                })  
              .text(function(d) { return d.value; });

      return table;
  }
  

  init();
  
  return this;   

};