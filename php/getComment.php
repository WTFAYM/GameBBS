<?php
include_once "MyDB.php";
require_once "Message.php";
$msg = new Message();
$db = new MyDB();
$arr = [];

if (isset($_POST['sid'])) {
    $sid = $_POST['sid'];
} else {
    $msg->code = 0;
    echo json_encode($msg);
    return;
}
$page = $_POST['page'];
$page = $page*10;

$getCommentSQL = "SELECT comment.uid,username,img,content,TIME 
                FROM `comment` LEFT JOIN `user` ON comment.uid=user.uid WHERE sid = '$sid' ORDER BY cid DESC LIMIT $page";
$result =  $db->execSQL($getCommentSQL);
if ($result->num_rows > 0){
    $msg -> code = 1;
    while ($row = $result->fetch_object())
        array_push($arr, $row);
    $msg->data = $arr;
}else{
    $msg->code = 0;
}
echo json_encode($msg);