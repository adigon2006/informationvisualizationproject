$(function (){
    function DayOfWeek(dayofweek)
    {
     switch(dayofweek)
     {
      case("0"):
      return "on Monday";
      break;
      case("1"):
      return "on Tuesday";
      break;
      case("2"):
      return "on Wednesday";
      break;
      case("3"):
      return "on Thursday";
      break;
      case("4"):
      return "Friday";
      break;
      case("5"):
      return "on Saturday";
      break;
      case("6"):
      return "on Sunday";
      break;
      default:
      return "";
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

    function SelectDayNight(DayOrNight)
    {
    switch(DayOrNight)
    {
        case("day"):
        return " (Day Shift) ";
        break;
        case("night"):
        return " (Night Shift) ";
        break;
        default:
        return "";
        break;
    }
    }

// handles the days of the week    
$('.dayoftheweek').on("click",function(){
$('.dayoftheweek').removeClass("buttonactive");
$(this).addClass("buttonactive"); 
var visualtype = $('.visualizationtype.buttonactive').attr("id");
var metrictype = $('.metricmeasure.buttonactive').attr("id");
var dayoftheweek = $(this).attr("id");
var daynight = $('.daynight.buttonactive').attr("id");

//console.log(visualtype);
//console.log(metrictype);
//console.log(typeof daynight);
//console.log(dayoftheweek);
$('#mychart').html("<img style='position: absolute;top: 50%;left: 50%;' src='images/loading.gif' />");
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

//console.log(response);
// Initialize chart
/// end of script for chart
$('#mychart').html("");
mycharts('#mychart', 600);
// Chart setup
function mycharts(element, height) {
// Basic setup
    // ------------------------------

    // Define main variables
    // default variables for all
    var d3Container = d3.select(element),
        margin = {top: 10, right: 10, bottom: 100, left: 180},
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
        $('.titleofchart').html(SelectMetricType(metrictype)+" Sold Item(s) "+DayOfWeek(dayoftheweek)+ SelectDayNight(daynight) );
}
if(visualtype == "line")
{
        lineChart(response,metrictype)
        $('.titleofchart').html(SelectMetricType(metrictype)+" Sold Item(s) "+DayOfWeek(dayoftheweek)+ SelectDayNight(daynight) );

}
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


// end of line chart

function lineChart(response,metrictype)
    {
      // Construct scales
    // ------------------------------

    // Horizontal
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width]);

    // Vertical
    var y = d3.scale.linear()
        .range([height, 0]);



    // Create axes
    // ------------------------------

    // Horizontal
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
       .ticks(9)

      // .tickFormat(formatPercent);


    // Vertical
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(6);



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



    // Construct chart layout
    // ------------------------------

    // Line


    // Load data
    // ------------------------------

//myinputdata = 

//d3.json(jsonDataName,function(error,data) {

data = [JSON.parse(response)];


console.log(data);
var line = d3.svg.line()
.interpolate("monotone")
 //.attr("width", x.rangeBand())
.x(function(d) { return x(d.Item); })
.y(function(d) { return y(d.TotalSold); });
// .x(function(d){d.forEach(function(e){return x(d.date);})})
// .y(function(d){d.forEach(function(e){return y(d.close);})});



// Create tooltip
var tip = d3.tip()
   .attr('class', 'd3-tip')
   .offset([-10, 0])
   .html(function(d) {
   if(d === null)
   {
     return "No Information Available";
   }
   else if(d !== null) {
    return d.Item+" ("+d.TotalSold+")";
     }
   // return "here";
   });

// Initialize tooltip
//svg.call(tip);




      // Vertical
// extract max value from list of json object
// console.log(data.length)
var maxvalue =
   data.map(function(d){
     var mvalue = [];
     if(data.length > 1)
   {
     d.forEach(function(f,i){
     mvalue[i] = f.TotalSold;

     })
   return d3.max(mvalue);
   }

   //console.log(mvalue);
   });



////console.log(data)
if(data.length == 1)
{
 var returnedvalue = data[0].map(function(e){
 return e.Item
 });

// for single json data
x.domain(returnedvalue);
// rewrite x domain

var maxvalue2 =
data.map(function(d){
return d3.max(d,function(t){return t.TotalSold});
});
y.domain([0,maxvalue2]);
}
else if(data.length > 1)
{
//console.log(data.length);
//console.log(data);

var returnedata = data.map(function(e){
// console.log(k)
var all = []
e.forEach(function(f,i){
all[i] = f.Item;
//console.log(all[i])
})
return all
//console.log(all);
});
// console.log(returnedata);
// combines all the array
var newArr = returnedata.reduce((result,current) => {
return result.concat(current);
});


//console.log(newArr);
var set = new Set(newArr);
var filteredArray = Array.from(set);
//console.log(filteredArray.sort());
// console.log(returnedata);
x.domain(filteredArray);
y.domain([0, d3.max(maxvalue)]);
}




           //
           // Append chart elements
           //




// svg.call(tip);
            // data.map(function(d){})
            if(data.length == 1)
            {


            // Add line
            //0console.log(svg.selectAll(".tick"))
           // tick = svg.select(".d3-axis-horizontal").selectAll(".tick")
           // console.log(tick)
            //var transform = d3.transform(tick.attr("transform")).translate;
            //console.log(transform);
            var path = svg.selectAll('.d3-line')
                      .data(data)
                      .enter()
                      .append("g")
                      .attr("class","linecontainer")
                     // .attr("transform", "translate(106,0)")
                      .append("path")
                      .attr("class", "d3-line d3-line-medium")
                      //.attr("transform", "translate("+129.5/6+",0)")
                      .attr("d", line)
                      // .style("fill", "rgba(0,0,0,0.54)")
                      .style("stroke-width",2)
                      .style("stroke", "0080CC")
                      //.attr("transform", "translate("+margin.left/4.7+",0)");
                      // .attr("transform", "translate(40,0)");

                 function tweenDash() {
                var l = this.getTotalLength(),
                    i = d3.interpolateString("0," + l, l + "," + l);
                return function (t) { return i(t); };
            }
           

              circles =  svg.append("g").attr("class","circlecontainer")
                       // .attr("transform", "translate("+106+",0)")
                    .selectAll(".circle-point")
                        .data(data[0])
                        .enter();


                    circles
                    // .enter()

                    .append("circle")
                    .attr("class","circle-point")
                    .attr("r",3.0)
                    .style("stroke", "#0080CC")
                    .style("fill","#0080CC")
                    .attr("cx",function(d) { return x(d.Item); })
                    .attr("cy", function(d){return y(d.TotalSold)})

                    //.attr("transform", "translate("+margin.left/4.7+",0)");

                    svg.selectAll(".circle-point").data(data[0])
                    .on("mouseover",tip.show)
                    .on("mouseout",tip.hide)
                    .on("click",function(d){console.log(d.Item)});
                                       svg.call(tip)


            }
            // handles multiple json parameter
            else if(data.length > 1)
            {
              // add multiple line

              var path = svg.selectAll('.d3-line')
                        .data(data)
                        .enter()
                        .append("path")
                        .attr("class", "d3-line d3-line-medium")
                        .attr("d", line)
                        // .style("fill", "rgba(0,0,0,0.54)")
                        .style("stroke-width", 2)
                        .style("stroke", function(d,i) { return color(i);})
                        .attr("transform", "translate("+margin.left/4.7+",0)");

                    var mergedarray = [].concat(...data);
                      //console.log(mergedarray);
                       circles = svg.selectAll(".circle-point")
                           .data(mergedarray)
                           .enter();

                             circles
                             // .enter()
                             .append("circle")
                             .attr("class","circle-point")
                             .attr("r",3.4)
                             .style("stroke", "#4CAF50")
                             .style("fill","#4CAF50")
                             .attr("cx",function(d) { return x(d.date)})
                             .attr("cy", function(d){return y(d.close)})

                             .attr("transform", "translate("+margin.left/4.7+",0)");
                             svg.selectAll(".circle-point").data(mergedarray)
                            .on("mouseover",tip.show)
                            .on("mouseout",tip.hide)
                            .on("click",function(d){console.log(d.date)});



                           svg.selectAll(".circle-point").data(mergedarray)
                           .on("mouseover",tip.show)
                           .on("mouseout",tip.hide)
                           .on("click",function(d){console.log(d.date)});
                                              svg.call(tip)










            }


// show data tip


           // Append axes
           // ------------------------------

           // Horizontal
           svg.append("g")
               .attr("class", "d3-axis d3-axis-horizontal d3-axis-strong")
               .attr("transform", "translate(0," + height + ")")
               .call(xAxis)
               .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(90)")
                .style("text-anchor", "start");;

           // Vertical
           var verticalAxis = svg.append("g")
               .attr("class", "d3-axis d3-axis-vertical d3-axis-strong")
               .call(yAxis);





           // Add text label
           verticalAxis.append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", 10)
               .attr("dy", ".71em")
               .style("text-anchor", "end")
               .style("fill", "#999")
               .style("font-size", 12)
               // .text("Frequency")
               ;

               svg.append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", 0 - margin.left)
               .attr("x",0 - (height / 2))
               .attr("dy", "1em")
               .style("text-anchor", "top")
               .text("Number of Items Sold")
               .style("font-size",14);  


               svg.append("text")             
   .attr("transform",
         "translate(" + (width/2) + " ," + 
     (height + margin.top + 80) + ")")
   .style("text-anchor", "middle")
   .text("Items")
   .style("font-size",14);

           if(data.length == 1 )
             {
             var tick = svg.select(".d3-axis-horizontal").select(".tick");
              transformfirsttick =  tick[0][0].attributes[1].value;
              svg.select(".circlecontainer").attr("transform", transformfirsttick);
              svg.select(".linecontainer").attr("transform", transformfirsttick);
             }





   // Append tooltip
   // -------------------------






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
 //
 //
 // // Layout
 // // -------------------------
 //
 // // Main svg width
 container.attr("width", width + margin.left + margin.right);
 //
 // // Width of appended group
 svg.attr("width", width + margin.left + margin.right);
 //
 //
 // // Axes
 // // -------------------------
 //
 // // Horizontal range
 x.rangeRoundBands([0, width]);
 //
 // // Horizontal axis
 svg.selectAll('.d3-axis-horizontal').call(xAxis);
 //
 //
 // // Chart elements
 // // -------------------------
 //
 // // Line path
 svg.selectAll('.d3-line').attr("d", line);



   svg.selectAll(".circle-point")
   .attr("cx",function(d) { return x(d.date);})
   .attr("cy", function(d){return y(d.close)});

   if(data.length == 1 )
 {
 var tick = svg.select(".d3-axis-horizontal").select(".tick");
  transformfirsttick =  tick[0][0].attributes[1].value;
  //transformfirsttick = "translate(31.5,0)"
  console.log(transformfirsttick);
  svg.select(".circlecontainer").attr("transform", transformfirsttick);
  svg.select(".linecontainer").attr("transform", transformfirsttick);
 }


 //
 // // Crosshair
 // svg.selectAll('.d3-crosshair-overlay').attr("width", width);

}

//});
// end of calling data


}

// end of line chart


}





   } 
})
// end of ajax call
})


// handles the visualization type
$('.visualizationtype').on("click",function(){
$('.visualizationtype').removeClass("buttonactive");
$(this).addClass("buttonactive"); 
var visualtype = $(this).attr("id");
var metrictype = $('.metricmeasure.buttonactive').attr("id");
var dayoftheweek = $('.dayoftheweek.buttonactive').attr("id");
var daynight = $('.daynight.buttonactive').attr("id");
// console.log(visualtype);
// console.log(metrictype);
// console.log(dayoftheweek);
// console.log(daynight);
$('#mychart').html("<img style='position: absolute;top: 50%;left: 50%;' src='images/loading.gif' />");
$.ajax({
    url:'snippets/visualizationtypehandler.php',
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
  //console.log(response)
  $('#mychart').html("");
      mycharts('#mychart', 600);
// Chart setup
function mycharts(element, height) {
// Basic setup
    // ------------------------------

    // Define main variables
    // default variables for all
    var d3Container = d3.select(element),
        margin = {top: 10, right: 10, bottom: 100, left: 180},
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
        $('.titleofchart').html(SelectMetricType(metrictype)+" Sold Item(s) "+DayOfWeek(dayoftheweek)+ SelectDayNight(daynight) );
}
if(visualtype == "line")
{
        lineChart(response,metrictype)
        $('.titleofchart').html(SelectMetricType(metrictype)+" Sold Item(s) "+DayOfWeek(dayoftheweek)+ SelectDayNight(daynight) );

}
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


// end of line chart

function lineChart(response,metrictype)
    {
      // Construct scales
    // ------------------------------

    // Horizontal
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width]);

    // Vertical
    var y = d3.scale.linear()
        .range([height, 0]);



    // Create axes
    // ------------------------------

    // Horizontal
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
       .ticks(9)

      // .tickFormat(formatPercent);


    // Vertical
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(6);



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



    // Construct chart layout
    // ------------------------------

    // Line


    // Load data
    // ------------------------------

//myinputdata = 

//d3.json(jsonDataName,function(error,data) {

data = [JSON.parse(response)];


console.log(data);
var line = d3.svg.line()
.interpolate("monotone")
 //.attr("width", x.rangeBand())
.x(function(d) { return x(d.Item); })
.y(function(d) { return y(d.TotalSold); });
// .x(function(d){d.forEach(function(e){return x(d.date);})})
// .y(function(d){d.forEach(function(e){return y(d.close);})});



// Create tooltip
var tip = d3.tip()
   .attr('class', 'd3-tip')
   .offset([-10, 0])
   .html(function(d) {
   if(d === null)
   {
     return "No Information Available";
   }
   else if(d !== null) {
    return d.Item+" ("+d.TotalSold+")";
     }
   // return "here";
   });

// Initialize tooltip
//svg.call(tip);




      // Vertical
// extract max value from list of json object
// console.log(data.length)
var maxvalue =
   data.map(function(d){
     var mvalue = [];
     if(data.length > 1)
   {
     d.forEach(function(f,i){
     mvalue[i] = f.TotalSold;

     })
   return d3.max(mvalue);
   }

   //console.log(mvalue);
   });



////console.log(data)
if(data.length == 1)
{
 var returnedvalue = data[0].map(function(e){
 return e.Item
 });

// for single json data
x.domain(returnedvalue);
// rewrite x domain

var maxvalue2 =
data.map(function(d){
return d3.max(d,function(t){return t.TotalSold});
});
y.domain([0,maxvalue2]);
}
else if(data.length > 1)
{
//console.log(data.length);
//console.log(data);

var returnedata = data.map(function(e){
// console.log(k)
var all = []
e.forEach(function(f,i){
all[i] = f.Item;
//console.log(all[i])
})
return all
//console.log(all);
});
// console.log(returnedata);
// combines all the array
var newArr = returnedata.reduce((result,current) => {
return result.concat(current);
});


//console.log(newArr);
var set = new Set(newArr);
var filteredArray = Array.from(set);
//console.log(filteredArray.sort());
// console.log(returnedata);
x.domain(filteredArray);
y.domain([0, d3.max(maxvalue)]);
}




           //
           // Append chart elements
           //




// svg.call(tip);
            // data.map(function(d){})
            if(data.length == 1)
            {


            // Add line
            //0console.log(svg.selectAll(".tick"))
           // tick = svg.select(".d3-axis-horizontal").selectAll(".tick")
           // console.log(tick)
            //var transform = d3.transform(tick.attr("transform")).translate;
            //console.log(transform);
            var path = svg.selectAll('.d3-line')
                      .data(data)
                      .enter()
                      .append("g")
                      .attr("class","linecontainer")
                     // .attr("transform", "translate(106,0)")
                      .append("path")
                      .attr("class", "d3-line d3-line-medium")
                      //.attr("transform", "translate("+129.5/6+",0)")
                      .attr("d", line)
                      // .style("fill", "rgba(0,0,0,0.54)")
                      .style("stroke-width",2)
                      .style("stroke", "0080CC")
                      //.attr("transform", "translate("+margin.left/4.7+",0)");
                      // .attr("transform", "translate(40,0)");

                 function tweenDash() {
                var l = this.getTotalLength(),
                    i = d3.interpolateString("0," + l, l + "," + l);
                return function (t) { return i(t); };
            }
           

              circles =  svg.append("g").attr("class","circlecontainer")
                       // .attr("transform", "translate("+106+",0)")
                    .selectAll(".circle-point")
                        .data(data[0])
                        .enter();


                    circles
                    // .enter()

                    .append("circle")
                    .attr("class","circle-point")
                    .attr("r",3.0)
                    .style("stroke", "#0080CC")
                    .style("fill","#0080CC")
                    .attr("cx",function(d) { return x(d.Item); })
                    .attr("cy", function(d){return y(d.TotalSold)})

                    //.attr("transform", "translate("+margin.left/4.7+",0)");

                    svg.selectAll(".circle-point").data(data[0])
                    .on("mouseover",tip.show)
                    .on("mouseout",tip.hide)
                    .on("click",function(d){console.log(d.Item)});
                                       svg.call(tip)


            }
            // handles multiple json parameter
            else if(data.length > 1)
            {
              // add multiple line

              var path = svg.selectAll('.d3-line')
                        .data(data)
                        .enter()
                        .append("path")
                        .attr("class", "d3-line d3-line-medium")
                        .attr("d", line)
                        // .style("fill", "rgba(0,0,0,0.54)")
                        .style("stroke-width", 2)
                        .style("stroke", function(d,i) { return color(i);})
                        .attr("transform", "translate("+margin.left/4.7+",0)");

                    var mergedarray = [].concat(...data);
                      //console.log(mergedarray);
                       circles = svg.selectAll(".circle-point")
                           .data(mergedarray)
                           .enter();

                             circles
                             // .enter()
                             .append("circle")
                             .attr("class","circle-point")
                             .attr("r",3.4)
                             .style("stroke", "#4CAF50")
                             .style("fill","#4CAF50")
                             .attr("cx",function(d) { return x(d.date)})
                             .attr("cy", function(d){return y(d.close)})

                             .attr("transform", "translate("+margin.left/4.7+",0)");
                             svg.selectAll(".circle-point").data(mergedarray)
                            .on("mouseover",tip.show)
                            .on("mouseout",tip.hide)
                            .on("click",function(d){console.log(d.date)});



                           svg.selectAll(".circle-point").data(mergedarray)
                           .on("mouseover",tip.show)
                           .on("mouseout",tip.hide)
                           .on("click",function(d){console.log(d.date)});
                                              svg.call(tip)










            }


// show data tip


           // Append axes
           // ------------------------------

           // Horizontal
           svg.append("g")
               .attr("class", "d3-axis d3-axis-horizontal d3-axis-strong")
               .attr("transform", "translate(0," + height + ")")
               .call(xAxis)
               .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(90)")
                .style("text-anchor", "start");;

           // Vertical
           var verticalAxis = svg.append("g")
               .attr("class", "d3-axis d3-axis-vertical d3-axis-strong")
               .call(yAxis);





           // Add text label
           verticalAxis.append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", 10)
               .attr("dy", ".71em")
               .style("text-anchor", "end")
               .style("fill", "#999")
               .style("font-size", 12)
               // .text("Frequency")
               ;

               svg.append("text")
               .attr("transform", "rotate(-90)")
               .attr("y", 0 - margin.left)
               .attr("x",0 - (height / 2))
               .attr("dy", "1em")
               .style("text-anchor", "top")
               .text("Number of Items Sold")
               .style("font-size",14);  


               svg.append("text")             
   .attr("transform",
         "translate(" + (width/2) + " ," + 
     (height + margin.top + 80) + ")")
   .style("text-anchor", "middle")
   .text("Items")
   .style("font-size",14);

           if(data.length == 1 )
             {
             var tick = svg.select(".d3-axis-horizontal").select(".tick");
              transformfirsttick =  tick[0][0].attributes[1].value;
              svg.select(".circlecontainer").attr("transform", transformfirsttick);
              svg.select(".linecontainer").attr("transform", transformfirsttick);
             }





   // Append tooltip
   // -------------------------






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
 //
 //
 // // Layout
 // // -------------------------
 //
 // // Main svg width
 container.attr("width", width + margin.left + margin.right);
 //
 // // Width of appended group
 svg.attr("width", width + margin.left + margin.right);
 //
 //
 // // Axes
 // // -------------------------
 //
 // // Horizontal range
 x.rangeRoundBands([0, width]);
 //
 // // Horizontal axis
 svg.selectAll('.d3-axis-horizontal').call(xAxis);
 //
 //
 // // Chart elements
 // // -------------------------
 //
 // // Line path
 svg.selectAll('.d3-line').attr("d", line);



   svg.selectAll(".circle-point")
   .attr("cx",function(d) { return x(d.date);})
   .attr("cy", function(d){return y(d.close)});

   if(data.length == 1 )
 {
 var tick = svg.select(".d3-axis-horizontal").select(".tick");
  transformfirsttick =  tick[0][0].attributes[1].value;
  //transformfirsttick = "translate(31.5,0)"
  console.log(transformfirsttick);
  svg.select(".circlecontainer").attr("transform", transformfirsttick);
  svg.select(".linecontainer").attr("transform", transformfirsttick);
 }


 //
 // // Crosshair
 // svg.selectAll('.d3-crosshair-overlay').attr("width", width);

}

//});
// end of calling data


}

// end of line chart


}
    }
});
// end of interactivity

});


// handles the metric measure
$('.metricmeasure').on("click",function(){
$('.metricmeasure').removeClass("buttonactive");
$(this).addClass("buttonactive"); 

// handler for the metric measure
var visualtype = $('.visualizationtype.buttonactive').attr("id");
var metrictype = $(this).attr("id");
var dayoftheweek = $('.dayoftheweek.buttonactive').attr("id");
var daynight = $('.daynight.buttonactive').attr("id");

$('#mychart').html("<img style='position: absolute;top: 50%;left: 50%;' src='images/loading.gif' />");

$.ajax({
    url:'snippets/metrictypehandler.php',
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
        //console.log(response);
        $('#mychart').html("");
        mycharts('#mychart', 600);

function mycharts(element, height) {
            // Basic setup
                // ------------------------------
            
                // Define main variables
                // default variables for all
                var d3Container = d3.select(element),
                    margin = {top: 10, right: 10, bottom: 100, left: 180},
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
                    $('.titleofchart').html(SelectMetricType(metrictype)+" Sold Item(s) "+DayOfWeek(dayoftheweek)+ SelectDayNight(daynight) );
            }
            if(visualtype == "line")
            {
                    lineChart(response,metrictype)
                    $('.titleofchart').html(SelectMetricType(metrictype)+" Sold Item(s) "+DayOfWeek(dayoftheweek)+ SelectDayNight(daynight) );
            
            }
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
            
            
            // end of line chart
            
            function lineChart(response,metrictype)
                {
                  // Construct scales
                // ------------------------------
            
                // Horizontal
                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width]);
            
                // Vertical
                var y = d3.scale.linear()
                    .range([height, 0]);
            
            
            
                // Create axes
                // ------------------------------
            
                // Horizontal
                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                   .ticks(9)
            
                  // .tickFormat(formatPercent);
            
            
                // Vertical
                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(6);
            
            
            
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
            
            
            
                // Construct chart layout
                // ------------------------------
            
                // Line
            
            
                // Load data
                // ------------------------------
            
            //myinputdata = 
            
            //d3.json(jsonDataName,function(error,data) {
            
            data = [JSON.parse(response)];
            
            
            console.log(data);
            var line = d3.svg.line()
            .interpolate("monotone")
             //.attr("width", x.rangeBand())
            .x(function(d) { return x(d.Item); })
            .y(function(d) { return y(d.TotalSold); });
            // .x(function(d){d.forEach(function(e){return x(d.date);})})
            // .y(function(d){d.forEach(function(e){return y(d.close);})});
            
            
            
            // Create tooltip
            var tip = d3.tip()
               .attr('class', 'd3-tip')
               .offset([-10, 0])
               .html(function(d) {
               if(d === null)
               {
                 return "No Information Available";
               }
               else if(d !== null) {
                return d.Item+" ("+d.TotalSold+")";
                 }
               // return "here";
               });
            
            // Initialize tooltip
            //svg.call(tip);
            
            
            
            
                  // Vertical
            // extract max value from list of json object
            // console.log(data.length)
            var maxvalue =
               data.map(function(d){
                 var mvalue = [];
                 if(data.length > 1)
               {
                 d.forEach(function(f,i){
                 mvalue[i] = f.TotalSold;
            
                 })
               return d3.max(mvalue);
               }
            
               //console.log(mvalue);
               });
            
            
            
            ////console.log(data)
            if(data.length == 1)
            {
             var returnedvalue = data[0].map(function(e){
             return e.Item
             });
            
            // for single json data
            x.domain(returnedvalue);
            // rewrite x domain
            
            var maxvalue2 =
            data.map(function(d){
            return d3.max(d,function(t){return t.TotalSold});
            });
            y.domain([0,maxvalue2]);
            }
            else if(data.length > 1)
            {
            //console.log(data.length);
            //console.log(data);
            
            var returnedata = data.map(function(e){
            // console.log(k)
            var all = []
            e.forEach(function(f,i){
            all[i] = f.Item;
            //console.log(all[i])
            })
            return all
            //console.log(all);
            });
            // console.log(returnedata);
            // combines all the array
            var newArr = returnedata.reduce((result,current) => {
            return result.concat(current);
            });
            
            
            //console.log(newArr);
            var set = new Set(newArr);
            var filteredArray = Array.from(set);
            //console.log(filteredArray.sort());
            // console.log(returnedata);
            x.domain(filteredArray);
            y.domain([0, d3.max(maxvalue)]);
            }
            
            
            
            
                       //
                       // Append chart elements
                       //
            
            
            
            
            // svg.call(tip);
                        // data.map(function(d){})
                        if(data.length == 1)
                        {
            
            
                        // Add line
                        //0console.log(svg.selectAll(".tick"))
                       // tick = svg.select(".d3-axis-horizontal").selectAll(".tick")
                       // console.log(tick)
                        //var transform = d3.transform(tick.attr("transform")).translate;
                        //console.log(transform);
                        var path = svg.selectAll('.d3-line')
                                  .data(data)
                                  .enter()
                                  .append("g")
                                  .attr("class","linecontainer")
                                 // .attr("transform", "translate(106,0)")
                                  .append("path")
                                  .attr("class", "d3-line d3-line-medium")
                                  //.attr("transform", "translate("+129.5/6+",0)")
                                  .attr("d", line)
                                  // .style("fill", "rgba(0,0,0,0.54)")
                                  .style("stroke-width",2)
                                  .style("stroke", "0080CC")
                                  //.attr("transform", "translate("+margin.left/4.7+",0)");
                                  // .attr("transform", "translate(40,0)");
            
                             function tweenDash() {
                            var l = this.getTotalLength(),
                                i = d3.interpolateString("0," + l, l + "," + l);
                            return function (t) { return i(t); };
                        }
                       
            
                          circles =  svg.append("g").attr("class","circlecontainer")
                                   // .attr("transform", "translate("+106+",0)")
                                .selectAll(".circle-point")
                                    .data(data[0])
                                    .enter();
            
            
                                circles
                                // .enter()
            
                                .append("circle")
                                .attr("class","circle-point")
                                .attr("r",3.0)
                                .style("stroke", "#0080CC")
                                .style("fill","#0080CC")
                                .attr("cx",function(d) { return x(d.Item); })
                                .attr("cy", function(d){return y(d.TotalSold)})
            
                                //.attr("transform", "translate("+margin.left/4.7+",0)");
            
                                svg.selectAll(".circle-point").data(data[0])
                                .on("mouseover",tip.show)
                                .on("mouseout",tip.hide)
                                .on("click",function(d){console.log(d.Item)});
                                                   svg.call(tip)
            
            
                        }
                        // handles multiple json parameter
                        else if(data.length > 1)
                        {
                          // add multiple line
            
                          var path = svg.selectAll('.d3-line')
                                    .data(data)
                                    .enter()
                                    .append("path")
                                    .attr("class", "d3-line d3-line-medium")
                                    .attr("d", line)
                                    // .style("fill", "rgba(0,0,0,0.54)")
                                    .style("stroke-width", 2)
                                    .style("stroke", function(d,i) { return color(i);})
                                    .attr("transform", "translate("+margin.left/4.7+",0)");
            
                                var mergedarray = [].concat(...data);
                                  //console.log(mergedarray);
                                   circles = svg.selectAll(".circle-point")
                                       .data(mergedarray)
                                       .enter();
            
                                         circles
                                         // .enter()
                                         .append("circle")
                                         .attr("class","circle-point")
                                         .attr("r",3.4)
                                         .style("stroke", "#4CAF50")
                                         .style("fill","#4CAF50")
                                         .attr("cx",function(d) { return x(d.date)})
                                         .attr("cy", function(d){return y(d.close)})
            
                                         .attr("transform", "translate("+margin.left/4.7+",0)");
                                         svg.selectAll(".circle-point").data(mergedarray)
                                        .on("mouseover",tip.show)
                                        .on("mouseout",tip.hide)
                                        .on("click",function(d){console.log(d.date)});
            
            
            
                                       svg.selectAll(".circle-point").data(mergedarray)
                                       .on("mouseover",tip.show)
                                       .on("mouseout",tip.hide)
                                       .on("click",function(d){console.log(d.date)});
                                                          svg.call(tip)
            
            
            
            
            
            
            
            
            
            
                        }
            
            
            // show data tip
            
            
                       // Append axes
                       // ------------------------------
            
                       // Horizontal
                       svg.append("g")
                           .attr("class", "d3-axis d3-axis-horizontal d3-axis-strong")
                           .attr("transform", "translate(0," + height + ")")
                           .call(xAxis)
                           .selectAll("text")
                            .attr("y", 0)
                            .attr("x", 9)
                            .attr("dy", ".35em")
                            .attr("transform", "rotate(90)")
                            .style("text-anchor", "start");;
            
                       // Vertical
                       var verticalAxis = svg.append("g")
                           .attr("class", "d3-axis d3-axis-vertical d3-axis-strong")
                           .call(yAxis);
            
            
            
            
            
                       // Add text label
                       verticalAxis.append("text")
                           .attr("transform", "rotate(-90)")
                           .attr("y", 10)
                           .attr("dy", ".71em")
                           .style("text-anchor", "end")
                           .style("fill", "#999")
                           .style("font-size", 12)
                           // .text("Frequency")
                           ;
            
                           svg.append("text")
                           .attr("transform", "rotate(-90)")
                           .attr("y", 0 - margin.left)
                           .attr("x",0 - (height / 2))
                           .attr("dy", "1em")
                           .style("text-anchor", "top")
                           .text("Number of Items Sold")
                           .style("font-size",14);  
            
            
                           svg.append("text")             
               .attr("transform",
                     "translate(" + (width/2) + " ," + 
                 (height + margin.top + 80) + ")")
               .style("text-anchor", "middle")
               .text("Items")
               .style("font-size",14);
            
                       if(data.length == 1 )
                         {
                         var tick = svg.select(".d3-axis-horizontal").select(".tick");
                          transformfirsttick =  tick[0][0].attributes[1].value;
                          svg.select(".circlecontainer").attr("transform", transformfirsttick);
                          svg.select(".linecontainer").attr("transform", transformfirsttick);
                         }
            
            
            
            
            
               // Append tooltip
               // -------------------------
            
            
            
            
            
            
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
             //
             //
             // // Layout
             // // -------------------------
             //
             // // Main svg width
             container.attr("width", width + margin.left + margin.right);
             //
             // // Width of appended group
             svg.attr("width", width + margin.left + margin.right);
             //
             //
             // // Axes
             // // -------------------------
             //
             // // Horizontal range
             x.rangeRoundBands([0, width]);
             //
             // // Horizontal axis
             svg.selectAll('.d3-axis-horizontal').call(xAxis);
             //
             //
             // // Chart elements
             // // -------------------------
             //
             // // Line path
             svg.selectAll('.d3-line').attr("d", line);
            
            
            
               svg.selectAll(".circle-point")
               .attr("cx",function(d) { return x(d.date);})
               .attr("cy", function(d){return y(d.close)});
            
               if(data.length == 1 )
             {
             var tick = svg.select(".d3-axis-horizontal").select(".tick");
              transformfirsttick =  tick[0][0].attributes[1].value;
              //transformfirsttick = "translate(31.5,0)"
              console.log(transformfirsttick);
              svg.select(".circlecontainer").attr("transform", transformfirsttick);
              svg.select(".linecontainer").attr("transform", transformfirsttick);
             }
            
            
             //
             // // Crosshair
             // svg.selectAll('.d3-crosshair-overlay').attr("width", width);
            
            }
            
            //});
            // end of calling data
            
            
            }
            
            // end of line chart
            
            
            }
    }
});

});



//handles the day/night measure
// handles the metric measure
$('.daynight').on("click",function(){
    $('.daynight').removeClass("buttonactive");
    $(this).addClass("buttonactive"); 

var visualtype = $('.visualizationtype.buttonactive').attr("id");
var metrictype = $('.metricmeasure.buttonactive').attr("id");
var dayoftheweek = $('.dayoftheweek.buttonactive').attr("id");
var daynight = $(this).attr("id");

$('#mychart').html("<img style='position: absolute;top: 50%;left: 50%;' src='images/loading.gif' />");



$.ajax({
    url:'snippets/daynight.php',
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
        $('#mychart').html("");
       // console.log(response)
        mycharts('#mychart', 600);
        // Chart setup
        function mycharts(element, height) {
        // Basic setup
            // ------------------------------
        
            // Define main variables
            // default variables for all
            var d3Container = d3.select(element),
                margin = {top: 10, right: 10, bottom: 100, left: 180},
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
                $('.titleofchart').html(SelectMetricType(metrictype)+" Sold Item(s) "+DayOfWeek(dayoftheweek)+ SelectDayNight(daynight) );
        }
        if(visualtype == "line")
        {
        lineChart(response,metrictype)
        $('.titleofchart').html(SelectMetricType(metrictype)+" Sold Item(s) "+DayOfWeek(dayoftheweek)+ SelectDayNight(daynight) );
        
        }
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
        
        
        // end of line chart
        
        function lineChart(response,metrictype)
            {
              // Construct scales
            // ------------------------------
        
            // Horizontal
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width]);
        
            // Vertical
            var y = d3.scale.linear()
                .range([height, 0]);
        
        
        
            // Create axes
            // ------------------------------
        
            // Horizontal
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
               .ticks(9)
        
              // .tickFormat(formatPercent);
        
        
            // Vertical
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(6);
        
        
        
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
        
        
        
            // Construct chart layout
            // ------------------------------
        
            // Line
        
        
            // Load data
            // ------------------------------
        
        //myinputdata = 
        
        //d3.json(jsonDataName,function(error,data) {
        
        data = [JSON.parse(response)];
        
        
        console.log(data);
        var line = d3.svg.line()
        .interpolate("monotone")
         //.attr("width", x.rangeBand())
        .x(function(d) { return x(d.Item); })
        .y(function(d) { return y(d.TotalSold); });
        // .x(function(d){d.forEach(function(e){return x(d.date);})})
        // .y(function(d){d.forEach(function(e){return y(d.close);})});
        
        
        
        // Create tooltip
        var tip = d3.tip()
           .attr('class', 'd3-tip')
           .offset([-10, 0])
           .html(function(d) {
           if(d === null)
           {
             return "No Information Available";
           }
           else if(d !== null) {
            return d.Item+" ("+d.TotalSold+")";
             }
           // return "here";
           });
        
        // Initialize tooltip
        //svg.call(tip);
        
        
        
        
              // Vertical
        // extract max value from list of json object
        // console.log(data.length)
        var maxvalue =
           data.map(function(d){
             var mvalue = [];
             if(data.length > 1)
           {
             d.forEach(function(f,i){
             mvalue[i] = f.TotalSold;
        
             })
           return d3.max(mvalue);
           }
        
           //console.log(mvalue);
           });
        
        
        
        ////console.log(data)
        if(data.length == 1)
        {
         var returnedvalue = data[0].map(function(e){
         return e.Item
         });
        
        // for single json data
        x.domain(returnedvalue);
        // rewrite x domain
        
        var maxvalue2 =
        data.map(function(d){
        return d3.max(d,function(t){return t.TotalSold});
        });
        y.domain([0,maxvalue2]);
        }
        else if(data.length > 1)
        {
        //console.log(data.length);
        //console.log(data);
        
        var returnedata = data.map(function(e){
        // console.log(k)
        var all = []
        e.forEach(function(f,i){
        all[i] = f.Item;
        //console.log(all[i])
        })
        return all
        //console.log(all);
        });
        // console.log(returnedata);
        // combines all the array
        var newArr = returnedata.reduce((result,current) => {
        return result.concat(current);
        });
        
        
        //console.log(newArr);
        var set = new Set(newArr);
        var filteredArray = Array.from(set);
        //console.log(filteredArray.sort());
        // console.log(returnedata);
        x.domain(filteredArray);
        y.domain([0, d3.max(maxvalue)]);
        }
        
        
        
        
                   //
                   // Append chart elements
                   //
        
        
        
        
        // svg.call(tip);
                    // data.map(function(d){})
                    if(data.length == 1)
                    {
        
        
                    // Add line
                    //0console.log(svg.selectAll(".tick"))
                   // tick = svg.select(".d3-axis-horizontal").selectAll(".tick")
                   // console.log(tick)
                    //var transform = d3.transform(tick.attr("transform")).translate;
                    //console.log(transform);
                    var path = svg.selectAll('.d3-line')
                              .data(data)
                              .enter()
                              .append("g")
                              .attr("class","linecontainer")
                             // .attr("transform", "translate(106,0)")
                              .append("path")
                              .attr("class", "d3-line d3-line-medium")
                              //.attr("transform", "translate("+129.5/6+",0)")
                              .attr("d", line)
                              // .style("fill", "rgba(0,0,0,0.54)")
                              .style("stroke-width",2)
                              .style("stroke", "0080CC")
                              //.attr("transform", "translate("+margin.left/4.7+",0)");
                              // .attr("transform", "translate(40,0)");
        
                         function tweenDash() {
                        var l = this.getTotalLength(),
                            i = d3.interpolateString("0," + l, l + "," + l);
                        return function (t) { return i(t); };
                    }
                   
        
                      circles =  svg.append("g").attr("class","circlecontainer")
                               // .attr("transform", "translate("+106+",0)")
                            .selectAll(".circle-point")
                                .data(data[0])
                                .enter();
        
        
                            circles
                            // .enter()
        
                            .append("circle")
                            .attr("class","circle-point")
                            .attr("r",3.0)
                            .style("stroke", "#0080CC")
                            .style("fill","#0080CC")
                            .attr("cx",function(d) { return x(d.Item); })
                            .attr("cy", function(d){return y(d.TotalSold)})
        
                            //.attr("transform", "translate("+margin.left/4.7+",0)");
        
                            svg.selectAll(".circle-point").data(data[0])
                            .on("mouseover",tip.show)
                            .on("mouseout",tip.hide)
                            .on("click",function(d){console.log(d.Item)});
                                               svg.call(tip)
        
        
                    }
                    // handles multiple json parameter
                    else if(data.length > 1)
                    {
                      // add multiple line
        
                      var path = svg.selectAll('.d3-line')
                                .data(data)
                                .enter()
                                .append("path")
                                .attr("class", "d3-line d3-line-medium")
                                .attr("d", line)
                                // .style("fill", "rgba(0,0,0,0.54)")
                                .style("stroke-width", 2)
                                .style("stroke", function(d,i) { return color(i);})
                                .attr("transform", "translate("+margin.left/4.7+",0)");
        
                            var mergedarray = [].concat(...data);
                              //console.log(mergedarray);
                               circles = svg.selectAll(".circle-point")
                                   .data(mergedarray)
                                   .enter();
        
                                     circles
                                     // .enter()
                                     .append("circle")
                                     .attr("class","circle-point")
                                     .attr("r",3.4)
                                     .style("stroke", "#4CAF50")
                                     .style("fill","#4CAF50")
                                     .attr("cx",function(d) { return x(d.date)})
                                     .attr("cy", function(d){return y(d.close)})
        
                                     .attr("transform", "translate("+margin.left/4.7+",0)");
                                     svg.selectAll(".circle-point").data(mergedarray)
                                    .on("mouseover",tip.show)
                                    .on("mouseout",tip.hide)
                                    .on("click",function(d){console.log(d.date)});
        
        
        
                                   svg.selectAll(".circle-point").data(mergedarray)
                                   .on("mouseover",tip.show)
                                   .on("mouseout",tip.hide)
                                   .on("click",function(d){console.log(d.date)});
                                                      svg.call(tip)
        
        
        
        
        
        
        
        
        
        
                    }
        
        
        // show data tip
        
        
                   // Append axes
                   // ------------------------------
        
                   // Horizontal
                   svg.append("g")
                       .attr("class", "d3-axis d3-axis-horizontal d3-axis-strong")
                       .attr("transform", "translate(0," + height + ")")
                       .call(xAxis)
                       .selectAll("text")
                        .attr("y", 0)
                        .attr("x", 9)
                        .attr("dy", ".35em")
                        .attr("transform", "rotate(90)")
                        .style("text-anchor", "start");;
        
                   // Vertical
                   var verticalAxis = svg.append("g")
                       .attr("class", "d3-axis d3-axis-vertical d3-axis-strong")
                       .call(yAxis);
        
        
        
        
        
                   // Add text label
                   verticalAxis.append("text")
                       .attr("transform", "rotate(-90)")
                       .attr("y", 10)
                       .attr("dy", ".71em")
                       .style("text-anchor", "end")
                       .style("fill", "#999")
                       .style("font-size", 12)
                       // .text("Frequency")
                       ;
        
                       svg.append("text")
                       .attr("transform", "rotate(-90)")
                       .attr("y", 0 - margin.left)
                       .attr("x",0 - (height / 2))
                       .attr("dy", "1em")
                       .style("text-anchor", "top")
                       .text("Number of Items Sold")
                       .style("font-size",14);  
        
        
                       svg.append("text")             
           .attr("transform",
                 "translate(" + (width/2) + " ," + 
             (height + margin.top + 80) + ")")
           .style("text-anchor", "middle")
           .text("Items")
           .style("font-size",14);
        
                   if(data.length == 1 )
                     {
                     var tick = svg.select(".d3-axis-horizontal").select(".tick");
                      transformfirsttick =  tick[0][0].attributes[1].value;
                      svg.select(".circlecontainer").attr("transform", transformfirsttick);
                      svg.select(".linecontainer").attr("transform", transformfirsttick);
                     }
        
        
        
        
        
           // Append tooltip
           // -------------------------
        
        
        
        
        
        
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
         //
         //
         // // Layout
         // // -------------------------
         //
         // // Main svg width
         container.attr("width", width + margin.left + margin.right);
         //
         // // Width of appended group
         svg.attr("width", width + margin.left + margin.right);
         //
         //
         // // Axes
         // // -------------------------
         //
         // // Horizontal range
         x.rangeRoundBands([0, width]);
         //
         // // Horizontal axis
         svg.selectAll('.d3-axis-horizontal').call(xAxis);
         //
         //
         // // Chart elements
         // // -------------------------
         //
         // // Line path
         svg.selectAll('.d3-line').attr("d", line);
        
        
        
           svg.selectAll(".circle-point")
           .attr("cx",function(d) { return x(d.date);})
           .attr("cy", function(d){return y(d.close)});
        
           if(data.length == 1 )
         {
         var tick = svg.select(".d3-axis-horizontal").select(".tick");
          transformfirsttick =  tick[0][0].attributes[1].value;
          //transformfirsttick = "translate(31.5,0)"
          console.log(transformfirsttick);
          svg.select(".circlecontainer").attr("transform", transformfirsttick);
          svg.select(".linecontainer").attr("transform", transformfirsttick);
         }
        
        
         //
         // // Crosshair
         // svg.selectAll('.d3-crosshair-overlay').attr("width", width);
        
        }
        
        //});
        // end of calling data
        
        
        }
        
        // end of line chart
        
        
        }
    }

});


});



// clear day night
$('#cleardaynight').on("click",function(){
    $('.daynight').removeClass("buttonactive");
    //$(this).addClass("buttonactive"); 

    // handler to handle the event of the clear button 
});

$('#cleardayofweek').on("click",function(){
    $('.dayoftheweek').removeClass("buttonactive");
    //$(this).addClass("buttonactive"); 
});






});