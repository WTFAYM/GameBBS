<?php
header("Content-type:application/json;charset=utf-8");
date_default_timezone_set('Asia/Shanghai');
include_once "MyDB.php";
require_once "Message.php";
session_start();
$msg = new Message();
$db = new MyDB();

if(empty($_SESSION['user'])){
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if($_SESSION['user']!=null){
    $u = $_SESSION['user'];
    $uid = $u->uid;
}
$title=$_POST['title'];
$content = $_POST['content'];
$time = date("Y-m-d H:i:s");

//插入语句
$insertSQL = "INSERT INTO strategies(uid,title,`DATA`,TEXT) VALUE('$uid','$title','$time','$content')";
$results = $db->execSQL2($insertSQL);

if ($results > 0){
    $msg->code = 1;
} else{
    $msg->code=0;
}
echo json_encode($msg);