const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
var bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

const appUsers = {
  'max@gmail.com': {
    name: 'Max Miller',
    pw: '1234' // YOU DO NOT WANT TO STORE PW's LIKE THIS IN REAL LIFE - HASH THEM FOR STORAGE
  },
  'lily@gmail.com': {
    name: 'Lily Walter',
    pw: '1235' // YOU DO NOT WANT TO STORE PW's LIKE THIS IN REAL LIFE - HASH THEM FOR STORAGE
  }
};

const serverJWT_Secret = 'kpTxN=)7mX3W3SEJ58Ubt8-';

app.post('/api/login', (req, res) => {

  if (req.body) {
    console.log(req.body)
    const user = appUsers[req.body.email];
    console.log('User',user)
    if (user && user.pw === req.body.password) {
      const userWithoutPassword = {...user};
      delete userWithoutPassword.pw;
      const token = jwt.sign(userWithoutPassword, serverJWT_Secret); // <==== The all-important "jwt.sign" function
      res.status(200).send({
        user: userWithoutPassword,
        token: token
      });
    } else {
      res.status(403).send({
        errorMessage: 'Permission denied!'
      });
    }
  } else {
    res.status(403).send({
      errorMessage: 'Please provide email and password'
    });
  }

});
app.post('/api/posts', verifyToken, (req,res) => {
  jwt.verify(req.token, serverJWT_Secret,(err,authData) => {
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

app.listen(5008, () => console.log('Server started on port 5000'));