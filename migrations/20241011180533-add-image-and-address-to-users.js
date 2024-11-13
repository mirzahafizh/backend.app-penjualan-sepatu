'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'image', {
      type: Sequelize.STRING,
      allowNull: true, // Change to false if required
    });
    await queryInterface.addColumn('users', 'address', {
      type: Sequelize.STRING,
      allowNull: true, // Change to false if required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'image');
    await queryInterface.removeColumn('users', 'address');
  },
};