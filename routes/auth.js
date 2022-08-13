const express = require('express')
const router = express.Router()
const passport = require('passport')



// @desc Auth with Google
// route GET/auth/google
router.get('/google', passport.authenticate
('google', { scope: ['profile'] }))

// @desc gGoogle auth callback
// @route GET /auth/google/callback

router.get('/google/callback', passport.authenticate
('google', { failureRedirect: '/'}), 
(request, response) => {
    response.redirect('/dashboard')
}) 

// @desc Logout User
// @route /auth/logout

router.get('/logout', (request, response, next)=> {
    request.logout(function(err) {
        if(err) { return next(err)}
        response.redirect('/')
    })
})

module.exports = router