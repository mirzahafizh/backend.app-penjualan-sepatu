'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('produk_sepatu', 'stok', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // Set a default value if necessary
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('produk_sepatu', 'stok');
  }
};