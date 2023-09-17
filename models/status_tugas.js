'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status_tugas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Status_tugas.init({
    p_id: DataTypes.INTEGER,
    t_id: DataTypes.INTEGER,
    status_pengerjaan: DataTypes.BOOLEAN,
    status_verifikasi: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Status_tugas',
  });
  return Status_tugas;
};