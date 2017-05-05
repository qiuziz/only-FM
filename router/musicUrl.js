/*
 * @Author: qiuziz
 * @Date: 2017-04-28 21:17:30
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-04 11:30:41
 */

const express = require("express")
const router = express()
const createWebAPIRequest = require("../util/util")
const connect = require("../util/db.js");

router.get("/", (req, res) => {
  const id = parseInt(req.query.id)
  // const br = parseInt(req.query.br || 999000)
  // const data = {
  //   "ids": [id],
  //   "br": br,
  //   "csrf_token": ""
  // }
  // const cookie = req.get('Cookie') ? req.get('Cookie') : ''

  // createWebAPIRequest(
  //   '/weapi/song/enhance/player/url',
  //   'POST',
  //   data,
  //   cookie,
  //   music_req => {
  //     res.setHeader("Content-Type", "application/json")
  //     connect((err, db) => {
  //     //连接到表 song_url
  //       var collection = db.collection('song_url');
  //       var data = JSON.parse(music_req).data;
  //       data[0].url = '../music/' + id + '.mp3';
  //       //插入数据库
  //       collection.save({_id:id,data:data }, function(err, result) { 
  //         if(err)
  //         {
  //             console.log('Error:'+ err);
  //             return;
  //         }
  //         db.close();
  //         res.send(music_req)
  //         console.log(result);
  //       });
  //     })
  //   },
  //   err => {
  //     res.status(502).send('fetch error')
  //   }
  // )

  connect((err, db) => {
		//连接到表 song_url
		var collection = db.collection('song_url');
		
		//查询数据库
		collection.findOne({_id: id}, function(err,doc){
			if (err) {
				console.log(err);
        res.status(502).send('fetch error')
				return;
			}
			var music_req = JSON.stringify(doc);
			db.close();
			res.send(music_req);
		})
	})
})

module.exports = router