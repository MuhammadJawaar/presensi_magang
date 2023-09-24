'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Peserta_Magang', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING
      },
      asal_univ: {
        type: Sequelize.STRING
      },
      asal_jurusan: {
        type: Sequelize.STRING
      },
      tanggal_mulai: {
        type: Sequelize.DATE
      },
      tanggal_selesai: {
        type: Sequelize.DATE
      },
      status_aktif: {
        type: Sequelize.BOOLEAN
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Peserta_Magangs');
  }
};