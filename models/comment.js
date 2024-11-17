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
      allowNull: true,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRatingEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // default: rating aktif
      allowNull: false,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Kolom ini bersifat opsional
      references: {
        model: 'Transaksi', // Asumsi bahwa Anda memiliki model Transaksi
        key: 'id', // Pastikan key yang digunakan di model Transaksi adalah 'id'
      },
    },
  }, {
    tableName: 'comments',
    modelName: 'Comment',
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.ProdukSepatu, { foreignKey: 'product_id' });
    Comment.belongsTo(models.User, { foreignKey: 'user_id' });
    Comment.belongsTo(models.Transaksi, { foreignKey: 'orderId' }); // Asosiasi dengan model Transaksi
  };

  return Comment;
};
