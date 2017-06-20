<?php
include_once "MyDB.php";
require_once "Message.php";
session_start();
$msg = new Message();
$db = new MyDB();

if(!isset($_POST['uid'])){
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if(empty($_SESSION['user'])){
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if($_SESSION['user']!=null){
    $u = $_SESSION['user'];
    $cid = $u->uid;
}
$uid = $_POST['uid'];
$type = $_POST['type'];

$followSQL = "INSERT INTO follow(use_uid,uid) VALUE ('$cid','$uid')";
$cancelFollowSQL = "DELETE FROM follow WHERE use_uid = '$cid' AND uid = '$uid'";

if ($type==0){
    $result = $db->execSQL2($followSQL);
    if($result>0){
        $msg->code=1;
    }
}elseif ($type==1){
    $result = $db->execSQL2($cancelFollowSQL);
    if($result>0){
        $msg->code=1;
    }
}
echo json_encode($msg);