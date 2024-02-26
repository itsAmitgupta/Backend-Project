// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv'
import connectDb from './db/connect.js'


dotenv.config({
    path:'./env'
})
connectDb()
