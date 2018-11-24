<?php
// main function class handler
class Mydbhandler
{	
private $connect;   
 
private function __contruct()
{	    
//date_default_timezone_set("America/Denver");
require_once ('dbconnect.php');    
$dbconnect = new Dbconnect();
$this->connect = $dbconnect->connect();
return $this->connect;
}

// redirect to another page
public function redirect_to($location)
{
exit(header("Location:{$location}"));  
}

private function getBaseURL()
{
    require_once '../includes/otherconstant.php';
  $baseurl = BASE_URL;
  return $baseurl;
}

public function getBaseURL2()
{
require_once '../includes/otherconstant.php';
$baseurl = BASE_URL;
return $baseurl;
}


public function getNameByID($tablename,$fieldname,$fieldvalue)
{
  global $result;  
  $stmt = $this->__contruct()->prepare("select name from ".$tablename." where ".$fieldname."=? LIMIT 1");
  $stmt->bind_param('s',$fieldvalue);
  $stmt->execute();
  $stmt->bind_result($result);
  $stmt->store_result();
  $numrows = $stmt->num_rows();
if($numrows == 1)
{
   $stmt->fetch();
   $result = $result;
   
}
  $stmt->close();
  return $result;
}

public function QueryByDate($query)
{
global $result;
$result = array();  
/*$stmt = $this->__contruct()->prepare("
 SELECT Item, COUNT(Item) AS TotalSold FROM bakery WHERE WEEKDAY(DATE) = 5
 GROUP BY Item ORDER BY COUNT(Item) DESC LIMIT 20");*/
 $stmt = $this->__contruct()->prepare($query);
   //$stmt->bind_param('s',$fieldvalue);
$stmt->execute();
    //$stmt->bind_result($result);
    //$stmt->store_result();
$answer = $stmt->get_result();
    //$stmt->store_result();
$numrows = $stmt->num_rows();
    //$result = $answer->fetch_assoc();
      //if($numrows > 1)
     //{
  while($r = $answer->fetch_assoc()) 
        {

        //print_r($r);
        $result[] = $r;
         //$result = $result;
        }
        //print_r($result);
     //}
     return json_encode($result);
    //return $result;
    //return $result;
    $stmt->close();
    
}


}

?>
