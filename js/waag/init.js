var WAAG = WAAG || {};

var widgetHeight=14;
var menuHeight=8;
var mapHeight=36; // em
var mapWidth=48; //em

var toolTip;
var map; 

var dNow = new Date();
var hNow = dNow.getHours();
var mNow = dNow.getMinutes();

var apiUrlSDK="http://api.citysdk.waag.org/";
var apiGeom="&geom&per_page=1000";
var apiUrlDB="http://loosecontrol.tv:4567/";

function initDashboard(){

	console.log("kick off dashboard");
	
	toolTip = d3.select("body").append("div")   
      .attr("class", "tooltip")               
      .style("opacity", 1);
	
	window.addEventListener('resize', onWindowResize, false);
	onWindowResize(null);
	
	domainList=createDomains();
	map = new WAAG.Map(domainList);
	
	for(var i=0; i<domainList.length; i++){
	  domainList[i].index=i;
	  var domain = new WAAG.Domain( domainList[i]);
        
	};
	
	var yf=menuHeight+(domainList.length*widgetHeight)+mapHeight;
	
	var footer = d3.select("#stage").append("div")   
      .attr("class", "footer")
      .style("top", yf+"em")
  
  footer.append("object")
      .attr("class", "plusIcon")
      .attr("id", "plusIcon")
      .attr("data", "images/svg/icon_logo.svg")
      .attr("type", "image/svg+xml")
	 
	
};

function repositionDomains(_index){
  
  var index=parseInt(_index);
  
  console.log("index :"+index);
  var map_container=d3.select("#map_container");
  map_container.transition()
      .duration(750)      
      .style("top", (menuHeight+widgetHeight+(index*widgetHeight))*16+"px");
  
  for(var i=0; i<domainList.length; i++){

      console.log("domain index :"+parseInt(domainList[i].index)+" --> id :"+domainList[i].mainDomain.id);
      
      if(parseInt(domainList[i].index)<index){
        console.log("smaller");
        d3.select("#"+domainList[i].mainDomain.id)
          .transition()
            .duration(750)      
            .style("top", (menuHeight+(domainList[i].index*widgetHeight))*16+"px");
      }else if(parseInt(domainList[i].index)==index){
        console.log("smaller");
        d3.select("#"+domainList[i].mainDomain.id)
          .transition()
            .duration(750)      
            .style("top", (menuHeight+(domainList[i].index*widgetHeight))*16+"px");
      
            map.addDomainLayer(domainList[i].mainDomain.id);
      
          
      }else if( parseInt(domainList[i].index)>index) {
        d3.select("#"+domainList[i].mainDomain.id)
          .transition()
            .duration(750)      
            .style("top", (menuHeight+mapHeight+(domainList[i].index*widgetHeight))*16+"px");
      }
  	  
    
  };
  
  
  
  
};

function onWindowResize( event ) {
  console.log('resize');
  
	w = window.innerWidth;
  h = window.innerHeight;
  var stage=d3.select("#stage").style("left", (window.innerWidth/2)-(768/2)+"px");

};