import type { Config } from 'tailwindcss';

const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))', // 边框颜色
				input: 'hsl(var(--input))', // 输入框背景颜色
				ring: 'hsl(var(--ring))', // 焦点环颜色
				background: 'hsl(var(--background))', // 页面背景颜色
				foreground: 'hsl(var(--foreground))', // 主要文字颜色
				primary: {
					DEFAULT: 'hsl(var(--primary))', // 主要按钮或元素的背景颜色
					foreground: 'hsl(var(--primary-foreground))', // 主要按钮或元素的文字颜色
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))', // 次要按钮或元素的背景颜色
					foreground: 'hsl(var(--secondary-foreground))', // 次要按钮或元素的文字颜色
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))', // 危险操作的背景颜色
					foreground: 'hsl(var(--destructive-foreground))', // 危险操作的文字颜色
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))', // 静音或不显眼元素的背景颜色
					foreground: 'hsl(var(--muted-foreground))', // 静音或不显眼元素的文字颜色
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))', // 强调元素的背景颜色
					foreground: 'hsl(var(--accent-foreground))', // 强调元素的文字颜色
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))', // 弹出层背景颜色
					foreground: 'hsl(var(--popover-foreground))', // 弹出层文字颜色
				},
				card: {
					DEFAULT: 'hsl(var(--card))', // 卡片组件的背景颜色
					foreground: 'hsl(var(--card-foreground))', // 卡片组件的文字颜色
				},
			},
			borderRadius: {
				lg: 'var(--radius)', // 大的圆角半径
				md: 'calc(var(--radius) - 2px)', // 中等圆角半径
				sm: 'calc(var(--radius) - 4px)', // 小的圆角半径
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};

export default config;
