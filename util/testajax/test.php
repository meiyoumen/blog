<?php
header('Content-type:text/json');
header('city: shanghaishi');
$user=array('phpne'=>13918553291,'password'=>'abc123456');

$code=-1;
$desc='请求成功!';

if($code!=200){
    $desc='该手机号已注册!';
}



$arrJson =['A','B'];
$arr = array (
    'code'=>$code,
    'desc'=>$desc,
    'user'=>$arrJson
    );

print_r(json_encode($arr));

?>