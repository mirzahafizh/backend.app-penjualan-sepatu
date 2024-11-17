'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transaksi', 'isRatingEnabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,  // Rating default "on"
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transaksi', 'isRatingEnabled');
  },
};
