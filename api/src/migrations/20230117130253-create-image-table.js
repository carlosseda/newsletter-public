'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      imageConfigurationId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      entityId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      entity: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      originalFilename: {
        allowNull: false,
        type: Sequelize.STRING
      },
      resizedFilename: {
        allowNull: false,
        type: Sequelize.STRING
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      alt: {
        allowNull: false,
        type: Sequelize.STRING
      },
      languageAlias: {
        allowNull: false,
        type: Sequelize.STRING
      },
      mediaQuery: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sizeBytes: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      latencyMs: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('images');
  }
};
