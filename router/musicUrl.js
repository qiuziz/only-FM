/*
 * @Author: qiuziz
 * @Date: 2017-04-28 21:17:30
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-04-28 21:17:30
 */

const express = require("express")
const router = express()
const createWebAPIRequest = require("../util/util")

router.get("/", (req, res) => {
  const id = parseInt(req.query.id)
  const br = parseInt(req.query.br || 999000)
  const data = {
    "ids": [id],
    "br": br,
    "csrf_token": ""
  }
  const cookie = req.get('Cookie') ? req.get('Cookie') : ''

  createWebAPIRequest(
    '/weapi/song/enhance/player/url',
    'POST',
    data,
    cookie,
    music_req => {
      res.setHeader("Content-Type", "application/json")
      res.send(music_req)
    },
    err => {
      res.status(502).send('fetch error')
    }
  )
})

module.exports = router