/*
 * @Author: qiuziz
 * @Date: 2017-04-26 17:08:14
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-03 22:51:22
 */

const express = require("express");
const crypto = require('crypto');
const router = express();
const createWebAPIRequest = require("../util/util");
const connect = require("../util/db.js");

router.get("/",(req,res)=>{
  const cookie = req.get('Cookie') || '';
  const data = {
    "offset": 0,
    "total": true,
    "limit": 20,
    "csrf_token": ""
  };

  createWebAPIRequest(
    '/weapi/v1/discovery/recommend/songs',
    'POST',
    data,
    cookie,
    music_req => {
			connect((err, db) => {
      //连接到表 recommend
			var collection = db.collection('recommend');
			//插入数据库
			collection.save(JSON.parse(music_req), function(err, result) { 
				if(err)
				{
						console.log('Error:'+ err);
						return;
				}
				res.send(music_req)
				console.log(result);
			});
		})
		},
    err => res.status(502).send('fetch error')
  );

	// connect((err, db) => {
	// 	//连接到表 recommend
	// 	var collection = db.collection('recommend');
		
	// 	//查询数据库
	// 	collection.findOne({},{}, function(err,doc){
	// 		if (err) {
	// 			console.log(err);
	// 			return;
	// 		}
	// 		var music_req = JSON.stringify(doc);
	// 		db.close();
	// 		res.send(music_req);
	// 	})
	// })
});



module.exports = router;