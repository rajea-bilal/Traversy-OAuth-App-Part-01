const express = require('express')
const session = require('express-session')
const passport = require('passport')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env'})

// Passport config
require('./config/passport')(passport)


connectDB()

const app = express()

// we just want to make sure we're in development mode when we're using morgan
// Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars - our templating engine
// !Add the word .engine after exphbs
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: 'hbs'
})
)
app.set('view engine', '.hbs')

// Sessions 
app.use(
    session({
    secret: 'keyboard cat',
    resave: false, 
    saveUninitialized: false,
    })
)


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))




const PORT = process.env.PORT || 4000


app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))