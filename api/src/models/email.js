const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    const Email = sequelize.define('Email', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        subject: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "El asunto es obligatorio"
                },
                notNull: {
                    args: true,
                    msg: "El asunto es obligatorio"
                }
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "El mensaje es obligatorio"
                },
                notNull: {
                    args: true,
                    msg: "El mensaje es obligatorio"
                }
            }
        }
    }, {
        sequelize,
        tableName: 'emails',
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
        ]
    });

    Email.associate = function(models) {
        Email.hasMany(models.SentEmail, { as: "sentEmails", foreignKey: "emailId"});
    }

    return Email;
};
