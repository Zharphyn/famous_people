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

const dateFormat = 'yyyy-mm-dd';

function formatDate(date) {
  const month = (date.getMonth() + 1).toString().padStart(2,"0");
  const year = date.getFullYear().toString();
  const day = date.getDate().toString().padStart(2,"0");

  return `${year}-${month}-${day}`;
}

client.connect((err) => {
  const name = process.argv.slice(2);

  if (err) {
    return console.error("Connection Error", err);
  }
  const query = `SELECT * FROM famous_people WHERE first_name = '${name}' OR last_name = '${name}'`;
  client.query(query, (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    let birthdate = new Date(result.rows[0].birthdate);
    birthdate = formatDate(birthdate);
    const output = `${result.rows[0].id}: ${result.rows[0].first_name} ${result.rows[0].last_name}, born '${birthdate}'`;

    console.log(output);
    client.end();
  });
});