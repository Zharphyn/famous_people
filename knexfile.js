// Update with your config settings.
"use strict";
/*jslint node: true */
/*jshint esversion: 6 */

const pg = require("pg");
// settings.json
const settings = require("./settings");

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

module.exports = {
  development: {
    client: 'pg',
    version: '7.2',
    connection: {
      host : client.host,
      user : client.user,
      password : client.password,
      database : client.database
    }
  },
};
