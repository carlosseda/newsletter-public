const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    const Menu = sequelize.define('Menu', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor, rellena el campo "Nombre".'
                }
            }
        },
        customUrl: {
            type: DataTypes.STRING(255),
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        parentId: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        tableName: 'menus',
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
            }
        ]
    });

    Menu.associate = function(models) {
        Menu.belongsTo(models.Menu, { as: 'parent', foreignKey: 'parentId' });
        Menu.hasMany(models.Menu, { as: 'children', foreignKey: 'parentId' });
    };

    return Menu;
};
