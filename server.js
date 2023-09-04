import express from 'express'
import {createServer} from 'http'

import { Server } from 'socket.io' 

import { fileURLToPath } from 'url'
import path from 'path'

import mongoose from 'mongoose'
import {Coordinates} from './models/coordinates.js'


try{
    mongoose.connect('mongodb://localhost:27017/leaflet_project',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    })
} catch {

}
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)

const io = new Server(server)

io.on('connection', async(socket) => {
    socket.on('fromBrowser', async(msg) => {
        const coord = new Coordinates({
            longitude: msg.lng,
            latitude: msg.lat
        })
        await coord.save()
        const coords = await Coordinates.find().lean()
        const coordinates = coords.map(el=> {return [el.latitude.toString(), el.longitude.toString()]})
        socket.emit('printCoordinates', coordinates)
    })
    socket.on('clearAll', async ()=>{
        await Coordinates.deleteMany()
    })
    socket.on('requestDisplayPath', async ()=>{
        const coords = await Coordinates.find().lean()
        const coordinates = coords.map(el=> {return [el.latitude.toString(), el.longitude.toString()]})
        socket.emit('displayPath', coordinates)
    })
    })

app.use(express.static(path.join(__dirname + '/public')))

server.listen(5000)