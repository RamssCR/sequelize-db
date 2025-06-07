import { DataTypes } from 'sequelize'
import { Author } from '#models/author.model.js'
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
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt', 'AuthorId', 'CategoryId', 'GenreId'],
    },
  }
})

export const Shelf = sequelize.define('Shelf', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM('to-read', 'reading', 'read'),
    allowNull: false,
    defaultValue: 'to-read',
  },
}, {
  timestamps: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt', 'BookId', 'UserId'],
    },
  }
})

// 1:N Associations
Author.hasMany(Book)
Book.belongsTo(Author)

Genre.hasMany(Book)
Book.belongsTo(Genre)

// M:N Associations
Book.belongsToMany(User, { through: Shelf })
User.belongsToMany(Book, { through: Shelf })

// Sequelize Associations
Shelf.belongsTo(Book)
Book.hasMany(Shelf)

Shelf.belongsTo(User)
User.hasMany(Shelf)