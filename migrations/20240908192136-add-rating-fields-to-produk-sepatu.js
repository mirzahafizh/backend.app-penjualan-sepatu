'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('produk_sepatu', 'ratingCount', {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0, // Initialize with 0
      });

      await queryInterface.addColumn('produk_sepatu', 'totalRating', {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0.0, // Initialize with 0.0
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('produk_sepatu', 'ratingCount');
      await queryInterface.removeColumn('produk_sepatu', 'totalRating');
  }
};
