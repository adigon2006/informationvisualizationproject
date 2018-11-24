$(function (){

// handles the days of the week    
$('.dayoftheweek').on("click",function(){
$('.dayoftheweek').removeClass("buttonactive");
$(this).addClass("buttonactive"); 
var visualtype = $('.visualizationtype.buttonactive').attr("id");
var metrictype = $('.metricmeasure.buttonactive').attr("id");
var dayoftheweek = $(this).attr("id");
var daynight = $('.daynight.buttonactive').attr("id");
function DayOfWeek(dayofweek)
{
 switch(dayofweek)
 {
  case("0"):
  return "Monday";
  break;
  case("1"):
  return "Tuesday";
  break;
  case("2"):
  return "Wednesday";
  break;
  case("3"):
  return "Thursday";
  break;
  case("4"):
  return "Friday";
  break;
  case("5"):
  return "Saturday";
  break;
  default:
  return "Sunday";
  break;
 }
}

function SelectMetricType(metric)
{
switch(metric)
{
    case("top"):
    return "Most";
    break;
    case("least"):
    return "Least";
    break;
    default:
    return "";
    break;
}    


}
console.log(visualtype);
console.log(metrictype);
console.log(typeof daynight);
console.log(dayoftheweek);
$('#mychart').html("");
//console.log($(this).attr("id"))
$.ajax({
   url:'snippets/dayofweekhandler.php',
   METHOD:'POST',
   data:{
    visualtype:visualtype,
    metrictype:metrictype,
    dayoftheweek:dayoftheweek,
    daynight:daynight
   },
   error:function(response){

   },
   success: function(response){

console.log(response);
// Initialize chart
/// end of script for chart
mycharts('#mychart', 600);
// Chart setup
function mycharts(element, height) {
// Basic setup
    // ------------------------------

    // Define main variables
    // default variables for all
    var d3Container = d3.select(element),
        margin = {top: 10, right: 10, bottom: 90, left: 180},
        width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;


    var formatPercent = d3.format("");
    // Format data
    // var parseDate = d3.time.format("%d-%b-%y").parse,
    //     bisectDate = d3.bisector(function(d) { return d.date; }).left,
    //     formatValue = d3.format(",.0f"),
    //     formatCurrency = function(d) { return formatValue(d); }

    if(visualtype == "bar")
{
        barChart(response,metrictype)
        $('.titleofchart').html(SelectMetricType(metrictype)+" Sold Product on "+DayOfWeek(dayoftheweek));
}
// if(visualtype == "line")
// {
//         lineChart(response,metrictype)
//         $('.titleofchart').html("Most Sold Product on "+DayOfWeek(dayoftheweek));
// }
// bar chart to show most product sold
function barChart(response,sort)
{

   // Horizontal
   var y = d3.scale.ordinal()
           .rangeRoundBands([height,0],.5,.40);

       // Vertical
  var x = d3.scale.linear()
           .range([0,width]);

       // Color
  var color = d3.scale.category20c();



       // Create axes
       // ------------------------------

       // Horizontal
       var xAxis = d3.svg.axis()
           .scale(x)
           .orient("bottom");

       // Vertical
       var yAxis = d3.svg.axis()
           .scale(y)
           .orient("left")
           //.tickFormat(formatPercent);



       // Create chart
       // ------------------------------

       // Add SVG element
       var container = d3Container.append("svg");

       // Add SVG group
       var svg = container
           .attr("width", width + margin.left + margin.right)
           .attr("height", height + margin.top + margin.bottom)
           .append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


       //         // Create tooltip
       //             // ------------------------------
       //
       //
       //
       // // Load data
       // // ------------------------------
       //
       //
       //
       //myinputdata = d3.json(jsonDataName,function(error,data) {
          data = JSON.parse(response);
       // console.log(data);
       
       if(sort == "top")
       {
        data.sort(function(a, b){
    	    return a.TotalSold - b.TotalSold;
    	});  
       }
       // Create tooltip
         var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return d.Item+" ("+d.TotalSold+")";
                });

            // Initialize tooltip
            svg.call(tip);

       //
       //     // Pull out values
       //     data.forEach(function(d) {
       //         d.frequency = +d.frequency;
       //     });
       //
       //
       //
       //     // Set input domains
       //     // ------------------------------
       //
       //     // Horizontal
           y.domain(data.map(function(d) { return d.Item; }));

           // Vertical
           x.domain([0,d3.max(data, function(d) { return d.TotalSold; })]);
       //
       //
       //     //
       //     // Append chart elements
       //     //
       //
       //     // Append axes
       //     // ------------------------------
       //
           // Horizontal
           svg.append("g")
               .attr("class", "d3-axis d3-axis-horizontal d3-axis-strong")
               .attr("transform", "translate(0," + height + ")")
               .style("text-anchor", "middle")
               .text("Total Item Sold")
               .call(xAxis)
               .selectAll("text")
              .style("font-size",12);

           // Vertical
           var verticalAxis = svg.append("g")
               .attr("class", "d3-axis d3-axis-vertical d3-axis-strong")
               .style("text-anchor", "middle")
               .style("font-size",12)
               .text("Item")
               .call(yAxis)
               .selectAll("text")
              .style("font-size",12)

       
       //     // Add bars
           svg.selectAll(".d3-bar")
               .data(data)
               .enter()
               .append("rect")
                   .attr("class", "d3-bar")
                   .attr("y", function(d) { return y(d.Item); })
                   .attr("height", 20)
                   .attr("x", function(d) { return 0; })
                   .attr("width", function(d) { return x(d.TotalSold); })
                    .attr('transform', 'translate(0, '+(y.rangeBand()/2-10)+')')
                   .style("fill", function(d,i) {
                   maxvalue = d3.max(data, function(d) { return d.TotalSold; });
                   if(d.TotalSold == maxvalue)
                   {
                     return "0080CC";
                   }
                   else {
                     return color(i);
                   }

                 })
                   .on('mouseover', tip.show)
                   .on('mouseout', tip.hide);

                   svg.append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 0 - margin.left)
                  .attr("x",0 - (height / 2))
                  .attr("dy", "1em")
                  .style("text-anchor", "top")
                  .text("Items")
                  .style("font-size",14);  


                  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
        (height + margin.top + 40) + ")")
      .style("text-anchor", "middle")
      .text("Number of Items Sold")
      .style("font-size",14);


                   // svg.selectAll(".d3-bar")
                   //     .data(data)
                   //     .enter()
                   //     .append("rect")
                   //         .attr("class", "d3-bar")
                   //         .attr("x", function(d) { return x(d.letter); })
                   //         .attr("width", x.rangeBand())
                   //         .attr("y", function(d) { return y(d.frequency); })
                   //         .attr("height", function(d) { return height - y(d.frequency); })
                   //         .style("fill", function(d) { return "#58707E"; })
                   //         .on('mouseover', tip.show)
                   //         .on('mouseout', tip.hide);





         // Resize chart
         // ------------------------------

         // Call function on window resize
         $(window).on('resize', resize);

         // Call function on sidebar width change
         $('.sidebar-control').on('click', resize);

         // Resize function
         //
         // Since D3 doesn't support SVG resize by default,
         // we need to manually specify parts of the graph that need to
         // be updated on window resize
         function resize() {

             // Layout variables
             width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


             // // Layout
             // // -------------------------
             //
             // // Main svg width
             container.attr("width", width + margin.left + margin.right);

             // Width of appended group
             svg.attr("width", width + margin.left + margin.right);
             //
             //
             // // Axes
             // // -------------------------
             //
             // // Horizontal range
            x.range([0,width]);
             //
             // // Horizontal axis
             svg.selectAll('.d3-axis-horizontal').call(xAxis);
              // svg.selectAll('.d3-bar-vertical').call(yAxis);

             //
             // // Chart elements
             // // -------------------------
             //
             // // Line path
            svg.selectAll('.d3-bar').attr("width", function(d) { return x(d.TotalSold); });
         }


// load in the json data

}// end of bar chart

// line chart





}





   } 
})
// end of ajax call
})


// handles the visualization type
$('.visualizationtype').on("click",function(){
    $('.visualizationtype').removeClass("buttonactive");
    $(this).addClass("buttonactive"); 


});


// handles the metric measure
$('.metricmeasure').on("click",function(){
$('.metricmeasure').removeClass("buttonactive");
$(this).addClass("buttonactive"); 
});



//handles the day/night measure
// handles the metric measure
$('.daynight').on("click",function(){
    $('.daynight').removeClass("buttonactive");
    $(this).addClass("buttonactive"); 
});



// clear day night
$('#cleardaynight').on("click",function(){
    $('.daynight').removeClass("buttonactive");
    //$(this).addClass("buttonactive"); 
});






});