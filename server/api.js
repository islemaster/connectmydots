// Connect my Dots /api routes
// Used for interacting with network map save data
const pg = require('pg');

module.exports = function createApiRoutes(app) {
  // Debug routes
  if (process.env.NODE_ENV !== 'production') {
    app.get('/maps', (request, response) => {
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
  }
};
