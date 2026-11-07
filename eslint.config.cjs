const nextConfig = require("eslint-config-next/core-web-vitals");

module.exports = [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
];
