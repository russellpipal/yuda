var pg = require('pg');

var connectionString;

if (process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = "postgres://localhost:5432/yuda";
}

function initializeDB(){
  return new Promise(function(resolve, reject) {
    pg.connect(connectionString, function(err, client, done){
      if(err){
        console.log('Error connecting to DB!', err);
        reject(Error(err));
        process.exit(1);

      } else {

        var userTable, goalTable, friendTable;

        var userTable = 'CREATE TABLE IF NOT EXISTS users (' +
          'id SERIAL PRIMARY KEY,' +
          'username varchar(20) NOT NULL,' +
          'first_visit date,' +
          'last_visit date,' +
          'password varchar(255));';

        var goalTable = 'CREATE TABLE IF NOT EXISTS goal (' +
          'id SERIAL PRIMARY KEY,' +
          'goal_name varchar(50) NOT NULL,' +
          'goal_desc varchar(255),' +
          'starting_date date,' +
          'ending_date date,' +
          'past_deadline boolean,' +
          'user_id INT REFERENCES users(id),' +
          'completed_date date);';

        var friendTable = 'CREATE TABLE IF NOT EXISTS user_goal (' +
          'id SERIAL PRIMARY KEY,' +
          'goal_id INT REFERENCES goal(id),' +
          'user_id INT REFERENCES users(id),' +
          'viewed boolean);';

        var query = client.query(userTable + goalTable + friendTable);

        query.on('end', function(){
          console.log('tables created');
          resolve();
          done();
        });


        query.on('error', function(err) {
          console.log('Error executing query', err);
          reject(Error(err));
        });
      }

    });
  });
}

module.exports.connectionString = connectionString;
module.exports.initializeDB = initializeDB;
