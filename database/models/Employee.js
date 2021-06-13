// const { sequelize } = require(".");
const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    
    class Employee extends Model {}

    Employee.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        salary: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1000
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize, 
        modelName: 'employee'
    });

    return Employee;
}