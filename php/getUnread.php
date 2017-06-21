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
$getUnreadSQL = "SELECT strategies.sid,title,DATA, COUNT(comment.uid) COUNT FROM `comment` LEFT JOIN strategies ON  strategies.sid=comment.sid WHERE `read`=0 AND strategies.uid = '$uid' GROUP BY strategies.sid";

$result = $db->execSQL($getUnreadSQL);
if ($result->num_rows > 0){
    $msg -> code = 1;
    while ($row = $result->fetch_object())
        array_push($arr, $row);
    $msg->data = $arr;
}else{
    $msg->code=0;
}
echo json_encode($msg);