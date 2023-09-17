'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Presensi.init({
    waktu: DataTypes.DATE,
    image_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Presensi',
  });
  return Presensi;
};