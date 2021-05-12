import RestaurantsDAO from '../dao/restaurantsDAO.js'

export default class RestaurantsController {
    static async apiGetRestaurants(req,res,next){
        //query strings in url
        //if restaurantsPerPage exists in the url as query, convert to interger and set it to 10
        // if theres not a query in url, default is 20 per page 
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20
        //if page is in query set it to 10 pages, if not then all restaurants are on the main page
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        //will filter based on what shows in the url query
        let filters = {}
        if (req.query.cuisine){
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode){
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { restaurantsList, totalNumRestaurants} = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage,
        })

        let response = {
            restaurants: restaurantsList,
            page:page,
            filters:filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        }

        res.json(response)
    }
}

