const { Sequelize } = require('sequelize');
const { getDbCredentials } = require('./utils/dbCredentials');

async function connectToDatabase() {
  try {
    const { host, user, password, database } = await getDbCredentials();

    const sequelize = new Sequelize(database, user, password, {
      host,
      dialect: 'mysql',
      logging: false,
    });

    await sequelize.authenticate();
    console.log('✅ Database connection successful.');

    return sequelize;
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    throw error;
  }
}

module.exports = connectToDatabase;
