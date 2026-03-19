// Minimal ESLint config for Next.js project
// Avoids circular dependencies in @eslint/eslintrc
const eslintConfig = [
  {
    ignores: [".next", "node_modules", "coverage", "dist"],
  },
];

export default eslintConfig;
