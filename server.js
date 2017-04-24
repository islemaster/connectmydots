const express = require('express');
const pg = require('pg');

// This is the server for
const APP_NAME = 'Connect My Dots';

// We're using an Express.js node server which was really easy
// to get up and running on Heroku.
const app = express();
app.set('port', process.env.PORT || 5000);

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

// And finally we start listening on the port!
app.listen(app.get('port'), () => {
  console.log('Connect My Dots is running on port', app.get('port'));
});
  
