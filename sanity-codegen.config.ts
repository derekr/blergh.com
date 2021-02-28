import { SanityCodegenConfig } from 'sanity-codegen'

const config: SanityCodegenConfig = {
  schemaPath: './studio/schemas/schema.js',
  outputPath: './lib/schema.ts',
}

export default config
