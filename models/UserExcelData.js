const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    
    class UserExcelData extends Model {}

    UserExcelData.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userType: DataTypes.STRING,
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userPassword: DataTypes.STRING,
        userStatus: DataTypes.STRING,
        roleId: DataTypes.INTEGER,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        mobile: DataTypes.STRING,
        deptId: DataTypes.INTEGER,
        designationId: DataTypes.INTEGER,
        createdAt: DataTypes.DATEONLY,
        uploaderId: {
            type: DataTypes.UUID,
            references: {
                model: 'uploader',
                key: 'uploader_id'
            }
        }
    }, {
        indexes: [
            {
                name: 'uploader_user_key',
                unique: true,
                fields: ['uploader_id', 'phone']
            }
        ],
        sequelize, 
        underscored: true,
        freezeTableName: true,
        modelName: 'user_data'
    });

    return UserExcelData;
}