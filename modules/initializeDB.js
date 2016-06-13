var pg = require('pg');

var connectionString;

if (process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  console.log('environment var');
  connectionString = process.env.DATABASE_URL;
} else {
  console.log('local var');
  connectionString = "postgres://localhost:5432/yuda";
}

function initializeDB(){
  return new Promise(function(resolve, reject) {
    pg.connect(connectionString, function(err, client, done){
      console.log('connected to pg');
      if(err){
        console.log('Error connecting to DB!', err);
        reject(Error(err));
        process.exit(1);

      } else {

        var userTable, goalTable, friendTable;
        // add queries here
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
