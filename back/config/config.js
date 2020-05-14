const dotenv = require('dotenv');
dotenv.config();


module.exports = {
  "development": {
    "username": "admin",
    "password": process.env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "database-1.czirhn72iubo.ap-northeast-2.rds.amazonaws.com",
    "dialect": "mysql",
    "operatorsAliases": '0'
  },
  "test": {
    "username": "admin",
    "password": process.env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "database-1.czirhn72iubo.ap-northeast-2.rds.amazonaws.com",
    "dialect": "mysql",
    "operatorsAliases": '0'
  },
  "production": {
    "username": "admin",
    "password": process.env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "database-1.czirhn72iubo.ap-northeast-2.rds.amazonaws.com",
    "dialect": "mysql",
    "operatorsAliases": '0'
  }
}

