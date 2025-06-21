/**
 * @typedef {{
 *   PORT: number,
 *   JWT_SECRET: string,
 *   NODE_ENV: string,
 *   POSTGRES_URI: string,
 *   ALLOWED_ORIGINS: string,
 *   DB_HOST: string,
 *   DB_NAME: string,
 *   DB_USER: string,
 *   DB_PASSWORD: string,
 *   DB_PORT: number
 * }} EnvConfig
 */
export const {
  PORT,
  JWT_SECRET,
  NODE_ENV,
  POSTGRES_URI,
  ALLOWED_ORIGINS,
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
} = /** @type {NodeJS.ProcessEnv & EnvConfig} */ (process.env)