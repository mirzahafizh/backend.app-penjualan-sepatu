'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProdukSepatu extends Model {
    static associate(models) {
      // Define associations here, if any
    }
  }

  ProdukSepatu.init(
    {
      ukuran: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings
        allowNull: false,
      },
      stok: {
        type: DataTypes.JSON, // JSON type to store an array of stock values
        allowNull: false,
        defaultValue: JSON.stringify([]), // Default to an empty array
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      ratingCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Initialize with 0
      },
      totalRating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0, // Initialize with 0.0
      },
      nama_sepatu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      harga: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      diskon: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tipe_sepatu: {
        type: DataTypes.ENUM(
          'running shoes', 
          'sneakers', 
          'dress shoes', 
          'sandals', 
          'canvas shoes' // Add more types as needed
        ),
        allowNull: false, // Ensure this field is required
      },
    },
    {
      sequelize,
      modelName: 'ProdukSepatu',
      tableName: 'produk_sepatu', // Ensure the correct table name
      timestamps: true, // Enables createdAt and updatedAt timestamps
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  return ProdukSepatu;
};
