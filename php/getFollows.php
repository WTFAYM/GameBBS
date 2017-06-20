<?php
include_once "MyDB.php";
require_once "Message.php";
session_start();
$msg = new Message();
$db = new MyDB();
$arr = [];

if(empty($_SESSION['user'])){
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if($_SESSION['user']!=null){
    $u = $_SESSION['user'];
    $uid = $u->uid;
}
if (isset($_POST['type'])){
    $type = $_POST['type'];
}else{
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}

$getFollowSQL = "SELECT uid,username,img FROM USER WHERE uid IN (SELECT uid FROM follow WHERE use_uid='$uid')";
$getFollowedSQL = "SELECT uid,username,img FROM USER WHERE uid IN (SELECT use_uid FROM follow WHERE uid='$uid')";
if ($type==1){
    $result = $db->execSQL($getFollowSQL);
}elseif ($type==2){
    $result = $db->execSQL($getFollowedSQL);
}
if ($result->num_rows > 0){
    $msg -> code = 1;
    while ($row = $result->fetch_object())
        array_push($arr, $row);
    $msg->data = $arr;
}else{
    $msg->code=0;
}
echo json_encode($msg);