var WAAG = WAAG || {};
var widgetHeight=14;
var menuHeight=8;

var formatTime = d3.time.format("%e %B");
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
	  var domain = new WAAG.Domains( domains[i]); 
	};


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
  var svgDomainA, svgDomainB;
  
  var margin = {top: 20, right: 40, bottom: 30, left: 20},
      width = 350 - margin.left - margin.right,
      height = 90 - margin.top - margin.bottom;
      
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickValues([0, 12, 24]);
      //.tickFormat(d3.time.format("%H"));;

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("right")
      .tickValues([0, 50, 100]);
      //.ticks(10, "%");    

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
	  var data =_properties.graphData;    
    subDomainA=container.append("div")
      .attr("class", "subDomainA")
      .attr("id", _properties.id);
    
    subDomainA.append("object")
        .attr("class", "subDomainIcon")
        .attr("data", _properties.icon)
        .attr("type", "image/svg+xml");
    
    // create ticker table

    // render the table
    var tickerTable = createTickerTable(_properties.tickerData, ["discription", "value"], subDomainA);
    
    createGraph(_properties.graphData, subDomainA) 
 

	};
	
	
	function setDomainB(_properties){
    
    var data=_properties.graphData;
              
    subDomainB=container.append("div")
      .attr("class", "subDomainB")
      .attr("id", _properties.id)

      
    subDomainB.append("object")
        .attr("class", "subDomainIcon")
        .attr("data", _properties.icon)
        .attr("type", "image/svg+xml")
        
    var tickerTable = createTickerTable(_properties.tickerData, ["discription", "value"], subDomainB);        
    
    createGraph(_properties.graphData, subDomainB);    
        

	};
	
  function createGraph( data, _subDomain){
     
     var subDomain = _subDomain;
      svgDomain = subDomain.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("position", "absolute")
        .style("left", 1+"em")
        .style("top", 3+"em")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
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
      
      updateDomain(data, svgDomain);

  };
	
	function updateDomain(data, _svgDomain){
	  
	  
	  var svgDomain=_svgDomain;

    var vis=svgDomain.selectAll(".bar").data(data, function(d, i){return i});
    
    vis.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.hour); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(0); })
        .attr("height", function(d) { return height - y(0); })
        .style("fill", function(d) { if(d.hour>hNow) return "none" })
        .style("stroke", function(d) { if(d.hour>hNow) return "#999" })
        .on("mouseover", function(d) {
                    console.log("mouse over");
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
            updateDummySet(data, _svgDomain);
			      
			    });

    var time=500+(Math.random()*1000);    
    vis.transition()
        .duration(time)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
        
    vis.exit().transition()
        .duration(time)
        .style("opacity", 0 )
        .remove();        

	};
	
	function updateDummySet(data, _svgDomain){
	  data=getDummyData();
	  updateDomain(data, _svgDomain);
	  
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