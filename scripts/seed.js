import { Genre } from '#models/genre.model.js'
import { Author } from '#models/author.model.js'
import { Book } from '#models/book.model.js'
import { Chapter } from '#models/chapter.model.js';
import genres from '#seeders/genres.json' with { type: 'json' }
import authors from '#seeders/authors.json' with { type: 'json' }
import books from '#seeders/books.json' with { type: 'json' }
import chapters from '#seeders/chapters.json' with { type: 'json' }

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

// Chapter seeding
const booksFromDB = await Book.findAll()
const bookMap = new Map(booksFromDB.map((b) => [b.dataValues.slug, b.dataValues.id]))
const transformedChapters = chapters.map(chapter => {
  const bookId = bookMap.get(chapter.bookSlug)

  if (!bookId) {
    console.error(`Error: Missing mapping for chapter: ${chapter.title}`)
    return null
  }

  return {
    title: chapter.title,
    chapterNumber: chapter.chapterNumber,
    content: chapter.content,
    slug: chapter.bookSlug,
    BookId: bookId,
  }
}).filter(chapter => chapter !== null)

await Chapter.bulkCreate(transformedChapters, { ignoreDuplicates: true })
console.log('Database seeded successfully')