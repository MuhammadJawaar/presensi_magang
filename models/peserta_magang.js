'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Peserta_Magang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Peserta_Magang.init({
    nama: DataTypes.STRING,
    asal_univ: DataTypes.STRING,
    asal_jurusan: DataTypes.STRING,
    tanggal_mulai: DataTypes.DATE,
    tanggal_selesai: DataTypes.DATE,
    status_aktif: DataTypes.BOOLEAN,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Peserta_Magang',
  });
  return Peserta_Magang;
};