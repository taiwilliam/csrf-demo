const path = require("path");
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

const db_path = path.join(__dirname, "../db/main.json")
const main_db = new JsonDB(new Config(db_path, true, false, '/'));

module.exports = main_db