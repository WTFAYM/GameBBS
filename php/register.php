<?php
header("Content-type:application/json;charset=utf-8");
include_once "MyDB.php";
require_once "Message.php";
session_start();

if(!isset($_POST['user'])){
    return ;
}
$user = $_POST['user'];
$psw = $_POST['psw'];
$gender = $_POST['gender'];

$username = $user;
$img = "public/images/login.jpg";

$msg = new Message();
$db = new MyDB();

$insertSQL = "INSERT INTO `user` VALUE('$user','$psw','$username',$gender,'$img')";

$checkSQL = "SELECT * FROM `user` WHERE uid = '$user 'AND  psd = '$psw'";

$results = $db->execSQL2($insertSQL);
if ($results > 0){
    $msg->code = 1;
    $result = $db->execSQL($checkSQL);
    $row = $result->fetch_object();
    $row->psd = '';
    $_SESSION['user'] = $row;
} else{
    $msg->code=0;
}
echo json_encode($msg);