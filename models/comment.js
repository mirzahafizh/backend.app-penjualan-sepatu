'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ProdukSepatu',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow anonymous comments
      references: {
        model: 'User',
        key: 'id',
      },
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});

  Comment.associate = function(models) {
    Comment.belongsTo(models.ProdukSepatu, { foreignKey: 'product_id' });
    Comment.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Comment;
};