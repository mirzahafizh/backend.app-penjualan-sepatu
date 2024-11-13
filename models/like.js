'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      // Associate with ProdukSepatu (shoe product) and User models
      Like.belongsTo(models.ProdukSepatu, {
        foreignKey: 'product_id',
        onDelete: 'CASCADE', // When the product is deleted, the like is deleted too
        onUpdate: 'CASCADE', // When the product is updated, the like is updated accordingly
      });

      Like.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL', // If the user is deleted, set user_id to NULL (to allow anonymous likes)
        onUpdate: 'CASCADE',
      });
    }
  }

  Like.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'produk_sepatu', // Refers to the 'produk_sepatu' table
          key: 'id',
        },
        onDelete: 'CASCADE', // Cascade on delete for products
        onUpdate: 'CASCADE',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null to enable anonymous likes or handle deleted users
        references: {
          model: 'users', // Refers to the 'users' table
          key: 'id',
        },
        onDelete: 'SET NULL', // Set to NULL if the user is deleted
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'likes', // Ensure table name is explicitly defined as 'likes'
    }
  );

  return Like;
};
