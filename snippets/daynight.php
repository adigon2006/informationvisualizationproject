<?php
require_once('../includes/MyDbHandler.php');
$dbhandler = new Mydbhandler();
global $sampletestcode;
$ascdsc = ""; 
$hourquery = "";
$visualtype = "";
$metrictype = "";
$dayoftheweek = "";
$daynight = "";
$dayoftheweekquery = "";
if(isset($_GET['visualtype']))
{
$visualtype = $_GET['visualtype'];
//
}
if(isset($_GET['metrictype']))
{
$metrictype = $_GET['metrictype'];
}
if(isset($_GET['dayoftheweek']))
{
    $dayoftheweek = $_GET['dayoftheweek'];
  //  echo $dayoftheweek;
}
if(isset($_GET['daynight']))
{
    $daynight = $_GET['daynight'];
}

if( isset($_GET['visualtype']) && isset($_GET['metrictype']))
{
if($metrictype == "top")
{
$ascdsc = "DESC"; 
}
if($metrictype == "least")
{
$ascdsc = "ASC"; 
}
if($daynight == "day")
{
$hourquery = " HOUR(Time)  >= 0  and HOUR(Time)  < 18 ";
}
if($daynight == "night")
{
    $hourquery = " HOUR(Time)  > 18  and HOUR(Time)  < 24  ";
}
if($dayoftheweek != "")
{
$dayoftheweekquery = " WEEKDAY(DATE) = ".$dayoftheweek." and "; 
}     
$query = "select Item, COUNT(Item) AS TotalSold FROM bakery WHERE ". $dayoftheweekquery . $hourquery." GROUP BY Item ORDER BY COUNT(Item) ".$ascdsc." LIMIT 20";
//$query = "SELECT Item, COUNT(Item) AS TotalSold FROM bakery WHERE WEEKDAY(DATE) = 5 GROUP BY Item ORDER BY COUNT(Item) DESC LIMIT 20";
$sampletestcode = $dbhandler->QueryByDate($query);
}


print_r($sampletestcode);
//echo($daynight);
?>