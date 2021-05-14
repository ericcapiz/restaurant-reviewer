import API from '../util/api.js'

class RestaurantDataService {
    getAll(page = 0 ){
        return API.get(`?page=${page}`);
    }

    get(id){
        return API.get(`/id/${id}`);
    }

    find(query, by = "name", page = 0){
        return API.get(`?${by}=${query}&${page}`)
    }

    createReview(data){
        return API.post("/review", data)
    }

    updateReview(data){
        return API.put("/review", data)
    }

    deleteReview(id, userId){
        return API.delete(`/review?id=${id}`,  {data:{user_id: userId}})
    }

    getCuisines(){
        return API.get(`/cuisines`)
    }
}

export default new RestaurantDataService();