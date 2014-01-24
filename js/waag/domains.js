var WAAG = WAAG || {};
var widgetHeight=14;
var menuHeight=8;

var toolTip;

$(document).bind("ready", function() {
	console.log("kick off dashboard");
	
	toolTip = d3.select("body").append("div")   
      .attr("class", "tooltip")               
      .style("opacity", 1);
	
	window.addEventListener('resize', onWindowResize, false);
	onWindowResize(null);
	
	var domains=createDomains();
	
	for(var i=0; i<domains.length; i++){
	  domains[i].index=i;
	  var domain = new WAAG.Domains( domains[i]); 
	};
	
	//set map
	var map = new WAAG.Map(domains); 

});

function onWindowResize( event ) {
  console.log('resize');
	w = window.innerWidth;
  h = window.innerHeight;
  var stage=d3.select("#stage").style("left", (window.innerWidth/2)-(768/2)+"px");

};


WAAG.Domains = function Domains(_properties) {
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
      .style("top", menuHeight+(properties.index*widgetHeight)+"em");
    
    // header setup  
    var header=container.append("div")
      .attr("id", "header")
      .style("padding", 1+"em");
       
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
        .attr("data", "images/svg/icon_plus.svg")
        .attr("type", "image/svg+xml")

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
    var tickerTable = createTickerTable(_properties.tickerData, ["discription", "value"], subDomainA);

    var barGraph = new WAAG.BarGraph(_properties.graphData, subDomainA);

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
        
    var tickerTable = createTickerTable(_properties.tickerData, ["discription", "value"], subDomainB);        
    var barGraph = new WAAG.BarGraph(_properties.graphData, subDomainB);

	};

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
                  return {column: column, value: row[column]};
              });
          })
          .enter()
          .append("td")
              .style("width", function(d){ 
                if(d.column=="discription"){
                  return "70%";
                }else{
                  return "30%";
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