import { DataTypes } from 'sequelize'
import { sequelize } from '#configs/database.config.js'

export const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  paranoid: true,
})