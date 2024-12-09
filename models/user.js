'use strict';
const { Model } = require('sequelize');

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
      image: {  
        type: DataTypes.STRING,
        allowNull: true, 
      },
      address: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: { // New phoneNumber column
        type: DataTypes.STRING,
        allowNull: true, // Set to false if phone number is required
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    }
  );

  return User;
};
