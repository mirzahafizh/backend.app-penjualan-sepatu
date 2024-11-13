'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('produk_sepatu', 'tipe_sepatu', {
      type: Sequelize.ENUM(
        'running shoes', 
        'sneakers', 
        'dress shoes', 
        'sandals', 
        'canvas shoes'
      ),
      allowNull: false, // Ensure this field is required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('produk_sepatu', 'tipe_sepatu');
  }
};