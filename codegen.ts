import { CodegenConfig } from '@graphql-codegen/cli';

/**
 * https://www.apollographql.com/tutorials/lift-off-part2/08-server-codegen
 */
const config: CodegenConfig = {
  overwrite: true,
  schema: './src/**/*.graphql',
  generates: {
    './src/types/__generated__/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../../apollo/context#Context',
        defaultMapper: 'Partial<{T}>',
      },
    },
  },
};

export default config;
