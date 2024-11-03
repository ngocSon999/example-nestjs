import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: [
            '**/.eslintrc.js',
            'src/infra/database/postgres/migrations',
            'src/infra/database/mongo/migrations',
            'src/utils/collection.ts',
            'test/initialization.js',
            '**/commitlint.config.js',
            '**/*.md'
        ]
    },
    ...compat.extends(
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:you-dont-need-lodash-underscore/compatible',
        'plugin:security/recommended-legacy'
    ),
    {
        plugins: {
            '@typescript-eslint': typescriptEslintEslintPlugin,
            'simple-import-sort': simpleImportSort
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            },

            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'module',

            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: '/home/mike/Documents/pessoal/nestjs-microservice-boilerplate-api'
            }
        },

        rules: {
            'no-console': [
                'error',
                {
                    allow: ['error']
                }
            ],

            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/explicit-function-return-type': 'off',
            'object-shorthand': 'error',
            '@/no-throw-literal': 'error',
            'security/detect-non-literal-regexp': 'off',
            'security/detect-possible-timing-attacks': 'off',
            '@typescript-eslint/no-unused-vars': 'error'
        }
    }
];
