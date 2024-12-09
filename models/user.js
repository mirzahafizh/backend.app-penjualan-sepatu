'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user', // Default role is user
      },
      image: {  // New image column
        type: DataTypes.STRING,
        allowNull: true, // Change to false if required
      },
      address: { // New address column
        type: DataTypes.STRING,
        allowNull: true, // Change to false if required
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users', // Ensure the correct table name
    }
  );

  return User;
};
