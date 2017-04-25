const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require('express');
const pg = require('pg');
const session = require('express-session');

// This is the server for
const APP_NAME = 'Connect My Dots';

// We're using an Express.js node server which was really easy
// to get up and running on Heroku.
const app = express();
app.set('port', process.env.PORT || 5000);

// Configure our server to read JSON and urlencoded requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Enable sessions (so users can log in)
app.use(session({
  name: 'cmd-session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// It doesn't do much yet - just serves our static-built app
// from the build directory.  
app.use(express.static(`${__dirname}/build`));

// We depend on this static build running before the server
// starts, in the npm postinstall hook or by some other means.
// See package.json's "scripts" key and this article
// https://devcenter.heroku.com/articles/node-best-practices#hook-things-up
// for more details.

// The root route returns the index page for our single-page app.
app.get('/', (request, response) => {
  response.sendfile('index.html');
  response.type('text/html');
});

// Test route for database connection
app.get('/db', (request, response) => {
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    client.query('select * from account', (err, result) => {
      done();
      if (err) {
        console.error(err);
        response.send("Error " + err);
      } else {
        response.send(JSON.stringify({results: result.rows}));
        response.end();
      }
    });
  });
});

// GET /sign-in
// Retrieve the user's current sign-in state.
app.get('/sign-in', (request, response) => {
  response.json({
    current_user: request.session.current_user,
    result: request.session.current_user
      ? `Signed in as ${request.session.current_user}.`
      : `Signed out.`
  });
});

app.post('/sign-in', (request, response) => {
  // Already signed in?  Succeed immediately.
  if (request.session.current_user) {
    response.json({
      current_user: request.session.current_user,
      result: `Already signed in as ${request.session.current_user}.`
    });
    return;
  }

  if (!request.body) {
    // Totally malformed
    response.sendStatus(400);
    return;
  }

  const id = (request.body['user-id'] || '').toLowerCase();
  const password = request.body['password'] || '';

  // Look up the user
  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    client.query('select password from account where id = $1 limit 1', [id], (err, result) => {
      done();

      // User does not exist
      if (result.rows.length <= 0) {
        response.status(400).json({
          field: 'general',
          error: 'Incorrect username or password.'
        });
        return;
      }

      // Check the password
      bcrypt.compare(password, result.rows[0].password, (err, isMatch) => {
        if (err) {
          console.error(err);
          response.status(500).send('Error ' + err);
          return;
        }

        if (!isMatch) {
          response.status(400).json({
            field: 'general',
            error: 'Incorrect username or password.'
          });
          return;
        }

        request.session.current_user = id;
        response.json({
          current_user: id,
          result: `User ${id} signed in.`
        });
      });
    });
  });
});

function signOutHandler(request, response) {
  delete request.session.current_user;
  response.json({
    current_user: null,
    result: 'Signed out.'
  });
}
app.post('/sign-out', signOutHandler);
app.get('/sign-out', signOutHandler);

app.post('/sign-up', (request, response) => {
  if (!request.body) {
    // Totally malformed
    response.sendStatus(400);
    return;
  }

  const id = (request.body['user-id'] || '').toLowerCase();
  const password = request.body['password'];
  const confirmPassword = request.body['confirm-password'];

  // Username too short
  if (id.length <= 0) {
    response.status(400).json({
      field: 'user-id',
      error: 'User id is too short.'
    });
    return;
  }

  // Password too short
  if (!password || password.length <= 0) {
    response.status(400).json({
      field: 'password',
      error: 'Password is too short.'
    });
    return;
  }

  // Passwords don't match
  if (!confirmPassword || password != confirmPassword) {
    response.status(400).json({
      field: 'confirm-password',
      error: 'Passwords do not match.'
    });
    return;
  }

  pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    client.query('select id from account where id = $1', [id], (err, result) => {

      // User id is taken
      if (result.rows.length > 0) {
        done();
        response.status(400).json({
          field: 'user-id',
          error: `The user id ${id} is already taken.`
        });
        return;
      }

      // Everything looks good, let's insert the new user into the database
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error(err);
          response.status(500).send('Error ' + err);
          return;
        }

        client.query(
          'insert into account (id, password) values ($1, $2)',
          [id, hash],
          err => {
            done();
            if (err) {
              console.error(err);
              response.status(500).send("Error " + err);
              return;
            }

            request.session.current_user = id;
            response.json({
              current_user: id,
              result: `User ${id} created.`
            });
          });
      });
    });
  });
});

// And finally we start listening on the port!
app.listen(app.get('port'), () => {
  console.log('Connect My Dots is running on port', app.get('port'));
});
  
