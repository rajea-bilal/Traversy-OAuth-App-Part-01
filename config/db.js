const mongoose = require('mongoose')

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB Connected: ${conn.connection.host}`)

    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

// we're exporting the function connectDB and then import it elsewhere.
module.exports = connectDB