// Connect My Dots /auth routes
const bcrypt = require('bcryptjs');
const pg = require('pg');

module.exports = function createAuthRoutes(app) {
  // GET /auth/sign-in
  // Retrieve the user's current sign-in state.
  app.get('/auth/sign-in', (request, response) => {
    response.json({
      currentUser: request.session.currentUser,
      result: request.session.currentUser
        ? `Signed in as ${request.session.currentUser.id}.`
        : `Signed out.`
    });
  });

  // POST /auth/sign-in
  // Attempt to sign the user in
  // Expects user-id and password
  app.post('/auth/sign-in', (request, response) => {
    // Already signed in?  Succeed immediately.
    if (request.session.currentUser) {
      response.json({
        currentUser: request.session.currentUser,
        result: `Already signed in as ${request.session.currentUser.id}.`
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
      client.query('select password, profile from account where id = $1 limit 1', [id], (err, result) => {
        done();

        // User does not exist
        if (result.rows.length <= 0) {
          response.status(400).json({
            field: 'general',
            error: 'Incorrect username or password.'
          });
          return;
        }

        const hash = result.rows[0].password;
        const profile = result.rows[0].profile;

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

          request.session.currentUser = Object.assign({}, {id}, profile);
          response.json({
            currentUser: request.session.currentUser,
            result: `User ${id} signed in.`
          });
        });
      });
    });
  });

  // GET/POST /auth/sign-out
  // End the user's session
  app.post('/auth/sign-out', signOutHandler);
  app.get('/auth/sign-out', signOutHandler);
  function signOutHandler(request, response) {
    delete request.session.currentUser;
    response.json({
      currentUser: null,
      result: 'Signed out.'
    });
  }

  // POST /auth/sign-up
  // Create a new user
  // Expects user-id, password, and confirm-password
  app.post('/auth/sign-up', (request, response) => {
    if (!request.body) {
      // Totally malformed
      response.sendStatus(400);
      return;
    }

    const id = (request.body['user-id'] || '').toLowerCase();
    const password = request.body['password'];
    const confirmPassword = request.body['confirm-password'];
    const profile = {
      displayName: request.body['display-name'],
      isEmailOkay: request.body['is-email-okay'],
    };

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
    if (!confirmPassword || password !== confirmPassword) {
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
            'insert into account (id, password, profile) values ($1, $2, $3)',
            [id, hash, profile],
            err => {
              done();
              if (err) {
                console.error(err);
                response.status(500).send("Error " + err);
                return;
              }

              request.session.currentUser = Object.assign({}, {id}, profile);
              response.json({
                currentUser: request.session.currentUser,
                result: `User ${id} created.`
              });
            });
        });
      });
    });
  });

  // Debug routes
  if (process.env.NODE_ENV !== 'production') {
    // GET /auth/users
    // List all Users in the database
    app.get('/auth/users', (request, response) => {
      pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        client.query('select id from account', (err, result) => {
          done();
          if (err) {
            console.error(err);
            response.send("Error " + err);
          } else {
            response.send(JSON.stringify({users: result.rows}));
            response.end();
          }
        });
      });
    });
  }
};
