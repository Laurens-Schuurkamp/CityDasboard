var domainList;
//http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/live;
var apiUrlSDK="http://api.citysdk.waag.org/";
var apiGeom="&geom&per_page=1000";
var apiUrlDB="http://loosecontrol.tv:4567/";
var admr="admr.nl.amsterdam";

var dNow = new Date();
var timeNow=dNow.getTime();
var hNow = dNow.getHours();
var mNow = dNow.getMinutes();

var initialData=[];

//http://loosecontrol.tv:4567/dashboard

function getInitialData(){
  var apiCall="transport.car.pressure";
  
  d3.json("http://loosecontrol.tv:4567/dashboard", function(results){
      
    console.log(results);
    for (var key in results) {
        console.log(key+"="+results[key]);
    };   
   
   getHistoryData();
   
  });
  
}

function getHistoryData(){
  var apiCall="transport.car.pressure";
  
  d3.json("http://loosecontrol.tv:4567/"+apiCall+"/admr.nl.amsterdam/history", function(results){
      
   for(var i=0; i<results.length; i++){
     var d=new Date();
     d.setTime(results[i].timestamp*1000);
     var h=d.getHours();

     var object={hour:h, timestamp:d, value:results[i][apiCall+":admr.nl.amsterdam"]}
          
     initialData.push(object);

   };
  
   initialData.sort(function(a, b) { return d3.ascending(a.hour, b.hour)});
   
   initDashboard();
   
  });
  
}



function createDomains(){
  
  var indicators=getTickerIndicators("http://loosecontrol.tv:4567/indicator");
  //var testData=getTickerGraphData("http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/history");
  // http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/info
  // http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/live
  // http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/history
  // http://loosecontrol.tv:4567/cache/3600/admr.nl.amsterdam/nodes?admr::admn_level=5&geom&per_page=1000
  
  var list=[];
  // domain DIVV
  var mainDomain={id:"transport", label:"Transport", icon:"images/svg/icon_transport.svg"};
  
  var tickerData = [
      {bullet:">", discription: "Road pressure", value: "41.8 %", kci:"transport.car.pressure"},
      {bullet:"+", discription: "Avg. speed", value: "32 km/u", kci:"transport.car.speed"},
      {bullet:"+", discription: "Parking", value: "29%", kci:"dummy"},
  ];
  
  console.log("ticker data ="+tickerData[0].graphData)
  var subDomainA={id:"traffic", label:"Transport & Infrastructure", icon:"images/svg/icon_divv.svg", tickerData:tickerData, type:"bar"};
  

  tickerData = [
      {bullet:">", discription: "Ontime", value: "30 %", kci:"dummy"},
      {bullet:"+", discription: "Avg. delay time", value: "156 sec", kci:"dummy"},
      {bullet:"+", discription: "Total trips", value: "308 (410)", kci:"dummy"},
  ];  
  var subDomainB={id:"pt", label:"Public transport", icon:"images/svg/icon_pt.svg", tickerData:tickerData, type:"line"};
	var properties={
	  index:0,
	  color:"#FFCC99",
	  mainDomain:mainDomain,
	  subDomainA:subDomainA,
	  subDomainB:subDomainB,

	};
	list.push(properties);
  
  // domain environment  
  mainDomain={id:"environment", label:"Environment", icon:"images/svg/icon_environment.svg"};

  tickerData = [
      {bullet:">", discription: "NO2", value: "20.27 ", kci:"dummy"},
      {bullet:"+", discription: "CO", value: "117.49 ", kci:"dummy"},
      {bullet:"+", discription: "Noise level", value: "63.24 dB", kci:"dummy"},
  ];
  subDomainA={id:"smartcitizen", label:"Smartcitizen", icon:"images/svg/icon_smartcitizen.svg", tickerData:tickerData, type:"line"};
  tickerData = [
      {bullet:">", discription: "NO2", value: "20.27", kci:"dummy"},
      {bullet:"+", discription: "CO", value: "117.49", kci:"dummy"},
      {bullet:"+", discription: "PM10", value: "63.24", kci:"dummy"},
  ];
  subDomainB={id:"airqualities", label:"Air qualities", icon:"images/svg/icon_airquality.svg", tickerData:tickerData, type:"bar"};
  var properties={
	  index:1,
	  color:"#FFB27D",
	  mainDomain:mainDomain,
	  subDomainA:subDomainA,
	  subDomainB:subDomainB,

	};
	list.push(properties);

  // domain economy 
  mainDomain={id:"economy", label:"Economy", icon:"images/svg/icon_economy.svg"};
  tickerData = [
      {bullet:">", discription: "value A_1", value: "20.27 ", kci:"dummy"},
      {bullet:"+", discription: "value A_2", value: "117.49 ", kci:"dummy"},
      {bullet:"+", discription: "value A_3", value: "63.24", kci:"dummy"},
  ];
  
  
  subDomainA={id:"companies", label:"Companies", icon:"images/svg/icon_company.svg", tickerData:tickerData, type:"bar"};
  tickerData = [
      {bullet:">", discription: "value B_1", value: "20.27", kci:"dummy"},
      {bullet:"+", discription: "value B_1", value: "117.49", kci:"dummy"},
      {bullet:"+", discription: "value B_1", value: "63.24", kci:"dummy"},
  ];
  subDomainB={id:"airqualities", label:"Air qualities", icon:"images/svg/icon_airquality.svg", tickerData:tickerData, type:"bar"};
  var properties={
	  index:2,
	  color:"#FF9966",
	  mainDomain:mainDomain,
	  subDomainA:subDomainA,
	  subDomainB:false,

	};
	list.push(properties);


  //domainList.reverse();
  return list;
}

function getTickerIndicators(url){
  d3.json(url, function(results){
		var data=results;
		console.log("tickerInfo ="+results);

		});
  
};

function getTickerInfo(url){
  d3.json(url, function(results){
		var data=results;
		console.log("tickerInfo ="+results);

		});
  
};

function getTickerValue(url){
  d3.json(url, function(results){
		
		console.log("tickerData ="+results["transport.car.pressure:admr.nl.amsterdam"]);
    var data=results["transport.car.pressure:admr.nl.amsterdam"];
    return data;
		});
  
};

function getTickerGraphData(url){
  d3.json(url, function(results){
		
		console.log(results);
    
    
		});
  
}



// function getDummyData(subDomain){
//   var data=[];
//   for (var i=0; i<initialData.length; i++){
//     var tick={ timestamp:initialData[i].timestamp, hour:initialData[i].hour, value:10+(Math.random()*90) }
//     
//     if(subDomain=="traffic") tick.value=initialData[i].value;
//     
//     data.push(tick);
//   };
// 
//   return data;
//     
// };