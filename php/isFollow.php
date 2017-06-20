<?php
include_once "MyDB.php";
require_once "Message.php";
session_start();
$msg = new Message();
$db = new MyDB();

if(empty($_SESSION['user'])||!isset($_POST['uid'])){
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if($_SESSION['user']!=null){
    $u = $_SESSION['user'];
//    当前用户id
    $uid = $u->uid;
}

$fuid = $_POST['uid'];

$checkFollowSQL = "SELECT * FROM follow WHERE use_uid = '$uid' AND uid ='$fuid'";
$result = $db->execSQL($checkFollowSQL);
if ($result->num_rows > 0){
    $msg->code=1;
}else {
    $msg->code=0;
}
echo json_encode($msg);