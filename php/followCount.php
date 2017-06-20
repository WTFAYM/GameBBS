<?php
include_once "MyDB.php";
require_once "Message.php";
if(!isset($_POST['uid'])){
    return;
}
$arr = [];
$uid = $_POST['uid'];
$db = new MyDB();
$msg = new Message();

$followsSQL = "SELECT COUNT(*) FROM follow WHERE use_uid='$uid'";
$followedSQL = "SELECT COUNT(*) FROM follow WHERE uid='$uid'";
$result = $db->execSQL($followsSQL);
if ($result->num_rows > 0){
    $f = $result->fetch_row();
    array_push($arr,$f[0]);
    $msg->code=1;
}else{
    $msg->code=0;
}
$result = $db->execSQL($followedSQL);
if ($result->num_rows > 0){
    $f = $result->fetch_row();
    array_push($arr,$f[0]);
    $msg->code=1;
    $msg->data=$arr;
} else{
    $msg->code=0;
}
echo json_encode($msg);