const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    
    class Uploader extends Model {}

    Uploader.init({
        uploaderId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        phoneNo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize, 
        underscored: true,
        freezeTableName: true,
        modelName: 'uploader'
    });

    return Uploader;
}