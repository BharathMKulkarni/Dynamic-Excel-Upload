module.exports = (sequelize, DataTypes) => {
    const History = sequelize.define("history", {
      EId:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          default:1
      },
      Dtype: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      createdAt:{
        type: DataTypes.DATE,
      },
      uploaderId: {
        type: DataTypes.UUID,
        references: {
            model: 'uploader',
            key: 'uploader_id'
        }
      },
    },
    {
        sequelize, 
        underscored: true,
        freezeTableName: true,
        modelName: 'history'
    });
    return History;
  };