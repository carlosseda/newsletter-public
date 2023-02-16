const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    const SentEmail = sequelize.define('SentEmail', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'customers',
                key: 'id'
            }
        },
        emailId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'emails',
                key: 'id'
            }
        }
    }, {
        sequelize,
        tableName: 'sent_emails',
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
                name: "customerId",
                using: "BTREE",
                fields: [
                    { name: "customerId" },
                ]
            },
            {
                name: "emailId",
                using: "BTREE",
                fields: [
                    { name: "emailId" },
                ]
            },
        ]
    });

    SentEmail.associate = function(models) {
        SentEmail.belongsTo(models.Customer, { as: "customer", foreignKey: "customerId"});
        SentEmail.belongsTo(models.Email, { as: "email", foreignKey: "emailId"});
    };

    return SentEmail;
};
