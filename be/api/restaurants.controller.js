import e from 'express'
import { removeAllListeners } from 'nodemon'
import RestaurantsDAO from '../dao/restaurantsDAO.js'

export default class RestaurantsController {
    static async apiGetRestaurants(req,res,next){
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.cuisine){
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode){
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }
    }
}

//36 min mark