'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('wishlists', {
          id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true,
              allowNull: false,
          },
          userId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'users', // Sesuaikan dengan nama tabel pengguna Anda
                  key: 'id',
              },
              onDelete: 'CASCADE',
          },
          produkSepatuId: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: 'produk_sepatu', // Sesuaikan dengan nama tabel produk sepatu Anda
                  key: 'id',
              },
              onDelete: 'CASCADE',
          },
          createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
          },
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('wishlists');
  },
};