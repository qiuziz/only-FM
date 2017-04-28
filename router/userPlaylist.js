/*
 * @Author: qiuziz
 * @Date: 2017-04-28 10:38:22
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-04-28 11:00:43
 */
const express = require("express")
const router = express()
const createWebAPIRequest = require("../util/util")

router.get("/", (req, res) => {
  const cookie = req.get('Cookie') ? req.get('Cookie') : ''
  const data = {
    "offset": 0,
    "uid": req.query.uid,
    "limit": 1000,
    "csrf_token": ""
  }
  createWebAPIRequest(
    '/weapi/user/playlist',
    'POST',
    data,
    cookie,
    music_req => res.send(music_req),
    err => res.status(502).send('fetch error')
  )
})

module.exports = router