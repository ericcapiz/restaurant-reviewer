import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

let restaurants

//connect to db and get data from table
export default class RetaurantsDAO {
    static async injectDB(conn) {
        if(restaurants){
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}`,
            )
        }
    }

    //sets up search feature
    static async getRestaurants({
        filters = null,
         page = 0,
         restaurantsPerPage = 20,
    } = {}) {
        let query
        if (filters){
            if("name" in filters){
                query = {$text: {$search: filters["name"]}}
            } else if ("cuisine" in filters){
                //eq - equal
                //cuisine and zip - db field
                query = {"cuisine": {$eq: filters["cuisine"]}}
            } else if ("zipcode" in filters){
                query = {"address.zipcode":{$eq: filters["zipcode"]}}
            }
        }

    // displays restaurants by query
    let cursor
    
    //try catch is to grab the restaurants in the db that have been queried.
    try {
        cursor = await restaurants
        .find(query)
    } catch (e) {
        console.error(`Unable to issue find command, ${e}`)
        return {restaurantsList:[], totalNumRestaurants: 0}
    }

    
    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

    //puts the queried restaurant in an array and returns the queried restaurant to the page
    //if query error, returns empty list and nothing to display
    try {
        const restaurantsList = await displayCursor.toArray()
        const totalNumRestaurants =  await restaurants.countDocuments(query)

        return {restaurantsList, totalNumRestaurants}
    } catch (e) {
        console.error(
            `Unable to convert cursor to array of problem counting documents, ${e}`
        )
        return {restaurantsList: [], totalNumRestaurants: 0}
        }
    }

    static async getRestaurantByID(id) {
        try {
          const pipeline = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
                  {
                      $lookup: {
                          from: "reviews",
                          let: {
                              id: "$_id",
                          },
                          pipeline: [
                              {
                                  $match: {
                                      $expr: {
                                          $eq: ["$restaurant_id", "$$id"],
                                      },
                                  },
                              },
                              {
                                  $sort: {
                                      date: -1,
                                  },
                              },
                          ],
                          as: "reviews",
                      },
                  },
                  {
                      $addFields: {
                          reviews: "$reviews",
                      },
                  },
              ]
          return await restaurants.aggregate(pipeline).next()
        } catch (e) {
          console.error(`Something went wrong in getRestaurantByID: ${e}`)
          throw e
        }
      }

    static async getCuisines() {
        let cuisines = []
        try {
            //distinct just returns one of each cuisine
            cuisines = await restaurants.distinct("cuisine")
            return cuisines
        } catch (e) {
            console.log(`Unable to get cuisines : ${e}`)
            return cuisines
        }
    }
}