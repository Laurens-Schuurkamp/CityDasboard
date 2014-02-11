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


var initialTickerData=[];
var admrData=[];
var dashBoardData=[];
//http://loosecontrol.tv:4567/dashboard

function getInitialData(){
  var apiCall="transport.car.pressure";

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

    var dTemp=new Date();
    //console.log("dTemp :"+dTemp);

    for(var i=0; i<24; i++){
      var timeStamp=dTemp.setHours(i);
      var h=dTemp.getHours();
      var object={hour:h, timestamp:timeStamp, value:null}
      initialTickerData.push(object);
    }

    //console.log(initialTickerData);
    getAdmrData()
    
   
  });
  
}

function getAdmrData(){
  
  //var url="http://loosecontrol.tv:4567/cache/3600/admr.nl.amsterdam/regions?admr::admn_level=5&layer=cbs&geom&per_page=1000"
  
  var url="http://loosecontrol.tv:4567/cache/3600/admr.nl.amsterdam/regions?admr::admn_level=5&geom&per_page=1000";
  // d3.json(url, function(results){
  //     admrData=results.results;
  //     initDashboard();  
  // }); 
  
  initDashboard();  
    
}


function createDomains(){
  
  // http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/info
  // http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/live
  // http://loosecontrol.tv:4567/transport.car.pressure/admr.nl.amsterdam/history
  // http://loosecontrol.tv:4567/cache/3600/admr.nl.amsterdam/nodes?admr::admn_level=5&geom&per_page=1000
  
  var list=[];
  // domain Traffic
  
  var tickerData = {
      live:true,
      data:[
      {bullet:"", description: "Road pressure", value: "", kci:"transport.car.pressure"},
      {bullet:"", description: "Avg. speed", value: "", kci:"transport.car.speed"},
      {bullet:"", description: "Parking", value: "29%", kci:"dummy"}
      ]
  };
  
  // for(var i=0; i<dashBoardData.length; i++){
  //   if(dashBoardData[i].id=="transport"){
  //     var tickerData=dashBoardData[i].subdomains[0].tickerData.value;
  //   }
  //   
  // }
  
  // domain Transport
  var subDomainA={id:"traffic", 
    label:"Transport", 
    icon:"images/svg/icon_transport.car.svg", 
    tickerData:tickerData, 
    graphType:"bar",
    mapUrl:"http://loosecontrol.tv:4567/cache/3600/nodes?layer=divv.traffic&geom&per_page=1000"
    };
  
  var tickerData = {
      live:true,
      data:[
        {bullet:">", description: "Ontime", value: "30 %", kci:"dummy"},
        {bullet:"+", description: "Avg. delay time", value: "156 sec", kci:"dummy"},
        {bullet:"+", description: "Total trips", value: "308 (410)", kci:"dummy"},
      ]
  };  
  var subDomainB={id:"pt", 
    label:"Public transport", 
    icon:"images/svg/icon_transport.pt.svg", 
    tickerData:tickerData, 
    graphType:"bar",
    mapUrl:"http://loosecontrol.tv:4567/cache/3600/admr.nl.amsterdam/ptstops?geom&per_page=1000"
    };
	var properties={
	  id:"transport",
	  label:"Transport",
	  color:"#FFCC99",
	  icon:"images/svg/icon_transport.svg", 
	  subDomains:[subDomainA, subDomainB]
	};
	list.push(properties);
  
  // domain economy 
  //   tickerData = [
  //       {bullet:">", description: "value A_1", value: "20.27 ", kci:"dummy"},
  //       {bullet:"+", description: "value A_2", value: "117.49 ", kci:"dummy"},
  //       {bullet:"+", description: "value A_3", value: "63.24", kci:"dummy"},
  //   ];
  //     
  //   subDomainA={id:"companies", 
  //     label:"Companies", 
  //     icon:"images/svg/icon_economy.company.svg", 
  //     tickerData:tickerData, 
  //     graphType:"area",
  //     mapUrl:"dummy"
  //     };
  //   tickerData = [
  //       {bullet:">", description: "value B_1", value: "20.27", kci:"dummy"},
  //       {bullet:"+", description: "value B_1", value: "117.49", kci:"dummy"},
  //       {bullet:"+", description: "value B_1", value: "63.24", kci:"dummy"},
  //   ];
  // 
  //   var properties={
  //     id:"economy",
  //     label:"Economy",
  //   icon:"images/svg/icon_economy.svg", 
  //   color:"#FF9966",//F16912
  //     subDomains:[subDomainA, false]
  // 
  // };
  // list.push(properties);

  // domain cbs 
  var tickerData = {
      live:false,
      data:[{bullet:">", description: "value A_1", value: "0.00 ", kci:"http://loosecontrol.tv:4567/cache/3600/admr.nl.amsterdam/regions?admr::admn_level=5&layer=cbs&per_page=1000 "}],
      layers:cbsLayers
  };
    
  subDomainA={id:"cbsA", 
    label:"CBS Statistics", 
    icon:"images/svg/icon_statistics.cbs.svg", 
    tickerData:tickerData, 
    graphType:"donut",
    mapUrl:"http://loosecontrol.tv:4567/cache/3600/admr.nl.amsterdam/regions?admr::admn_level=5&layer=cbs&geom&per_page=1000"  
  };
  
  var tickerData = {
      live:false,
      data:[{bullet:">", description: "value A_1", value: "0.00 ", kci:"http://loosecontrol.tv:4567/cache/3600/admr.nl.amsterdam/regions?admr::admn_level=5&layer=cbs&per_page=1000 "}],
      layers:cbsLayers
  };
  
  subDomainB={id:"cbsB",
    label:"CBS Statistics", 
    icon:"images/svg/icon_statistics.cbs.svg", 
    tickerData:tickerData, 
    graphType:"circlepack",
    mapUrl:"dummy"
    
    
  };

  var properties={
    id:"statistics",
    label:"Statistics",
	  icon:"images/svg/icon_statistics.svg", 
	  color:"#EF7714",//F16912
    subDomains:[subDomainA, subDomainB]

	};
	list.push(properties);

  // domain environment  
  var tickerData = {
      live:true,
      data:[
      {bullet:">", description: "Temperature", value: "20.27 ", kci:"environment.sck.temperature"},
      {bullet:"+", description: "Noise level", value: "63.24 dB", kci:"environment.sck.noise"}
  ]};
  subDomainA={id:"smartcitizen",
    label:"Smartcitizen", 
    icon:"images/svg/icon_environment.sck.svg", 
    tickerData:tickerData, 
    graphType:"line",
    mapUrl:"dummy"
  };
  var tickerData = {
      live:true,
      data:[
      {bullet:">", description: "NO2", value: "20.27", kci:"dummy"},
      {bullet:"+", description: "CO", value: "117.49", kci:"dummy"},
      {bullet:"+", description: "PM10", value: "63.24", kci:"dummy"},
      ]
  };    
  subDomainB={id:"airqualities", 
    label:"Air qualities", 
    icon:"images/svg/icon_environment.airquality.svg", 
    tickerData:tickerData, 
    graphType:"area",
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

	
	// domain social
	var tickerData = {
      live:true,
      data:[
        {bullet:">", description: "Political parties", value: "20.27", kci:"social.twitter.sentiment"}
      ]
  };

  subDomainA={id:"sentiment", 
    label:"Sentiment", 
    icon:"images/svg/icon_social.twitter.svg", 
    tickerData:tickerData, 
    graphType:"multiline",
    mapUrl:"dummy"
    
    
    };

  	var tickerData = {
        live:true,
        data:[
          {bullet:">", description: "Soccer", value: "20.27", kci:"social.twitter.soccer"}
        ]
    };
    subDomainB={id:"soccer", 
      label:"Soccer", 
      icon:"images/svg/icon_social.twitter.svg", 
      tickerData:tickerData, 
      graphType:"multiline",
      mapUrl:"dummy"


      };
  var properties={
    id:"social",
    label:"Social",
	  icon:"images/svg/icon_social.svg", 
	  color:"#EF7714",//F16912
    subDomains:[subDomainA, false]

	};
	list.push(properties);
	
  return list;
}

var cbsLayers=[
      {value:"bev_dichth", description:"Bev. dichtheid"},
      {value:"aant_inw", description:"Aantal inwoners"},
      {value:"aant_vrouw", description:"Aantal vrouwen"},
      {value:"aant_man", description:"Aantal mannen"},
      {value:"aantal_hh", description:"Aantal huishoudens"},
      {value:"gem_hh_gr", description:"Gemm. hh grote"},
      {value:"p_gehuwd", description:"Perc. gehuwd"},
      {value:"p_hh_m_k", description:"Perc. hh met kinderen"},
      {value:"p_hh_z_k", description:"Perc. hh zonder kinderen"},
      {value:"p_eenp_hh", description:"Perc. 1pers. hh"},
      {value:"p_gescheid", description:"Perc. gescheiden"},
      {value:"p_ongehuwd", description:"Perc. ongehuwd"},
      {value:"p_verweduw", description:"Perc. weduw"},
      
      {value:"p_surinam", description:"Perc. Surninaams"},
      {value:"p_ant_aru", description:"Perc. Antiliaans"},
      {value:"p_marokko", description:"Perc. Marokaans"},
      {value:"p_turkije", description:"Perc. Turks"},
      {value:"p_west_al", description:"Perc. west. allochtoon"},
      {value:"p_n_w_al", description:"Perc. niet west. allochtoon"},
      {value:"p_over_nw", description:"Perc. overig niet west."},

      {value:"p_00_14_jr", description:"Perc. 0 - 14 jaar"},
      {value:"p_15_24_jr", description:"Perc. 15 - 24 jaar"},
      {value:"p_25_44_jr", description:"Perc. 25 - 44 jaar"},
      {value:"p_45_64_jr", description:"Perc. 45 - 64 jaar"},
      {value:"p_65_eo_jr", description:"Perc. 65+ jaar"},
      
      
      {value:"opp_tot", description:"Opp. totaal"},
      {value:"opp_land", description:"Opp. land"},
      {value:"opp_water", description:"Opp. water"},
];

