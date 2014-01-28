var domainList;
function createDomains(){
  
  var list=[];
  // domain DIVV
  var mainDomain={id:"transport", label:"Transport", icon:"images/svg/icon_transport.svg"};
  var dummyData=getDummyData();
  var tickerData = [
      {bullet:">", discription: "Road pressure", value: "30%"},
      {bullet:"+", discription: "Avg. speed", value: "32 km/u"},
      {bullet:"+", discription: "Parking", value: "29%"},
  ];
  var subDomainA={id:"divv", label:"Transport & Infrastructure", icon:"images/svg/icon_divv.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
  
  dummyData=getDummyData();
  tickerData = [
      {bullet:">", discription: "Ontime", value: "30 %"},
      {bullet:"+", discription: "Avg. delay time", value: "156 sec"},
      {bullet:"+", discription: "Total trips", value: "308 (410)"},
  ];  
  var subDomainB={id:"pt", label:"Public transport", icon:"images/svg/icon_pt.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
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
  dummyData=getDummyData();
  tickerData = [
      {bullet:">", discription: "NO2", value: "20.27 "},
      {bullet:"+", discription: "CO", value: "117.49 "},
      {bullet:"+", discription: "Noise level", value: "63.24 dB"},
  ];
  subDomainA={id:"smartcitizen", label:"Smartcitizen", icon:"images/svg/icon_smartcitizen.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
  dummyData=getDummyData();
  tickerData = [
      {bullet:">", discription: "NO2", value: "20.27"},
      {bullet:"+", discription: "CO", value: "117.49"},
      {bullet:"+", discription: "PM10", value: "63.24"},
  ];
  subDomainB={id:"airqualities", label:"Air qualities", icon:"images/svg/icon_airquality.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
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
  dummyData=getDummyData();
  tickerData = [
      {bullet:">", discription: "value A_1", value: "20.27 "},
      {bullet:"+", discription: "value A_2", value: "117.49 "},
      {bullet:"+", discription: "value A_3", value: "63.24"},
  ];
  subDomainA={id:"companies", label:"Companies", icon:"images/svg/icon_company.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
  dummyData=getDummyData();
  tickerData = [
      {bullet:">", discription: "value B_1", value: "20.27"},
      {bullet:"+", discription: "value B_1", value: "117.49"},
      {bullet:"+", discription: "value B_1", value: "63.24"},
  ];
  subDomainB={id:"airqualities", label:"Air qualities", icon:"images/svg/icon_airquality.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
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


function getDummyData(){
  var data=[];
  for (var i=0; i<25; i++){
    var h=i;
    var value=20+Math.random()*80;
    var tick={ hour:h, value:value}
    data.push(tick);
  };
  
  return data;
    
};