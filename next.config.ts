import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		dangerouslyAllowLocalIP: true,
		remotePatterns: [
			{
				hostname: 'images.unsplash.com',
				protocol: 'https',
				port: '',
			},
			{
				hostname: '127.0.0.1',
				protocol: 'http',
				port: '3210',
			},
		],
	},
}

export default nextConfig
