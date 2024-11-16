'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ProdukSepatu', // Pastikan nama model yang benar
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow anonymous comments
      references: {
        model: 'User', // Pastikan nama model yang benar
        key: 'id',
      },
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'comments', // Nama tabel yang sesuai dengan konvensi snake_case
    modelName: 'Comment', // Nama model sesuai dengan PascalCase
  });
  

  Comment.associate = function(models) {
    // Definisikan asosiasi antara model
    Comment.belongsTo(models.ProdukSepatu, { foreignKey: 'product_id' });
    Comment.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Comment;
};
