<?php
include_once "MyDB.php";
require_once "Message.php";
session_start();
$msg = new Message();
$db = new MyDB();
$arr = [];

if (isset($_POST['type'])){
    $type = $_POST['type'];
}else{
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
    $uid = $u->uid;
}

$getStrategySQl = "SELECT strategies.sid,title,DATA,COUNT(cid) COUNT 
              FROM `user`, strategies LEFT JOIN `comment` ON strategies.sid=comment.sid 
              WHERE user.uid=strategies.uid AND user.uid = '$uid' GROUP BY strategies.sid ORDER BY sid";

$getCommentStrategySQl = "SELECT strategies.sid,title,DATA,COUNT(cid) COUNT 
              FROM `user`, strategies LEFT JOIN `comment` ON strategies.sid=comment.sid 
              WHERE user.uid=strategies.uid AND comment.uid = '$uid' GROUP BY strategies.sid ORDER BY sid";

if($type==1) {
    $results = $db->execSQL($getStrategySQl);
}elseif ($type==2){
    $results = $db->execSQL($getCommentStrategySQl);
}
if ($results->num_rows > 0) {
    $msg->code=1;
    while ($row = $results->fetch_object())
        array_push($arr, $row);
    $msg->data = $arr;
} else{
    $msg->code=0;
}
echo json_encode($msg);