var db=require('../config/connection')
var collection=require('../config/collections')
var objectId = require('mongodb').ObjectID



module.exports={
    showUser:()=>{
        return new Promise(async(resolve,reject)=>{
            let userItem = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            
            resolve(userItem)
        })
    },

    // need some updtae herer chech if its exist
    viewOrder:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            let order= await db.get().collection(collection.PICKUP_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userid)}
                },
                {
                    $project:{user:1 , data:1}
                }
            ]).toArray()
            
            resolve(order[0].data)
        })
    }
}