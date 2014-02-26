var bisectDate = d3.bisector(function(d) { return d.timestamp; }).left;
function mouseMove(x, y, mouse, data, focus) {
    
    var x0 = x.invert(mouse),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.timestamp) + "," + y(d.value) + ")");
    
    toolTip.transition()        
        .duration(100)      
        .style("opacity", 0.9);

    toolTip.html("Time : "+d.realTimestamp+ "<br/>Value "+d.description+" : "  + parseInt(d.value)+" "+d.units)  
        .style("left", (d3.event.pageX) + 10+"px")     
        .style("top", (d3.event.pageY - 28 - 10) + "px");
    
}
function mouseMoveMultiGraph(x, y, mouse, data, focus) {
    
    var x0 = x.invert(mouse),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.timestamp) + "," + 0 + ")");
    
    toolTip.transition()        
        .duration(100)      
        .style("opacity", 0.9);
    var label="";
    var v=d.value;  
    for(var key in v) {
			label+=key+": "+v[key]+"<br>"
		};    
     
    toolTip.html("Time : "+d.realTimestamp+"<br/>"+label)  
        .style("left", (d3.event.pageX) + 10+"px")     
        .style("top", (d3.event.pageY - 28 - 10) + "px");
    
}

function formatDate(date){

  
}



// function setXaxis(data, svgDomain, width, height, ticks, label, update){
// 
//   function setXaxis(data, svgDomain, width, height, ticks, label, update){
// 
//     var xAxis = d3.svg.axis()
//             .scale(x)
//             .orient("bottom")
//             .tickValues(ticks)
// 
//     if(!update){
//       svgDomain.append("g")
//           .attr("class", "x axis")
//           .attr("id", "x_axis")
//           .attr("transform", "translate(0," + height + ")")
//           .call(xAxis)
//           .append("text")
//             .attr("id", "x_axis_label")
//             .attr("x", 16)
//             .attr("y", 6)
//             .attr("dy", "1em")
//             .style("text-align", "center")
//             .text("time (hours)")
//     };
// 
//     return xAxis;
// 
//   }
// 
//   function setYaxis(data, svgDomain, width, height, ticks, label, update){
// 
// 
//    var yAxis = d3.svg.axis()
//             .scale(y)
//             .orient("right")
//             .ticks(ticks);
// 
//     if(!update){
//       svgDomain.append("g")
//           .attr("class", "y axis")
//           .attr("id", "y_axis")
//           .attr("transform", "translate(" + width + ",0)")
//           .call(yAxis)    
//         .append("text")
//           .attr("id", "y_axis_label")
//           .attr("transform", "rotate(-90)")
//           .attr("y", 6)
//           .attr("dy", "-38em")
//           .style("text-anchor", "end")
//           .style("text-align", "center")
// 
//       svgDomain.selectAll("#y_axis")
//         .append("text")
//           .attr("id", "y_axis_units")
//           .attr("y", 0)
//           .attr("x", 8)
//           .style("text-align", "right")
// 
//       svgDomain.selectAll("#y_axis")
//         .append("text")
//           .attr("id", "y_axis_units_min")
//           .attr("y", height+6)
//           .attr("x", 8)
//           .style("text-align", "right")
//           .text("test")
// 
// 
//     }
// 
// 
//     return yAxis;        
// 
//   }
//                 
//   return xAxis;
// 
// }
// 
// function setYaxis(data, svgDomain, width, height, ticks, label, update){
// 
//  var yAxis = d3.svg.axis()
//           .scale(y)
//           .orient("right")
//           .ticks(ticks);
//   
//   if(!update){
//     svgDomain.append("g")
//         .attr("class", "y axis")
//         .attr("id", "y_axis")
//         .attr("transform", "translate(" + width + ",0)")
//         .call(yAxis)    
//       .append("text")
//         .attr("id", "y_axis_label")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 6)
//         .attr("dy", "-38em")
//         .style("text-anchor", "end")
//         .style("text-align", "center")
//         
//     svgDomain.selectAll("#y_axis")
//       .append("text")
//         .attr("id", "y_axis_units")
//         .attr("y", 0)
//         .attr("x", 8)
//         .style("text-align", "right")
//         
//     svgDomain.selectAll("#y_axis")
//       .append("text")
//         .attr("id", "y_axis_units_min")
//         .attr("y", height+6)
//         .attr("x", 8)
//         .style("text-align", "right")
//         .text("test")
//    
//   }
// 
//   return yAxis;        
// 
// }

