const mongoose = require('mongoose')

//db connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://akashbind12:akbind123@ac-7frl2xo-shard-00-00.rzyimmy.mongodb.net:27017,ac-7frl2xo-shard-00-01.rzyimmy.mongodb.net:27017,ac-7frl2xo-shard-00-02.rzyimmy.mongodb.net:27017/?ssl=true&replicaSet=atlas-qbkj0m-shard-0&authSource=admin&retryWrites=true&w=majority")
        console.log(`Mongodb connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in Connecting Database: ${error}`);
    }
}

module.exports = connectDB