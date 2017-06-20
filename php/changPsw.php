<?php
include_once "MyDB.php";
require_once "Message.php";
session_start();
$msg = new Message();
$db = new MyDB();

if(empty($_SESSION['user'])||!isset($_POST['psw'])){
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if($_SESSION['user']!=null){
    $u = $_SESSION['user'];
    $uid = $u->uid;
}
$psw = $_POST['psw'];

$updateSQL = "UPDATE USER SET psd='$psw' WHERE uid='$uid'";
$getinfo = "SELECT * FROM user WHERE uid = '$uid'";

$results = $db->execSQL2($updateSQL);
if($results>0){
    $msg->code=1;
    $result = $db->execSQL($getinfo);
    $row = $result->fetch_object();
    $row->psd = '';
    $_SESSION['user'] = $row;
}else{
    $msg->code=0;
}
echo  json_encode($msg);