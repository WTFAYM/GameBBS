<?php
include_once "MyDB.php";
require_once "Message.php";
session_start();
$msg = new Message();
$db = new MyDB();

if(empty($_SESSION['user'])||!isset($_POST['old'])){
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if($_SESSION['user']!=null){
    $u = $_SESSION['user'];
    $uid = $u->uid;
}
$old = $_POST['old'];

$selSQL = "SELECT psd FROM `user` WHERE uid = '$uid'";

$result = $db->execSQL($selSQL);
if ($result->num_rows > 0){
    $row = $result->fetch_object();
}else{
    $msg->code=0;
    echo json_encode($msg);
    return;
}
if ($row->psd==$old){
    $msg->code = 1;
}else{
    $msg->code = 0;
}
echo json_encode($msg);