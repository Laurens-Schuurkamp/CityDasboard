var dNow = new Date();
var hNow = dNow.getHours();
var mNow = dNow.getMinutes();
console.log("hours ="+hNow)


function createDomains(){
  var domainList=[];
  
  // domain DIVV
  var mainDomain={id:"transport", label:"Transport", icon:"images/svg/icon_transport.svg"};
  var dummyData=getDummyData();
  var tickerData = [
      {discription: "Road pressure", value: "30%"},
      {discription: "Avg. speed", value: "32%"},
      {discription: "Parking", value: "29%"},
  ];
  var subDomainA={id:"divv", label:"Transport & Infrastructure", icon:"images/svg/icon_divv.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
  
  dummyData=getDummyData();
  tickerData = [
      {discription: "Ontime", value: "30 %"},
      {discription: "Avg. delay time", value: "30 %"},
      {discription: "Total trips", value: "30 %"},
  ];  
  var subDomainB={id:"pt", label:"Public transport", icon:"images/svg/icon_pt.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
	var properties={
	  index:0,
	  color:"#FFCC99",
	  mainDomain:mainDomain,
	  subDomainA:subDomainA,
	  subDomainB:subDomainB,

	};
	domainList.push(properties);
  
  // domain environment  
  mainDomain={id:"environment", label:"Environment", icon:"images/svg/icon_environment.svg"};
  dummyData=getDummyData();
  tickerData = [
      {discription: "NO2", value: "20.27 "},
      {discription: "CO", value: "117.49 "},
      {discription: "Noise level", value: "63.24 dB"},
  ];
  subDomainA={id:"smartcitizen", label:"Smartcitizen", icon:"images/svg/icon_smartcitizen.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
  dummyData=getDummyData();
  tickerData = [
      {discription: "NO2", value: "20.27"},
      {discription: "CO", value: "117.49"},
      {discription: "PM10", value: "63.24"},
  ];
  subDomainB={id:"airqualities", label:"Air qualities", icon:"images/svg/icon_airquality.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
  var properties={
	  index:1,
	  color:"#FFB27D",
	  mainDomain:mainDomain,
	  subDomainA:subDomainA,
	  subDomainB:subDomainB,

	};
	domainList.push(properties);

  // domain economy 
  mainDomain={id:"economy", label:"Economy", icon:"images/svg/icon_economy.svg"};
  dummyData=getDummyData();
  tickerData = [
      {discription: "value A_1", value: "20.27 "},
      {discription: "value A_2", value: "117.49 "},
      {discription: "value A_3", value: "63.24"},
  ];
  subDomainA={id:"companies", label:"Companies", icon:"images/svg/icon_company.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
  dummyData=getDummyData();
  tickerData = [
      {discription: "value B_1", value: "20.27"},
      {discription: "value B_1", value: "117.49"},
      {discription: "value B_1", value: "63.24"},
  ];
  subDomainB={id:"airqualities", label:"Air qualities", icon:"images/svg/icon_airquality.svg", graphData:dummyData, tickerData:tickerData, type:"bar"};
  var properties={
	  index:2,
	  color:"#FF9966",
	  mainDomain:mainDomain,
	  subDomainA:subDomainA,
	  subDomainB:false,

	};
	domainList.push(properties);


  //domainList.reverse();
  return domainList;
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