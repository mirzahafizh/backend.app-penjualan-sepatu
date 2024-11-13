'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transaksi', 'status_pengiriman', {
      type: Sequelize.ENUM('di proses', 'dikirim', 'diterima'),
      allowNull: false,
      defaultValue: 'di proses', // Set default value if necessary
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transaksi', 'status_pengiriman');
  },
};