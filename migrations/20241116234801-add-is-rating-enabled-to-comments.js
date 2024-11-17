'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('comments', 'isRatingEnabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,  // Rating default "on"
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('comments', 'isRatingEnabled');
  },
};
