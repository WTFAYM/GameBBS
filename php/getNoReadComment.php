<?php
include_once "MyDB.php";
require_once "Message.php";
session_start();
if(empty($_SESSION['user'])){
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if($_SESSION['user']!=null){
    $u = $_SESSION['user'];
    $uid = $u->uid;
}

$msg = new Message();
$db = new MyDB();
$getSQL = "SELECT COUNT(*) COUNT  FROM COMMENT WHERE  `read` = 0 AND sid IN (SELECT sid FROM strategies WHERE uid='$uid')";

$result = $db->execSQL($getSQL);
if ($result->num_rows > 0){
    $msg -> code = 1;
    $row = $result->fetch_object();
    $msg->data = $row;
}else{
    $msg->code=0;
}
echo json_encode($msg);