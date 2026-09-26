import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
   overwrite: true,
   schema: 'http://localhost:3000/graphql',
   // This assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
   documents: ['src/**/*.{ts,tsx}'],
   // Don't exit with non-zero status when there are no documents
   ignoreNoDocuments: true,
   generates: {
      // Use a path that works the best for the structure of your application
      './src/graphql/generated/graphql.ts': {
         plugins: ['typescript-operations'],
         config: {
            // Apollo Client always includes `__typename` fields
            nonOptionalTypename: true,
            // Apollo Client doesn't add the `__typename` field to root types so
            // don't generate a type for the `__typename` for root operation types.
            skipTypeNameForRoot: true,
            // Las fechas llegan por JSON como texto ISO ("2026-09-25T18:00:00Z"):
            // sin esto Codegen las tiparía como `unknown`
            scalars: { DateTime: 'string' },
         },
      },
   },
}

export default config
