'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('keranjang', 'ukuran', {
          type: Sequelize.STRING, // Tipe data sesuai dengan model
          allowNull: false, // Set sesuai kebutuhan
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('keranjang', 'ukuran');
  }
};