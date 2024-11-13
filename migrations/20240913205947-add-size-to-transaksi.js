'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('transaksi', 'ukuran', {
          type: Sequelize.STRING, // Adjust type as needed
          allowNull: false,
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('transaksi', 'ukuran');
  }
};