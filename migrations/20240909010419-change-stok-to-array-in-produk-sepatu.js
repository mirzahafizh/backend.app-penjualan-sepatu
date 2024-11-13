'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change 'stok' column to JSON type
    await queryInterface.changeColumn('produk_sepatu', 'stok', {
      type: Sequelize.JSON, // Use JSON type
      allowNull: false,
      defaultValue: JSON.stringify([]), // Set default value to an empty JSON array
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert 'stok' column back to a single integer type
    await queryInterface.changeColumn('produk_sepatu', 'stok', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // or any default value you want
    });
  },
};