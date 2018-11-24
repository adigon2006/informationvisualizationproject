<?php

class Dbconnect
{

private $connection;
function __construct()
{    
}
	
public function connect()
{
    require_once ('constant.php');
$this->connection = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
if(mysqli_connect_errno())
{
 die("Cannot establish database connection");   
}
return $this->connection;
}

}
?>