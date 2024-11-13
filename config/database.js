const { Sequelize } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize('db_penjualan_sepatu', 'root', 'root', {
    host: '127.0.0.1',
    dialect: 'mysql',
});

// Test the connection (optional, for debugging)
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
