'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Keranjang extends Model {
        static associate(models) {
            // Define associations
            Keranjang.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user', // Alias for the association
            });
            Keranjang.belongsTo(models.ProdukSepatu, {
                foreignKey: 'produkSepatuId',
                as: 'produkSepatu', // Alias for the association
            });
        }
    }

    Keranjang.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Reference to Users model
                    key: 'id',
                },
            },
            produkSepatuId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'produk_sepatu', // Reference to produk_sepatu model
                    key: 'id',
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            ukuran: { // New ukuran column
                type: DataTypes.STRING, // Adjust the type as necessary
                allowNull: false, // Set to false if size is mandatory
            },
        },
        {
            sequelize,
            modelName: 'Keranjang',
            tableName: 'keranjang', // Ensure the correct table name
        }
    );

    return Keranjang;
};
