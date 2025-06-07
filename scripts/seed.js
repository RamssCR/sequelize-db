import { Genre } from '#models/genre.model.js'
import { Author } from '#models/author.model.js'
import { Book } from '#models/book.model.js'
import genres from '#seeders/genres.json' with { type: 'json' }
import authors from '#seeders/authors.json' with { type: 'json' }
import books from '#seeders/books.json' with { type: 'json' }

await Genre.bulkCreate(genres)
await Author.bulkCreate(authors)

// Book seeding
const [author, genre] = await Promise.all([
  Author.findAll(),
  Genre.findAll(),
])

const authorMap = new Map(author.map((a) => [a.dataValues.name, a.dataValues.id]))
const genreMap = new Map(genre.map((g) => [g.dataValues.name, g.dataValues.id]))

const transformedBooks = books.map(book => {
  const authorId = authorMap.get(book.authorName)
  const genreId = genreMap.get(book.genreName)

  if (!authorId || !genreId) {
    console.error(`Error: Missing mapping for book: ${book.title}`)
    return null
  }

  return {
    title: book.title,
    slug: book.slug,
    subtitle: book.subtitle,
    synopsis: book.synopsis,
    content: book.content,
    cover: book.cover,
    pages: book.pages,
    chapters: book.chapters,
    AuthorId: authorId,
    GenreId: genreId,
  }
}).filter(book => book !== null)

await Book.bulkCreate(transformedBooks, { ignoreDuplicates: true })
console.log('Database seeded successfully')