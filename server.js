// Main entry point for the Connect My Dots server.
const bodyParser = require('body-parser');
const express = require('express');
const pg = require('pg');
const pgStore = require('connect-pg-simple');
const session = require('express-session');
const createAuthRoutes = require('./server/auth');

// Compose a postgres session store class
const PgSessionStore = pgStore(session);

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
  store: new PgSessionStore({ pg }),
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

// Add auth routes (sign in, sign out, etc)
createAuthRoutes(app);

// And finally we start listening on the port!
app.listen(app.get('port'), () => {
  console.log(`${APP_NAME} is running on port ${app.get('port')}`);
});
