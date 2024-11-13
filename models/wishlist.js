'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      // Associate with User model
      Wishlist.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      // Associate with ProdukSepatu model
      Wishlist.belongsTo(models.ProdukSepatu, { foreignKey: 'produkSepatuId', as: 'produkSepatu' });
    }
  }

  Wishlist.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Assuming your user table is named 'users'
          key: 'id', // The key in the users table that references this
        },
      },
      produkSepatuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'produk_sepatu', // Assuming your product table is named 'produk_sepatu'
          key: 'id', // The key in the produk_sepatu table that references this
        },
      },
    },
    {
      sequelize,
      modelName: 'Wishlist',
      tableName: 'wishlists', // Ensure the correct table name
      timestamps: true, // Enables createdAt and updatedAt timestamps
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  return Wishlist;
};
