/*
 * @Author: qiuziz
 * @Date: 2017-04-28 11:15:37
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-04-28 11:20:07
 */

const express = require("express")
const router = express()
const createWebAPIRequest = require("../util/util")

router.get("/", (req, res) => {
  const ids = req.query.ids
  createWebAPIRequest(`/api/song/detail?ids=%5B${ids}%5D`, 'GET', '', '',
    result => {
      res.setHeader("Content-Type", "application/json")
      res.send(result)
    },
    err => {
      res.status(502).send('fetch error')
    })
})


module.exports = router