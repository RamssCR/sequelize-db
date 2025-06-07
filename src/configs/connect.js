import '#models/author.model.js'
import '#models/genre.model.js'
import '#models/user.model.js'
import '#models/book.model.js'
import { sequelize } from './database.config.js'

/**
 * Connect to the database and sync models
 * @returns {Promise<void>} 
 * @throws {Error} If unable to connect to the database
 */
export const connectDB = async () => {
  try {
    await sequelize.sync({ force: true })
    console.log('Database connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}