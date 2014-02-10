var WAAG = WAAG || {};

var widgetHeight=224;
var menuHeight=128;
var mapWidth=768;
var mapHeight=576;

var toolTip;
var map;
var colorScheme="Oranges";

var rangeCB=9; //range colorbrewer


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
      .style("top", yf+"px")
  
  footer.append("object")
      .attr("class", "plusIcon")
      .attr("id", "plusIcon")
      .attr("data", "images/svg/icon_logo.svg")
      .attr("type", "image/svg+xml")
	 
	
};

function change() {
  console.log("value ="+this.value);
    var value = this.value;
    
};


function onWindowResize( event ) {
  console.log('resize');
  
	w = window.innerWidth;
  h = window.innerHeight;
  var stage=d3.select("#stage").style("left", (window.innerWidth/2)-(mapWidth/2)+"px");

};