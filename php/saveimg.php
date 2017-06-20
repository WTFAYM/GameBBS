<?php
$img = $_POST['myhidden'];
//匹配出图片的格式
if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $img, $result)){
    $type = $result[2];
    $new_file = "./tesstimg/";
    if(!file_exists($new_file))
    {
        //检查是否有该文件夹，如果没有就创建，并给予最高权限
        mkdir($new_file, 0700);
    }
    $new_file = $new_file.time().".{$type}";

    if (file_put_contents($new_file, base64_decode(str_replace($result[1], '', $img)))){
    }else{
    }
}
echo json_encode($img);