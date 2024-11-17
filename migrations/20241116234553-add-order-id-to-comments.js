'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('comments', 'orderId', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Menyesuaikan dengan kebutuhan Anda apakah orderId bisa null atau tidak
      references: {
        model: 'Transaksi',  // Nama tabel yang sesuai untuk order, ganti dengan tabel yang sesuai
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('comments', 'orderId');
  },
};
