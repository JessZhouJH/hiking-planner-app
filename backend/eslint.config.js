import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default defineConfig({
    files: ['**/*.{js,ts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],

    // globalIgnores([
    //   "dist/**",
    //   "node_modules/**",
    //   "src/generated/prisma/**",
    // ]),
    ignores: ['dist', 'node_modules', 'src/generated/prisma'],

    languageOptions: {
        // Tell ESLint that this code runs in Node.js
        globals: globals.node,
    },
})

// export default defineConfig(
//   // Files that ESLint should never check
//   globalIgnores([
//     "dist/**",
//     "node_modules/**",
//     "src/generated/prisma/**",
//   ]),

//   // Lint backend TypeScript source files
//   {
//     files: ["src/**/*.ts"],

//     extends: [
//       js.configs.recommended,
//       ...tseslint.configs.recommended,
//     ],

//     languageOptions: {
//       // Tell ESLint that this code runs in Node.js
//       globals: globals.node,
//     },
//   },
// );
