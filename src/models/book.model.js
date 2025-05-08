import { DataTypes } from 'sequelize'
import { Author } from '#models/author.model.js'
import { Category } from '#models/category.model.js'
import { Genre } from '#models/genre.model.js'
import { User } from '#models/user.model.js'
import { sequelize } from '#configs/database.config.js'

export const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  synopsis: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cover: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pages: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  chapters: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
  paranoid: true,
})

// Associations
Author.hasMany(Book)
Book.belongsTo(Author)

Category.hasMany(Book)
Book.belongsTo(Category)

Genre.hasMany(Book)
Book.belongsTo(Genre)

Book.belongsToMany(User, {
  through: 'UserBook',
  as: 'users'
})

User.belongsToMany(Book, {
  through: 'UserBook',
  as: 'books'
})