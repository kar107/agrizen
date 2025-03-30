<?php 
session_start();
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
include_once '../lib/dao.php';
include '../lib/model.php';
$d = new dao();
$m = new model();

$con=$d->dbCon();
$base_url= $m->base_url();
$cDateTime= date("Y-m-d H:i");
$created_date=$cDateTime;
if (isset($_SESSION['gssk_user_id'])) {
	$gssk_user_id = $_SESSION['gssk_user_id'];
}

extract($_POST); 
 ?>