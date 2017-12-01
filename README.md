# Connect My Dots  &ctdot; [![Build Status](https://travis-ci.org/islemaster/connectmydots.svg?branch=master)](https://travis-ci.org/islemaster/connectmydots)
Network visualization for arts entrepreneurs

## Development build
Prerequisites: [Node 6](https://nodejs.org), [Yarn](https://yarnpkg.com), [PostgreSQL 9](https://www.postgresql.org/), [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

Initial set-up:
1. Install dependencies: `yarn` at the repository root
2. Create a database from the schema in connectmydots.sql
3. Make a local `.env` file with `DATABASE_URL` and `SESSION_SECRET` keys
4. Do a build and start the static build watcher with `gulp` (then Ctrl+C if you don't want the watcher)
5. Run the server with `heroku local`
6. Open `localhost:5000` in your browser
