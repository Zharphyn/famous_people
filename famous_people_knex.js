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

var knex = require('knex')({
  client: 'pg',
  version: '7.2',
  connection: {
    host : client.host,
    user : client.user,
    password : client.password,
    database : client.database
  }
});



const dateFormat = 'yyyy-mm-dd';

function formatDate(date) {
  const month = (date.getMonth() + 1).toString().padStart(2,"0");
  const year = date.getFullYear().toString();
  const day = date.getDate().toString().padStart(2,"0");

  return `${year}-${month}-${day}`;
}

const error = (err) => {
  return console.error("error running query", err);
};

const select = (name) => {
  knex.select('*').from('famous_people')
    .where('first_name', name)
    .orWhere('last_name', name)
    .asCallback(function(err,result) {
      if (err) {
        return error(err);
      }
      let birthdate = new Date(result.rows[0].birthdate);
      birthdate = formatDate(birthdate);
      return `${result.rows[0].id}: ${result.rows[0].first_name} ${result.rows[0].last_name}, born '${birthdate}'`;
    });
};

const insert = (arr) => {
  let birthday = new Date(arr[2]);

  knex('famous_people').insert([{first_name: arr[0],last_name: arr[1],birthdate: birthday}]).asCallback(function(err,result){
      if (err) {
        return error(err);
      }
      return 'New famous person inserted';
  });

};

client.connect((err) => {
  const args = process.argv.slice(2);

  if (err) {
    return console.error("Connection Error", err);
  }

  if (args.length === 1) {
    console.log(select(args[0]));
  } else if (args.length >= 3) {
    console.log(insert(args));
  }

});