<?php
include_once "MyDB.php";
require_once "Message.php";
$msg = new Message();
$db = new MyDB();

if (isset($_POST['sid'])) {
    $sid = $_POST['sid'];
} else {
    $msg->code = 0;
    echo json_encode($msg);
    return;
}

$deleteComment = "DELETE FROM `comment` WHERE sid = '$sid'";
$deleteStrategy = "DELETE FROM strategies WHERE sid = '$sid'";

$results = $db->execSQL2($deleteSQL);
if($results>0){
    $result = $db->execSQL2($deleteStrategy);
    if ($result > 0){
        $msg->code = 1;
    }
}else{
    $msg->code=0;
}
echo json_encode($msg);