'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize'); // Import Sequelize

module.exports = (sequelize) => {
    class Transaksi extends Model {
        static associate(models) {
            // Define associations
            Transaksi.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user', // Alias for User association
            });
            Transaksi.belongsTo(models.ProdukSepatu, {
                foreignKey: 'produkSepatuId', // Updated foreignKey name to match field in table
                as: 'produkSepatu', // Alias for ProdukSepatu association
            });
        }
    }

    Transaksi.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Reference to Users model
                    key: 'id',
                },
                onDelete: 'CASCADE', // Optional: Ensure transactions are deleted if user is deleted
            },
            produkSepatuId: { // Corrected field name to match association
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'produk_sepatu', // Reference to ProdukSepatu table
                    key: 'id',
                },
                onDelete: 'CASCADE', // Optional: Ensure transactions are deleted if product is deleted
            },
            totalAmount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            paymentStatus: {
                type: DataTypes.ENUM('settlement', 'pending'),
                allowNull: false,
                defaultValue: 'pending',
            },
            paymentMethod: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            transactionDate: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW, // Automatically set the current date and time
            },
            status_pengiriman: {
                type: DataTypes.ENUM('di proses', 'dikirim', 'diterima'), // Shipping status
                allowNull: false,
                defaultValue: 'di proses', // Set default value for shipping status
            },
            ukuran: { // Add the size field
                type: DataTypes.STRING, // Adjust type as needed (STRING for sizes like "42", "M", etc.)
                allowNull: false,
            },
            isRatingEnabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: true, // default: rating aktif
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Transaksi',
            tableName: 'transaksi', // Ensure the correct table name in the database
            timestamps: false, // Disable default createdAt/updatedAt timestamps (if not needed)
        }
    );

    return Transaksi;
};
