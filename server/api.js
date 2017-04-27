// Connect my Dots /api routes
// Used for interacting with network map save data
const pg = require('pg');

module.exports = function createApiRoutes(app) {

  // GET /api/map/latest
  // Retrieve the current user's most recently edited map
  app.get('/api/map/latest', (request, response) => {
    const owner = request.session.currentUser.id;

    if (!owner) {
      response.sendStatus(403);
      return;
    }

    pg.connect(process.env.DATABASE_URL, (err, client, done) => {
      client.query(
        'select id, data, name from map where owner = $1 order by last_update desc limit 1',
        [owner],
        (err, result) => {
          done();
          if (err) {
            console.error(err);
            response.status(500).send('Error: ' + err);
          } else if (result.rowCount < 1) {
            response.sendStatus(404);
          } else {
            response.json({
              map_id: result.rows[0].id,
              name: result.rows[0].name,
              data: result.rows[0].data,
            });
          }
        }
      )
    });
  });

  // GET /api/map/<uuid>
  // Retrieve a map object
  // Only available to the map owner, all others receive a 404.
  app.get('/api/map/:uuid', (request, response) => {
    const id = request.params.uuid;
    const owner = request.session.currentUser.id;

    // TODO: We will eventually allow sharing, in which case a more granular approach is called for.
    if (!owner) {
      response.sendStatus(404);
      return;
    }

    pg.connect(process.env.DATABASE_URL, (err, client, done) => {
      client.query(
        'select id, data, name from map where id = $1 and owner = $2 limit 1',
        [id, owner],
        (err, result) => {
          done();
          if (err) {
            console.error(err);
            response.status(500).send('Error: ' + err);
          } else if (result.rowCount < 1) {
            response.sendStatus(404);
          } else {
            response.json({
              map_id: id,
              name: result.rows[0].name,
              data: result.rows[0].data,
            });
          }
        }
      )
    });
  });

  // POST /api/map/<uuid>
  // Edit a map object
  app.post('/api/map/:uuid', (request, response) => {
    const id = request.params.uuid;
    const owner = request.session.currentUser.id;
    const data = request.body['data'];

    // You must be logged in to edit a map
    if (!owner) {
      response.sendStatus(403);
      return;
    }

    // Map ids are always UUIDs in the format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
    if (!/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(id)) {
      response.sendStatus(404);
      return;
    }

    pg.connect(process.env.DATABASE_URL, (err, client, done) => {
      client.query(
        'update map set data = $1, last_update = now() where id = $2 and owner = $3',
        [data, id, owner],
        (err, result) => {
          done();
          if (err) {
            console.error(err);
            response.status(500).send('Error: ' + err);
          } else if (result.rowCount < 1) {
            response.sendStatus(404);
          } else {
            response.json({
              map_id: id,
              result: 'Map updated.',
            });
          }
        }
      );
    });
  });

  // POST /api/map
  // Create a new map object
  app.post('/api/map', (request, response) => {
    const owner = request.session.currentUser.id;
    const data = request.body['data'];

    // You must be logged in to create a map
    if (!owner) {
      response.sendStatus(403);
      return;
    }

    pg.connect(process.env.DATABASE_URL, (err, client, done) => {
      client.query(
        'insert into map (owner, data, name) values ($1, $2, $3) returning id',
        [owner, data, 'My network map'],
        (err, result) => {
          done();
          if (err) {
            console.error(err);
            response.status(500).send('Error: ' + err);
          } else {
            response.json({
              map_id: result.rows[0].id,
              result: 'Map created.',
            });
          }
        }
      );
    });
  });

  // Debug routes
  if (process.env.NODE_ENV !== 'production') {
    // List all maps in the database
    app.get('/api/maps', (request, response) => {
      pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        client.query('select * from map', (err, result) => {
          done();
          if (err) {
            console.error(err);
            response.send("Error " + err);
          } else {
            response.send(JSON.stringify({maps: result.rows}));
            response.end();
          }
        });
      });
    });

    app.delete('/api/map/:uuid', (request, response) => {
      pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        client.query('delete from map where id = $1', [request.params.uuid], (err, result) => {
          done();
          if (err) {
            console.error(err);
            response.status(500).send(err);
          } else {
            response.json({
              result: `Deleted map ${request.params.uuid}.`
            });
          }
        });
      });
    });
  }
};
