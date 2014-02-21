function setXaxis(data, svgDomain, width, height, ticks, label, update){

  var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          //.ticks(4)
          .tickValues(ticks)
          //.tickFormat(d3.time.format("%H"));

  if(!update){
    svgDomain.append("g")
        .attr("class", "x axis")
        .attr("id", "x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
          .attr("id", "x_axis_label")
          .attr("x", 16)
          .attr("y", 6)
          .attr("dy", "1em")
          .style("text-align", "center")
          .text("time (hours)")
  };
                
  return xAxis;
  
  
          

}

function setYaxis(data, svgDomain, width, height, ticks, label, update){
  
  
 var yAxis = d3.svg.axis()
          .scale(y)
          .orient("right")
          .ticks(ticks);
  
  if(!update){
    svgDomain.append("g")
        .attr("class", "y axis")
        .attr("id", "y_axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis)    
      .append("text")
        .attr("id", "y_axis_label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-38em")
        .style("text-anchor", "end")
        .style("text-align", "center")
        
    svgDomain.selectAll("#y_axis")
      .append("text")
        .attr("id", "y_axis_units")
        .attr("y", 0)
        .attr("x", 8)
        .style("text-align", "right")

        
  }

       
  return yAxis;        

}