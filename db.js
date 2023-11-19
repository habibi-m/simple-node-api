const { Client } = require("pg");

const user = 'azmoon';
const host = 'localhost';
const database = 'mock-db';
const password = 'azm00n';
const port = '5432';
 
const client = new Client({
  user,
  host,
  database,
  password,
  port,
});
 
client.connect();
module.exports = client;