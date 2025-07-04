import express from 'express'
import { CONNECT_DB, DISCONNECT_DB } from '~/config/mongodb.js'
import exitHook from 'async-exit-hook'
import { v1Router } from '~/routes/v1/index.js'
import { corsOptions } from './config/cors'
import { env } from '~/config/environment'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware.js'
import http from 'http'
import socketIo from 'socket.io'
import { notiOfNewJob } from './sockets/newJobFromcompany'


// import {errorHandlingMiddleware} from '~/middlewares/errorHandlingMiddleware.js'


const START_SERVER = () => {
    const app = express()

    app.use((req, res, next) => {
        res.set('Cache-control', 'no-store')
        next()
    })

    app.use(cookieParser())

    app.use(cors(corsOptions))
    app.use(express.json()) // Bật middle ware express.json() để parse data và gắn vào req.body

    app.use('/server', v1Router)

    // Middleware error handling
    app.use(errorHandlingMiddleware)

    //Create a sever to wrap this app
    const server = http.createServer(app)
    const io = socketIo(server, { cors: corsOptions })

    io.on('connection', (socket) => {
        notiOfNewJob(socket)
    })

    server.listen(env.APP_PORT, env.APP_HOST, () => {
        console.log(`Production: Hi ${env.AUTHOR}, Back-end Server is running successfully at Port: ${env.APP_PORT}`)
    })

    //  Thực hiện các tác vụ clean up trước khi đóng server
    exitHook(() => {
        console.log('EXIT')
        DISCONNECT_DB()
    })
}

// Synttax IIFE : Immediately Invoked Function Expression
(async () => {
    try {
        await CONNECT_DB()
        START_SERVER()
    } catch (error) {
        console.error(error)
        process.exit(0)
    }
})()
