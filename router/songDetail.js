/*
 * @Author: qiuziz
 * @Date: 2017-04-28 11:15:37
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-11 11:02:46
 */

const express = require("express")
const router = express()
const createWebAPIRequest = require("../util/util")
const connect = require("../util/db.js");


router.get("/", (req, res) => {
  const ids = req.query.ids
  // createWebAPIRequest(`/api/song/detail?ids=%5B${ids}%5D`, 'GET', '', '',
  //   music_req => {
	// 		connect((err, db) => {
	// 			//连接到表 song_detail
	// 			var collection = db.collection('song_detail');
				
	// 			//插入数据库
	// 			collection.save({_id:ids,songs: JSON.parse(music_req).songs}, function(err, result) { 
	// 				if(err)
	// 				{
	// 						console.log('Error:'+ err);
	// 						return;
	// 				}
	// 				db.close();
  //    			res.setHeader("Content-Type", "application/json")
	// 				res.send(music_req)
	// 				console.log(result);
	// 			});
	// 		})
  //   },
  //   err => {
  //     res.status(502).send('fetch error')
  //   })

		connect((err, db) => {
		//连接到表 song_detail
		var collection = db.collection('song_detail');
		//查询数据库
		collection.findOne({_id: ids}, function(err,doc){
			if (err) {
				console.log(err);
				db.close();
        res.status(502).send('fetch error')
				return;
			}
			var music_req = JSON.stringify(doc);
			db.close();
			res.setHeader("Content-Type", "application/json")
			res.send(music_req);
		})
	})
})


module.exports = router