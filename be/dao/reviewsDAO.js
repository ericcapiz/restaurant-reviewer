import { text } from 'express'
import mongo from 'mongodb'
const ObjectId = mongodb.ObjectId

let reviews
export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return
        }
        try {
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`)
        }
    }

    static async addReview(restaurantId, user, review, date){
        try {
            const reviewDoc = {
                name: user.name, 
                user_id: user._id,
                date:date,
                text:review,
                restaurant_Id: ObjectId(restaurantId),
            }

            return await reviews.insertOne(reviewDoc)
        } catch (e) {
            console.error(`Unable to post review: ${e}`)
            return {error: e}
        }
    }

    static async updateReview(userId, reviewId, date){
        try {
            const updateResponse = await reviews.updateOne(
                //matching the review with the review id to make sure correct review is being updated
                {user_id: userId, _id:ObjectId(reviewId)},
                //posting the new updated with the new text/date
                { $set: {text: text, date: date}},
                )

                return updateResponse
        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return {error: e}
        }
    }

    static async deleteReview( userId, reviewId){
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId,
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return {error: e}
        }
    }
}