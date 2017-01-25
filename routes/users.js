var express = require('express');
var router = express.Router();
var urllib = require('url');;

// 导入MySQL模块  b95f136c16b3b4b825d091ef61271414
var dbConfig = require('../db/DBConfig');
var User = require('../db/usersql');

var mysql = require('mysql');
var client = mysql.createConnection(dbConfig.mysql);
// 注册接口
router.all('/user/register', function(req, res, next){
	if (req.method == "POST") {
		var param = req.body;
	} else{
		var param = req.query || req.params; 
	}
	client.query(User.getUserByInfo,[param.username,param.password],function (err, results){
		if (err){
	  		throw err
	   }else{
	    		// 数据库不存在 就注册成功
	    		if (results.length == 0) {
	    			// 把新用户插入数据库
	    			client.query(User.insert,[param.username,param.password,getDataStr(),'',''],function (err, results) {
					if(err){
				  		throw err
				    }else{
						res.end(JSON.stringify({status:'100',msg:'注册成功!'}));
				    }
				})
	    		} else{ // 数据库存在就注册失败
	    			res.end(JSON.stringify({status:'101',msg:'该用户名已经被注册'}));	
	    		}
	   }
	})
});
// 登录接口
router.all('/user/login', function(req, res, next){
	if (req.method == "POST") {
		var param = req.body;
	} else{
		var param = req.query || req.params; 
	} 
	client.query(User.getUserByInfo,[param.username,param.password],function (err, results){
		if (err){
	  		throw err
	    }else{
	    		// 数据库存在 
	    		if (results.length == 0) {
	    			res.end(JSON.stringify({status:'102',msg:'用户名或密码错误'}));
	    		} else{ 
	    			if (results[0].username == param.username && results[0].password == param.password) {
	    				res.end(JSON.stringify({status:'100',msg:'登录成功'}));
	    			}
	    		}
	   }
	})
});
// 第三方登陆接口
router.all('/user/thirdlogin', function(req, res, next){
	if (req.method == "POST") {
		var param = req.body;
	} else{
		var param = req.query || req.params; 
	} 
	console.log(param.openid);
	client.query(User.getUserByOpenid,[param.openid],function (err, results){
		if (err){
	  		throw err
	    }else{
	    		// 数据库不存在 就跳转绑定  flag=1 需要绑定  flag=2 // 不需要绑定
	    		if (results.length == 0) {
	    			res.end(JSON.stringify({status:'100',msg:'操作成功',flag:'1'}));
	    		} else{ // 数据库存在就登录成功
	    			res.end(JSON.stringify({status:'100',msg:'登录成功',flag:'2'}));
	    		}
	   }
	})
});
// 绑定接口
router.all('/user/bangding', function(req, res, next){
	if (req.method == "POST") {
		var param = req.body;
	} else{
		var param = req.query || req.params; 
	}
	client.query(User.getUserByInfo,[param.username,param.password],function (err, results){
		if (err){
	  		throw err
	   }else{
	    		// 更新用户信息
    			client.query(User.bangding,[param.type,param.openid,param.username,param.password],function (err, results) {
				if(err){
			  		throw err
			    }else{
					res.end(JSON.stringify({status:'100',msg:'绑定成功!'}));
			    }
			})
	   }
	})
});
// 修改用户头像接口
router.all('/user/updateheadimage', function(req, res, next){
	if (req.method == "POST") {
		var param = req.body;
	} else{
		var param = req.query || req.params; 
	}
	client.query(User.updateHeadImage,[param.headUrl,param.username,param.password],function (err, results){
		if (err){
	  		throw err
	  		res.end(JSON.stringify({status:'101',msg:'修改失败!'}));
	   }else{
	    		res.end(JSON.stringify({status:'100',msg:'修改成功!',head_url:param.headUrl}));
	   }
	})
});
// 注销/删除用户接口
router.all('/user/cancel', function(req, res, next){
	if (req.method == "POST") {
		var param = req.body;
	} else{
		var param = req.query || req.params; 
	}
	client.query(User.getUserByInfo,[param.username,param.password],function (err, results){
	   if (err){
	  		throw err
	   }else{
	    		// 数据库不存在 就注册成功
	    		if (results.length == 0) {
	    			res.end(JSON.stringify({status:'103',msg:'该用户不存在'}));
	    		} else{ // 数据库存在就注册失败
	    			client.query(User.deleteUserByInfo,[param.username,param.password],function (err, results){
	    				if (err){
	  					throw err
	   				}else{
	   					res.end(JSON.stringify({status:'100',msg:'注销成功'}));	
	   				}
	    			})
	    		}
	   }
	})
});
// 获取所有的用户
router.all('/user/queryAll', function(req, res, next){
	if (req.method == "POST") {
		var param = req.body;
	} else{
		var param = req.query || req.params; 
	}
	client.query(User.queryAll,function (err, results) {
	  if (err){
	  	throw err
	  }else{
		 res.end(JSON.stringify({data:results,msg:'操作成功',status:'100'}));
	  }
	})
});


/* 下面的 代码无实质作用  */

var dataSuccess = {
	status: '100', 
	msg: '登录成功',
	data: {
		userId: '20170113',
		userName: 'hgdqstudio',
		blog: 'http://hgdqstudio.online'
	}
};
var dataError = {
	status: '99', 
	msg: '用户名或密码错误'
};


router.get('/users', function (req, res, next) {
	// 打印post请求的数据内容
    console.log(req.query);
	res.end(JSON.stringify(dataSuccess));
});
// 登录接口
router.all('/login',function (req, res, next) {
	console.log(req.method);// 打印请求方式
	if (req.method == "POST") {
		var param = req.body;
	} else{
		var param = req.query || req.params; 
	}
	console.log(param);
    console.log(param.username);
    console.log(param.password);
    if (param.username == "hgdqstudio" && param.password == "123456") {
		res.end(JSON.stringify(dataSuccess));
	} else {
		res.end(JSON.stringify(dataError));
	}
});
// 获取当前时间 yyyy-MM-dd HH:mm:ss
function getDataStr(){
    var date = new Date();
    var year = date.getFullYear();
    var mouth = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if(mouth < 10){ /*月份小于10  就在前面加个0*/
        mouth = String(String(0) + String(mouth));
    }
    if(day < 10){ /*月份小于10  就在前面加个0*/
        day = String(String(0) + String(day));
    }
    if(hour < 10){ /*月份小于10  就在前面加个0*/
        hour = String(String(0) + String(hour));
    }
    if(minute < 10){ /*月份小于10  就在前面加个0*/
        minute = String(String(0) + String(minute));
    }
    if(second < 10){ /*月份小于10  就在前面加个0*/
        second = String(String(0) + String(second));
    }
    var currentDate = String(year) + '-' + String(mouth) + '-' + String(day) + ' ' + String(hour) + ':' + String(minute) + ':' + String(second);
    return currentDate;
}
module.exports = router;
