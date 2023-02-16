'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      surname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      identifyNumber: {
        type: Sequelize.STRING
      },
      startingServiceDate: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      onService: {
        type: Sequelize.BOOLEAN
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      postalCode: {
        type: Sequelize.STRING
      },
      township: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  }
};
