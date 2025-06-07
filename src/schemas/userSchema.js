import zod from 'zod'

export const userSchema = zod.object({
  username: zod
    .string()
    .min(3, { message: 'username must contain at least 3 letters' })
    .max(20, { message: 'username must contain at most 20 letters' }),
  email: zod
    .string()
    .email({ message: 'email must be a valid email address' }),
  password: zod
    .string()
    .min(8, { message: 'password must contain at least 8 letters' })
    .max(100, { message: 'password must contain at most 100 letters' }),
})