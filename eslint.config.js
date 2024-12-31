import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y"; // JSX 접근성 검사 플러그인 추가
import prettierPlugin from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwindcss from "eslint-plugin-tailwindcss"; // Tailwind CSS 플러그인 추가
import globals from "globals";

export default [
	{ ignores: ["dist"] },
	{
		files: ["**/*.{js,jsx}"],
		languageOptions: {
			ecmaVersion: "latest",
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: "latest",
				ecmaFeatures: { jsx: true },
				sourceType: "module",
			},
		},
		settings: { react: { version: "18.3" } },
		plugins: {
			react,
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			prettier: prettierPlugin,
			"jsx-a11y": jsxA11y,
			tailwindcss,
		},
		rules: {
			...js.configs.recommended.rules,
			...react.configs.recommended.rules,
			...react.configs["jsx-runtime"].rules,
			...reactHooks.configs.recommended.rules,
			"react/jsx-no-target-blank": "off", // 보안 규칙 비활성화
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			"prettier/prettier": "error", // Prettier 규칙을 ESLint 에러로 처리
			"jsx-a11y/anchor-is-valid": "warn", // 접근성 권고사항 경고
			"tailwindcss/no-custom-classname": "off", // Tailwind 클래스명 허용
		},
	},
];
