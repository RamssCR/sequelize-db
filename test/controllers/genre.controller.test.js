// @ts-nocheck
import { describe, expect, test, vi } from 'vitest'
import { getAllGenres } from '#controllers/genre.controller.js'
import { Genre } from '#models/genre.model.js'

describe('Genre Controller', () => {
    test('should retrieve all genres', async () => {
        const mockGenres = [
            { id: 1, name: 'Action' },
            { id: 2, name: 'Comedy' },
        ]

        const req = {}
        const res = {
            json: vi.fn(),
        }
        const next = vi.fn()

        vi.spyOn(Genre, 'findAll').mockResolvedValue(mockGenres)
        await getAllGenres(req, res, next)
        expect(Genre.findAll).toHaveBeenCalledWith({
            order: [['name', 'ASC']],
        })
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'Genres retrieved successfully',
            data: mockGenres,
        })
    })

    test('should handle errors when retrieving genres', async () => {
        const req = {}
        const res = {}
        const next = vi.fn()

        vi.spyOn(Genre, 'findAll').mockRejectedValue(new Error('Database error'))
        await getAllGenres(req, res, next)
        expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
})