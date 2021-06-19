const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    
    class User extends Model {}

    User.init({
        userId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emailId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phoneNo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize, 
        underscored: true,
        modelName: 'user'
    });

    return User;
}