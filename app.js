 const express = require('express');
 const jwt = require('jsonwebtoken');

 const app = express();

 app.get('/api',(req,res) => {
     res.json({
         message: 'wellcome to the API'
     })
 })

 app.post('/api/posts', verifyToken, (req,res) => {
     jwt.verify(req.token, 'secretkey',(err,authData) => {
         if(err){
             res.sendStatus(403)
         }else{
            res.json({
                message:'Post Created...',
                authData
            })
         }

     })
 })

 app.post('/api/login',(req,res) => {
     //Mock User
     const user = {
         id: 1,
         username: 'arm',
         email: 'brad@gmail.com'
     }

    jwt.sign({user}, 'secretkey',(err, token) => {
        res.json({
            token
        })
    });
})
// Format OF TOKET
// Autheorization: Bearer <access_token>
//VerifyToken
function verifyToken(req, res, next){
    //Get Auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is underfined
    if(typeof bearerHeader !== 'undefined'){
        //split at the space
        const bearer = bearerHeader.split(' ')
        // Get token from array
        const bearerToken = bearer[1];
        //Set the token
        req.token = bearerToken;
        //Next middleware
        next();
    }else{
        //Forbidden
        res.sendStatus(403);
    }
}
 app.listen(5001,() => console.log('server started on port 5001'));