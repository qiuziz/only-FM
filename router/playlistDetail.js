/*
 * @Author: qiuziz
 * @Date: 2017-04-28 10:38:22
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-10 11:05:14
 */

const http = require('http')
const express = require("express")
const router = express()
const createWebAPIRequest = require("../util/util")
const connect = require("../util/db.js");

router.get("/", (req, res) => {
  // const cookie = req.get('Cookie') ? req.get('Cookie') : ''
  // let detail, imgurl
  // const data = {
  //   "id": req.query.id,
  //   "offset": 0,
  //   "total": true,
  //   "limit": 1000,
  //   "n": 1000,
  //   "csrf_token": ""
  // }

  // createWebAPIRequest(
  //   '/weapi/v3/playlist/detail',
  //   'POST',
  //   data,
  //   cookie,
  //   music_req => {
  //     detail = music_req;
  //     connect((err, db) => {
  //       //连接到表 like_list
  //       var collection = db.collection('like_list');
        
  //       //插入数据库
  //       collection.save(JSON.parse(music_req), function(err, result) { 
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

  // // FIXME:i dont know the api to get coverimgurl
  // // so i get it by parsing html
  // const http_client = http.get({
  //   hostname: 'music.163.com',
  //   path: '/playlist?id=' + req.query.id,
  //   headers: {
  //     'Referer': 'http://music.163.com',
  //   },
  // }, function (res) {
  //   res.setEncoding('utf8')
  //   let html = ''
  //   res.on('data', function (chunk) {
  //     html += chunk
  //   })
  //   res.on('end', function () {
  //     const regImgCover = /\<img src=\"(.*)\" class="j-img"/ig
  //     imgurl = regImgCover.exec(html)[1]
  //     mergeRes()

  //   })
  // })

  // function mergeRes() {
  //   if (imgurl != undefined && detail != undefined) {
  //     detail = JSON.parse(detail)
  //     detail.playlist.picUrl = imgurl
  //   }
  // }

  connect((err, db) => {
		//连接到表 like_list
		var collection = db.collection('like_list');
		
		//查询数据库
		collection.findOne({}, {_id: 0}, function(err,doc){
			if (err) {
				console.log(err);
			  db.close();
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