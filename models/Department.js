const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    
    class Department extends Model {}

    Department.init({
        deptid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'user_id'
            },
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        managerName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdOn: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        }
    }, {
        indexes: [
            {
                name: 'dept_user_name_idx',
                unique: true,
                fields: ['user_id', 'name']
            }
        ],
        sequelize, 
        underscored: true,
        modelName: 'department'
    });

    return Department;
}