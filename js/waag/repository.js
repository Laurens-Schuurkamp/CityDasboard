var domainList;
//http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/live;
var apiUrlSDK="http://api.citysdk.waag.org/";
var apiGeom="&geom&per_page=1000";
var apiUrlDB="http://loosecontrol.tv:4567/";
var admr="admr.nl.amsterdam";
var assetsImages="images/images/";
var assetsSvg="images/svg/";

var dNow = new Date();
var timeNow=dNow.getTime();
var hNow = dNow.getHours();
var mNow = dNow.getMinutes();

var initialData=[];

//http://loosecontrol.tv:4567/dashboard

function getInitialData(){
  var apiCall="transport.car.pressure";
  
  var dashBoardData=[];

  d3.json("http://loosecontrol.tv:4567/dashboard", function(results){

    var domains=d3.entries(results);

    for(var i=0; i<domains.length; i++){
        var subdomains=[];  
        var subs=d3.entries(domains[i].value);  
        
        for(var j=0; j<subs.length; j++){
          var subDomain={};
          subDomain.id=subs[j].key;
          subDomain.label=subs[j].key;
          subDomain.icon="/images/svg/icon_"+domains[i].key+"."+subs[j].key+".svg";
          subDomain.tickerData=d3.entries(subs[j].value);
          subdomains[j]=subDomain;
          
        }
        
        var domain={
          color:"#ccc",
          id:domains[i].key,
          label:domains[i].key,
          icon:"/images/svg/icon_"+domains[i].key+".svg",
          graphType:"bar",
          subdomains:subdomains
        }
        
        dashBoardData.push(domain);
           
    }

   getHistoryData();
   
  });
  
}

function getAssets(){
  
};

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
  
  // http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/info
  // http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/live
  // http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/history
  // http://loosecontrol.tv:4567/cache/3600/admr.nl.amsterdam/nodes?admr::admn_level=5&geom&per_page=1000
  
  var list=[];
  // domain Traffic
  var tickerData = [
      {bullet:">", description: "Road pressure", value: "41.8 %", kci:"transport.car.pressure"},
      {bullet:"+", description: "Avg. speed", value: "32 km/u", kci:"transport.car.speed"},
      {bullet:"+", description: "Parking", value: "29%", kci:"dummy"},
  ];
  
  // domain Transport
  console.log("ticker data ="+tickerData[0].graphData)
  var subDomainA={id:"traffic", 
    label:"Transport", 
    icon:"images/svg/icon_transport.car.svg", 
    tickerData:tickerData, 
    graphType:"bar",
    mapUrl:"http://api.citysdk.waag.org/nodes?layer=divv.traffic&geom&per_page=1000"
    };
  
  tickerData = [
      {bullet:">", description: "Ontime", value: "30 %", kci:"dummy"},
      {bullet:"+", description: "Avg. delay time", value: "156 sec", kci:"dummy"},
      {bullet:"+", description: "Total trips", value: "308 (410)", kci:"dummy"},
  ];  
  var subDomainB={id:"pt", 
    label:"Public transport", 
    icon:"images/svg/icon_transport.pt.svg", 
    tickerData:tickerData, 
    graphType:"bar",
    mapUrl:"http://api.citysdk.waag.org/admr.nl.amsterdam/ptstops?geom&per_page=1000"
    };
	var properties={
	  id:"transport",
	  label:"Transport",
	  color:"#FFCC99",
	  icon:"images/svg/icon_transport.svg", 
	  subDomains:[subDomainA, subDomainB]
	};
	list.push(properties);
  
  // domain environment  
  tickerData = [
      {bullet:">", description: "NO2", value: "20.27 ", kci:"dummy"},
      {bullet:"+", description: "CO", value: "117.49 ", kci:"dummy"},
      {bullet:"+", description: "Noise level", value: "63.24 dB", kci:"dummy"},
  ];
  subDomainA={id:"smartcitizen",
    label:"Smartcitizen", 
    icon:"images/svg/icon_environment.sck.svg", 
    tickerData:tickerData, 
    graphType:"line",
    mapUrl:"dummy"
  };
  tickerData = [
      {bullet:">", description: "NO2", value: "20.27", kci:"dummy"},
      {bullet:"+", description: "CO", value: "117.49", kci:"dummy"},
      {bullet:"+", description: "PM10", value: "63.24", kci:"dummy"},
  ];
  subDomainB={id:"airqualities", 
    label:"Air qualities", 
    icon:"images/svg/icon_environment.airquality.svg", 
    tickerData:tickerData, 
    graphType:"line",
    mapUrl:"dummy"
    };
  var properties={
    id:"environment",
    label:"Environment",
	  icon:"images/svg/icon_environment.svg", 
	  color:"#FFB27D",
    subDomains:[subDomainA, subDomainB]

	};
	list.push(properties);

  // domain economy 
  tickerData = [
      {bullet:">", description: "value A_1", value: "20.27 ", kci:"dummy"},
      {bullet:"+", description: "value A_2", value: "117.49 ", kci:"dummy"},
      {bullet:"+", description: "value A_3", value: "63.24", kci:"dummy"},
  ];
    
  subDomainA={id:"companies", 
    label:"Companies", 
    icon:"images/svg/icon_economy.company.svg", 
    tickerData:tickerData, 
    graphType:"bar",
    mapUrl:"dummy"
    };
  tickerData = [
      {bullet:">", description: "value B_1", value: "20.27", kci:"dummy"},
      {bullet:"+", description: "value B_1", value: "117.49", kci:"dummy"},
      {bullet:"+", description: "value B_1", value: "63.24", kci:"dummy"},
  ];

  var properties={
    id:"economy",
    label:"Economy",
	  icon:"images/svg/icon_economy.svg", 
	  color:"#FF9966",
    subDomains:[subDomainA, false]

	};
	list.push(properties);

  return list;
}

