const express = require('express')
const session = require('express-session')
const passport = require('passport')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

// Load config
dotenv.config({ path: './config/config.env'})

// Passport config
require('./config/passport')(passport)


connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// Method Override
// using this middleware to extract the method we were passing in, put it in a variable and 
app.use(
    methodOverride(function (req, res) {
        // checking to see if there's a body, if that body is an object and if you passed it in a method and then getting rid of it.
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )



// we just want to make sure we're in development mode when we're using morgan
// Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')


// Handlebars - our templating engine
// !Add the word .engine after exphbs
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
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
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
        })
    })
)


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())


// Set Global variable
app.use(function (request, response, next) {
    response.locals.user = request.user || null
    next()
})


// Static
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 4000


app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))


