/* eslint-disable prettier/prettier */
module.exports = function (sequelize, DataTypes) {
  let RecipeIngredient = sequelize.define("RecipeIngredient", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 300]
      }
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  RecipeIngredient.associate = function (models) {
    // an ingredient belongs to a user
    RecipeIngredient.belongsTo(models.Recipe, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return RecipeIngredient;
};
