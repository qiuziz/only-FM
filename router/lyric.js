/*
 * @Author: qiuziz
 * @Date: 2017-04-26 17:08:14
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-04-26 18:29:53
 */

const express = require("express");
const crypto = require('crypto');
const router = express();
const createWebAPIRequest = require("../util/util");


router.get("/", (req, res) => {
  const id = req.query.id
  createWebAPIRequest('/api/song/lyric?os=osx&id=' + id + '&lv=-1&kv=-1&tv=-1', 'POST', '', '',
    result => {
      res.setHeader("Content-Type", "application/json")
      res.send(result)
    },
    err => {
      res.status(502).send('fetch error')
    })
});

module.exports = router;