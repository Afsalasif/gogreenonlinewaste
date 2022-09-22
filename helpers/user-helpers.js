var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectID
const { UnavailableForLegalReasons } = require('http-errors')
const  ObjectId  = require('mongodb')
const  response  = require('express')
const { promiseImpl } = require('ejs')

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })

        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let logginStatus = false
            let response = {}
            let rea = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("susccessese");
                        response.user = user
                        response.status = true
                        resolve(response)
                    }
                    else {
                        rea.reason = 'password incorrect'
                        rea.status = false
                        console.log("failed");
                        resolve(rea)
                        console.log(rea);
                    }
                })
            } else {
                console.log('emial nahi')
                resolve({ status: false })
            }
        })
    },
    doPickup: (userData, userid) => {
        return new Promise(async (resolve, reject) => {
            let userCart=await db.get().collection(collection.PICKUP_COLLECTION).findOne({user:objectId(userid)})
           if(userCart){
            resolve({ status: false })
            console.log("exissssssss");

           } else{
            let cartObJ = {
                    user:objectId(userid),
                    data: userData
                }
                db.get().collection(collection.PICKUP_COLLECTION).insertOne(cartObJ).then((response) => {
                    resolve()
                })
            }


            

        })

    },
    addTocart:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.PICKUP_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $project:{user:1, data:1}
                }
            ]).toArray()
            
            
            resolve(cartItems[0].data)

            
        })




    },
    deletePickup:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            
            db.get().collection(collection.PICKUP_COLLECTION).deleteOne({user:objectId(userId)}).then(()=>{
                console.log("deleted success");
                resolve()
            })

            

        })
    },
    checkCart:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            let cart=false
            let userCart=await db.get().collection(collection.PICKUP_COLLECTION).findOne({user:objectId(userid)})
            if(userCart){
                cart=true
                resolve (cart)
            }else{
                resolve(cart)
            }
            
        })
    },
    placeOrder:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            let i =await db.get().collection(collection.ORDER_COLLECTION).findOne({user:objectId(userid)})
            if(i){
                resolve({order:true})
            }else{
            let done=await db.get().collection(collection.PICKUP_COLLECTION).findOne({user:objectId(userid)})
            db.get().collection(collection.ORDER_COLLECTION).insertOne(done).then(()=>{
                db.get().collection(collection.PICKUP_COLLECTION).deleteOne({user:objectId(userid)})
                console.log(done.data);
                resolve(done.data)
            
            })
        }
        })
    },
    showOrder:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({user:objectId(userid)}).toArray()
            console.log(orders);
            resolve(orders)
            
        })
    }


}