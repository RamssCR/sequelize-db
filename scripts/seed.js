import { Category } from '#models/category.model.js'
import { Genre } from '#models/genre.model.js'
import { Author } from '#models/author.model.js'
import { Book } from '#models/book.model.js'
import categories from '#seeders/categories.json' with { type: 'json' }
import genres from '#seeders/genres.json' with { type: 'json' }
import authors from '#seeders/authors.json' with { type: 'json' }
import books from '#seeders/books.json' with { type: 'json' }

await Category.bulkCreate(categories)
await Genre.bulkCreate(genres)
await Author.bulkCreate(authors)

// Book seeding
const [author, genre, category] = await Promise.all([
  Author.findAll(),
  Genre.findAll(),
  Category.findAll(),
])

const authorMap = new Map(author.map((a) => [a.dataValues.name, a.dataValues.id]))
const genreMap = new Map(genre.map((g) => [g.dataValues.name, g.dataValues.id]))
const categoryMap = new Map(category.map((c) => [c.dataValues.name, c.dataValues.id]))

const transformedBooks = books.map(book => {
  const authorId = authorMap.get(book.authorName)
  const genreId = genreMap.get(book.genreName)
  const categoryId = categoryMap.get(book.categoryName)

  if (!authorId || !genreId || !categoryId) {
    console.error(`Error: Missing mapping for book: ${book.title}`)
    return null
  }

  return {
    title: book.title,
    subtitle: book.subtitle,
    synopsis: book.synopsis,
    content: book.content,
    cover: book.cover,
    pages: book.pages,
    chapters: book.chapters,
    AuthorId: authorId,
    GenreId: genreId,
    CategoryId: categoryId,
  }
}).filter(book => book !== null)

await Book.bulkCreate(transformedBooks, { ignoreDuplicates: true })
console.log('Database seeded successfully')