<?php
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
if (isset($_POST['sid'])){
    $sid = $_POST['sid'];
}else{
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}

$readSQL = "UPDATE `comment` SET `read`=1 WHERE sid='$sid'";

$results = $db->execSQL2($readSQL);
if($results>0){
    $msg->code=1;
}else{
    $msg->code=0;
}
echo  json_encode($msg);