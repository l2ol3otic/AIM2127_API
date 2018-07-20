const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
var bodyParser = require('body-parser');
var sql = require('mssql');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const sqlConfig = {
  server: '45.77.38.34',
  user: 'sa',
  password: 'critical4875',
  database: 'SP4807',
  encrypt: false,
  //driver: 'MSSQLSERVER',
}
const userTest = {}
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.get('/api/login8', function (req, res) {
  sql.connect(sqlConfig, function () {
    var request = new sql.Request();
    var sd = "admin"
    request.query("select * from dbo.userTest Where = '?'", sd, function (err, result, fields) {
      if (err) console.log(err);
      console.log(result)
      //res.end(JSON.stringify(recordset)); // Result in JSON format
      //sql.close() 

    });

  });
})

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

const serverJWT_Secret = 'kpTxN=)7mX3W3SEJ5@8Ubt.8-';
app.post('/api/loginBase', (req, res) => {

  if (req.body) {
    console.log(req.body)
    const user = appUsers[req.body.email];
    console.log('User', user)
    if (user && user.pw === req.body.password) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.pw;
      const token = jwt.sign(userWithoutPassword, serverJWT_Secret); // <==== The all-important "jwt.sign" function
      res.status(200).send({
        user: userWithoutPassword,
        accessToken: token
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
app.post('/api/login88', (req, res) => {
  if (req.body) {
    var userLogin = "'" + req.body.email + "'"
    var userMemory
    sql.connect(sqlConfig, function () {
      var request = new sql.Request();
      var sqlcommand = "SELECT * FROM dbo.userTest WHERE username = '?' "
      console.log(sqlcommand)
      request.query(sqlcommand, userLogin, function (err, result, fields) {
        if (err) {
          console.log('ERROR808', err);
          sql.close()
        }
        else {
          if (result.recordset[0] == null) {
            sql.close()
            console.log("NULL")
          }
          else {
            sql.close()
            console.log("result.recordset[0]")
          }

        }
        userMemory = result.recordset[0]
        console.log('UserMemory', userMemory)

        if (req.body) {
          const user = userMemory
          console.log('User', user)
          if (user.username && user.password === req.body.password) {
            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password;
            const token = jwt.sign(userWithoutPassword, serverJWT_Secret); // <==== The all-important "jwt.sign" function
            res.status(200).send({
              user: userWithoutPassword,
              accessToken: token
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
    });
  }
  else {
    res.status(403).send({
      errorMessage: 'Please provide email and password'
    });
  }
});
//เช็ค login และสร้าง token ไปเก็บไว้ที่ WeblocalStorge
app.post('/api/login', (req, res) => {
  var userMemory
  if (req.body) {
    var userLogin = req.body.email
    var conn1 = new sql.connect(sqlConfig, function (error) {
      if (error) {
        console.log(error)
      } else {
        var request = new sql.Request(conn1);

        request
          .input('userVerify', sql.NVarChar, userLogin)
          .query('SELECT * from userTest WHERE username = @userVerify ')
          .then(function (data) {
            if (error) {
              console.log('ERROR808', error);
              sql.close()
            }
            else {
              if (data.recordset[0] == null) {
                res.status(403).send({
                  errorMessage: 'Permission denied!'
                });
                sql.close()
                console.log("NULL")
              }
              else {
                sql.close()
                userMemory = data.recordset[0]
                const user = userMemory
                //console.log('User', user)
                if (user.username && user.password === req.body.password) {
                  const userWithoutPassword = { ...user };
                  delete userWithoutPassword.password;
                  const token = jwt.sign(userWithoutPassword, serverJWT_Secret); // <==== The all-important "jwt.sign" function
                  res.status(200).send({
                    user: userWithoutPassword,
                    accessToken: token
                  });
                } else {
                  res.status(403).send({
                    errorMessage: 'Permission denied!'
                  });
                }

              }

            }
          }).catch(function (error) {
            console.log(error);
            sql.close()
          });
      }
    });
  }
  else {
    res.status(403).send({
      errorMessage: 'Please provide email and password'
    });
  }
});

//verify token dev
app.get('/api/getUserVerify', verifyToken, (req, res) => {
  jwt.verify(req.token, serverJWT_Secret, (err, userLogin) => {
    console.log(userLogin)
    if (err) {
      res.sendStatus(403)
    } else {
      res.end(JSON.stringify(userLogin));
    }

  })
})
//Verify Token Base
app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, serverJWT_Secret, (err, authData) => {
    if (err) {
      res.sendStatus(403)
    } else {
      res.json({
        message: 'Post Created...',
        authData
      })
    }

  })
})
function verifyToken(req, res, next) {

  //Get Auth header value
  const bearerHeader = req.headers['authorization'];
  //Check if bearer is underfined
  if (typeof bearerHeader !== 'undefined') {
    console.log(bearerHeader)
    //split at the space
    const bearer = bearerHeader.split(' ')
    // Get token from array
    const bearerToken = bearer[1];
    //Set the token
    req.token = bearerToken;
    //Next middleware
    next();
  } else {
    //Forbidden
    console.log("Forbidden")
    res.sendStatus(403);
  }
}

app.listen(5008, () => console.log('Server started on port 5008'));