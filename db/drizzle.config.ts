import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: { url: './matgebra.db' },
  casing: 'snake_case',
  strict: true,
  verbose: true,
})
