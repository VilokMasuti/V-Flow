import { globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  globalIgnores(["components/ui/**"]),
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "no-undef": "off",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["sibling", "parent"], "index", "object"],
          "newlines-between": "always",
          pathGroups: [
            {
              pattern: "@app/**",
              group: "external",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  {
    files: ["*.ts", "*.tsx"],
    rules: {
      "no-undef": "off",
    },
  },
];

export default eslintConfig;
