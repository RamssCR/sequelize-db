import zod from 'zod'

const userSchema = zod.object({
    username: zod.string().min(3).max(20),
    email: zod.string().email(),
    password: zod.string().min(8).max(100),
})

/**
 * Validates the user object using zod schema.
 * It checks if the object has the required properties 
 * and if they are of the correct type.
 * @typedef {object} User
 * @property {string} username - The username of the user
 * @property {string} email - The email of the user
 * @property {string} password - The password of the user
 * @param {User} object - The user object to validate
 * @returns {import('zod').SafeParseReturnType<User, User>} - The result of the validation
 */
export const validateUser = (object) => userSchema.safeParse(object)

/**
 * Partially validates the user object using zod schema.
 * It checks if the object has the required properties
 * and if they are of the correct type.
 * @typedef {object} User
 * @property {string} username - The username of the user
 * @property {string} email - The email of the user
 * @property {string} password - The password of the user
 * @param {User} object - The user object to validate
 * @returns {import('zod').SafeParseReturnType<User, User>} - The result of the validation
 */
export const partiallyValidateUser = (object) => userSchema.partial().safeParse(object)