const express = require("express")
const logger = require('pino-http')()

const claimRouter = require('./claimer/router')

const app = express()
app.use(logger)
app.use('/claim-free-share', claimRouter)

// 404 Handler
app.use((req, res, next) => {
    return res.status(404).json({message: 'Not found.'})
})

module.exports = app
