import express from 'express'
import cors from 'cors';
import restaurants from './api/restaurants.route.js'

const app = express()

//middleware
app.use(cors())
app.use(express.json())

//routes
app.use('/api/v1/restaurants', restaurants)

//outside of the api-not found
app.use("*", (req,res) => res.status(404).json({error:"Not Found"}))

export default app
