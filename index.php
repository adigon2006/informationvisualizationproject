<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TEAM B INFORMATION VISUALIZATIONS</title>
  <!-- start of bootsrap -->
 <link href="https://fonts.googleapis.com/css?family=Open+Sans:600,700" rel="stylesheet">
 <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-grid.css"/>
 <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.css"/>
 <link rel="stylesheet" href="assets/fonts/fontawesome/css/fontawesome-all.css" />
 <link rel="stylesheet" href="assets/fonts/iconic/css/open-iconic.css" />
 <link rel="stylesheet" href="assets/vendors/bootstrap-daterangepicker/daterangepicker.css" />
 <link rel="stylesheet" href="assets/css/table.css" />
 <link rel="stylesheet" href="assets/vendors/DataTables/dataTables.bootstrap4.min.css" />

<link rel="stylesheet" href="assets/css/daterangepicker.css" />
<link rel="stylesheet" href="assets/css/style.css" />

<link rel="stylesheet" href="assets/css/toastr.css">
<!--end of bootsrap -->
<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/popper.min.js" ></script>
</head>
<body>

  <nav class="navbar navbar-inverse bg-primary">
    <div class="container-fluid">
     
  
  <div class="navbar-header  col-md-12">
    <h1 class="text-center" style="color:#ffffff;">BAKERY VISUALIZATIONS</h1>
  </div>
 
  <div class="col-md-12 bg-dark d-md-block d-sm-block d-xs-block d-lg-none d-xl-none p0 mt20">
     
  </div>
    </nav>
<div class="container">
<div class="row bottom-border pb20">
<div class="col-md-6 paddi">
<p class="mt5 mb0">Metrics Measure 
<!-- <select id="metricmeasure"><option value="">Select One</option><option value="top">Top 15 Items Sold</option><option value="least">Least 15 Items Sold</option></select> -->

<!-- <select id="visualizationtype"><option value="">Select One</option><option value="bar">Bar Chart</option><option value="line">Line Chart</option>
  <option value="bubble">Bubble Chart</option></select> -->
</p>
<div class="btn-group mt0">
<button type="button" class="btn btn-primary p5 metricmeasure buttonactive" id="top">Most Sold</button>
<button type="button" class="btn btn-primary p5 metricmeasure" id="least">Least Sold</button>
</div>
<p class="mb0">Visualization type</p>
<div class="btn-group mt0">
<button type="button" class="btn btn-primary p5 visualizationtype buttonactive" id="bar">Bar Chart</button>
<button type="button" class="btn btn-primary p5 visualizationtype" id="line" >Line Chart</button>
</div>
</div>

<div class="col-md-6 text-right mt5">
<div class="text-primary demo"><h6 id="reportrange">Days of the week</h6></div>
<div>
<div class="btn-group mt5">
<button type="button" class="btn btn-primary p5 dayoftheweek" id="0" >Mon</button>
<button type="button" class="btn btn-primary p5 dayoftheweek" id="1" >Tue</button>
<button type="button" class="btn btn-primary p5 dayoftheweek" id="2" >Wed</button>
<button type="button" class="btn btn-primary p5 dayoftheweek" id="3" >Thur</button>
<button type="button" class="btn btn-primary p5 dayoftheweek" id="4" >Fri</button>
<button type="button" class="btn btn-primary p5 dayoftheweek" id="5" >Sat</button>
<button type="button" class="btn btn-primary p5 dayoftheweek" id="6" >Sun</button>
</div>
<div class="text-primary demo"><h6 id="reportrange">Day/Night Shift</h6></div>
<div class="btn-group mt5">
<button type="button" class="btn btn-primary p5 daynight" id="day">Day</button>
<button type="button" class="btn btn-primary p5 daynight" id="night" >Night</button>
</div>
  <!-- Day Week Month Year <b id="custom" class="text-primary">Custom</b> -->

</div>
</div>
</div>


<div class="row mb50">
<div class="col-md-12 mt0">
    <div class="card card-style mt10">
      <div class="card-body  p30 pt5 pb5">
        <div><p class="text-primary mt10 titleofchart">Bakery Visualization</p></div>
        <div style="min-height: 500px;">
          <div class="chart-container">
            <div class="chart" id="mychart"></div>
          </div>
        </div>
          </div>
    </div>
  </div>
</div>






</div>


<script type="text/javascript" src="assets/js/jquery-1.11.3.min.js"></script>
<script src="assets/bootstrap/js/bootstrap.js">
</script>
<script type="text/javascript" src="assets/js/toastr.js"></script>
<script src="assets/vendors/bootstrap-daterangepicker/moment.js"></script>
<script src="assets/vendors/bootstrap-daterangepicker/daterangepicker.js"></script>
<script type="text/javascript" src="assets/vendors/d3/d3.min.js"></script>

<script type="text/javascript" src="assets/vendors/d3/d3_tooltip.js"></script>
 <script>
   $(function (){
    

// Initialize chart
mycharts('#mychart', 600);


// Chart setup
function mycharts(element, height) {
// Basic setup
    // ------------------------------

    // Define main variables
    // default variables for all
    var d3Container = d3.select(element),
        margin = {top: 10, right: 10, bottom: 50, left: 150},
        width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;


    var formatPercent = d3.format("");
    // Format data
    // var parseDate = d3.time.format("%d-%b-%y").parse,
    //     bisectDate = d3.bisector(function(d) { return d.date; }).left,
    //     formatValue = d3.format(",.0f"),
    //     formatCurrency = function(d) { return formatValue(d); }

barChart('top20sold.json','top')
$('.titleofchart').html("Most Sold Product");
    // bar chart to show most product sold
function barChart(jsonDataName,sort)
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
       myinputdata = d3.json(jsonDataName,function(error,data) {
        console.log(data);
       
       if(sort == "top")
       {
        data.sort(function(a, b){
    	    return a.TotalSold - b.TotalSold;
    	});  
       }

      //  [
      //        {letter:"Monday", frequency:2550},
      //        {letter:"Tuesday", frequency:800},
      //        {letter:"Wednesday", frequency:500},
      //        {letter:"Thursday", frequency:1700},
      //        {letter:"Friday", frequency:1900},
      //        {letter:"Saturday", frequency:1500},
      //        {letter:"Sunday", frequency:3000},
      //    ];
      //  //
       //
       //   // Create tooltip
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
               .style("font-size",14)
               .text("Item")
               .call(yAxis)
               .selectAll("text")
              .style("font-size",12);

       //
       //
           // Add text label
          //  verticalAxis.append("text")
          //      .attr("transform", "rotate(-90)")
          //      .attr("y", 10)
          //      .attr("dy", ".71em")
          //      .style("text-anchor", "end")
          //      .style("fill", "#999")
          //      .style("font-size", 12)
          //      // .text("Frequency")
          //      ;
       //
       //
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

});
// load in the json data

}// end of bar chart




}
});
  </script>

  <script src="handler.js"></script>

</body>
</html>
