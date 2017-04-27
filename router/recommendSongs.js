/*
 * @Author: qiuziz
 * @Date: 2017-04-26 17:08:14
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-04-26 17:50:24
 */

const express = require("express");
const crypto = require('crypto');
const router = express();
const createWebAPIRequest = require("../util/util");

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
    music_req => res.send(music_req),
    err => res.status(502).send('fetch error')
  );
});

module.exports = router;