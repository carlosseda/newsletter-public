const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    const Image = sequelize.define('Image', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        imageConfigurationId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        entityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        entity: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        originalFilename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        resizedFilename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        alt: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        languageAlias: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        mediaQuery: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        sizeBytes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        latencyMs: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'images',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "FK_image_resizes_image_configurations",
                using: "BTREE",
                fields: [
                    { name: "imageConfigurationId" },
                ]
            }
        ]
    });

    Image.associate = function(models) {
        Image.belongsTo(models.ImageConfiguration, { foreignKey: 'imageConfigurationId' });
    };

    return Image;
};
