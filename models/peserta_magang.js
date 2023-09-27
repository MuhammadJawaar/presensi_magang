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
      Peserta_Magang.hasMany(models.Presensi, {
        foreignKey: 'p_id', // Name of the foreign key in Presensi table
        as: 'presensimagang', // Alias for the association
      });
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