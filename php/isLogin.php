<?php
require_once "Message.php";
session_start();
$msg = new Message();
if(empty($_SESSION['user'])){
    $msg -> code = 0;
    echo json_encode($msg);
    return;
}
if($_SESSION['user']!=null){
    $msg->code = 1;
    $msg->data = $_SESSION['user'];
}else{
    $msg -> code = 0;
}
echo json_encode($msg);