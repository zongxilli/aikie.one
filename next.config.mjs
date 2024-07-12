const nextConfig = {
	// for langchain
	reactStrictMode: true,
	webpack: (config) => {
		config.resolve.alias.canvas = false;
		config.resolve.alias.encoding = false;
		return config;
	},


	images: {
		domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
	},
};

export default nextConfig;
