/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#67e8f9',
					secondary: '#ffffff',
					accent: '#fda4af',
					neutral: '#1c1917',
					'base-100': '#FFF2FB',
					info: '#1d4ed8',
					success: '#4ade80',
					warning: '#fcd34d',
					error: '#e11d48',
				},
			},
		],
	},
};
