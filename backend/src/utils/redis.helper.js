import redisClient from "../config/redis.js";

class RedisHelper {
    constructor() {
    redisClient.connect();
    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    redisClient.on("connect", () => console.log("Redis Client Connected"));
    }
    async set(key, value) {
        try {
            const jsonValue = JSON.stringify(value);
            const result = await redisClient.setEx(key,jsonValue);
            return result;
        } catch (error) {
             console.log("Error setting value in redis", error);
            return null;
        }
    }
    async get(key) {
        try {
            return await redisClient.get(key);
        } catch (error) {
            console.log("Error getting value from redis", error);
            return null;
        }
    }
    async expire(key, seconds) {
        try {
            return await redisClient.expire(key, seconds);
        } catch (error) {
            console.log("Error expiring key in redis", error);
            return null;
        }
    }
    async del(key) {
        try {
            return await redisClient.del(key);
        } catch (error) {
            console.log("Error deleting value from redis", error);
            return null;
        }
    }
    async exists(key) {
        try {
            return await redisClient.exists(key);
        } catch (error) {
            console.log("Error checking existence of key in redis", error);
            return null;
        }
    }
    async keys(pattern){
        try {
            return await redisClient.keys(pattern);
        } catch (error) {
            console.log("Error getting keys from redis", error);
            return null;
        }
    } 
    async pushInList(key,value,maxSize=50){
        try {
             await redisClient.rPush(key,value);
             await redisClient.lTrim(key,-maxSize,-1);
             return true;
        } catch (error) {
            console.log("Error pushing values to list in redis", error);
            return null;
        }
    }
    async popFromList(key){
        try {
            return await redisClient.rPop(key);
        } catch (error) {
            console.log("Error popping values from list in redis", error);
            return null;
        }
    }
    async getList(key) {
        try {
            return await redisClient.lRange(key,0,-1);
        } catch (error) {
            console.log("Error getting list from Redis", error);
            return null;
        }
    }
    

}

const redisHelper = new RedisHelper();
export default redisHelper;