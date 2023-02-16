const Sequelize = require('sequelize');
const emailValidator = require('deep-email-validator')

module.exports = function(sequelize, DataTypes) {
    const Customer = sequelize.define('Customer', {
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
                notEmpty: {
                    args: true,
                    msg: "El nombre es obligatorio"
                },
                notNull: {
                    args: true,
                    msg: "El nombre es obligatorio"
                }
            }
        },
        surname: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "El apellido es obligatorio"
                },
                notNull: {
                    args: true,
                    msg: "El apellido es obligatorio"
                }
            }
        },
        identifyNumber: {
            type: DataTypes.STRING(255),
        },
        startingServiceDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        onService: {
            type: DataTypes.BOOLEAN,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
                customValidator(value) {
                    return emailValidator.validate(value).then((data) => {
                        if(data.valid == false){
                            throw new Error("No existe este email, verifique que está bien escrito");
                        }
                    })
                }
            }
        },
        phone: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        postalCode: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        township: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        province: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'customers',
        timestamps: true,
        paranoid: true,
        classMethods: {
            associate: function(models) {
                
            }
        },
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

    Customer.associate = function(models) {
        Customer.hasMany(models.SentEmail, { as: "sentEmails", foreignKey: "customerId"});
    }

    return Customer;
};
