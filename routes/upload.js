var express = require('express');
var router = express.Router();
var fs = require('fs');
// 引入七牛模块  
var qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'KpspZk24xDUxS2_a-XqIdWP2xmwpThYDYvYlxJ2h';
qiniu.conf.SECRET_KEY = 'wQ1fjMNjy_984HqfpiaKH7MWtS5IpexQGaqgzR7y';
//要上传的空间名
var bucket = 'blog-github-img';
// 图片上传
router.post('/upload', function(req, res, next){
	// 图片数据流
	var imgData = req.body.imgData;
	// 构建图片名
	var fileName = Date.now() + '.png';
	// 构建图片路径
	var filePath = './tmp/' + fileName;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(filePath, dataBuffer, function(err) {
        if(err){
          res.end(JSON.stringify({status:'102',msg:'文件写入失败'}));	
        }else{
        		//生成上传
        		var putPolicy = new qiniu.rs.PutPolicy(bucket+":" + fileName);
        		var token = putPolicy.token();
        		var extra = new qiniu.io.PutExtra();
		    qiniu.io.putFile(token, fileName, filePath, extra, function(err, ret) {
			    if(!err) {
			        // 上传成功， 处理返回值  
			        // ret.key 是图片的名字
			        var imageSrc = 'http://o9059a64b.bkt.clouddn.com/' + ret.key;
			        res.end(JSON.stringify({status:'100',msg:'上传成功',imageUrl:imageSrc}));	
			     } else {
			        // 上传失败， 处理返回代码
			       res.end(JSON.stringify({status:'101',msg:'上传失败',error:ret}));	
			     }
			     // 上传之后删除本地文件
			     fs.unlinkSync(filePath);
			 });
        }
    });
})
module.exports = router;


