import zod from 'zod'

export const userSchema = zod.object({
    username: zod.string().min(3).max(20),
    email: zod.string().email(),
    password: zod.string().min(8).max(100),
})