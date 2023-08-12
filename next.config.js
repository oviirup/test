// @ts-check

const isDev = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: { removeConsole: !isDev },
	images: {
		domains: [
			'https://*.googleusercontent.com/*',
			'https://images.unsplash.com/*',
		],
		remotePatterns: [
			remoteURL('https://*.googleusercontent.com/**'),
			remoteURL('https://images.unsplash.com/**'),
		],
	},
}

/**
 * Simple function to parse StringURL as a image remote pattern
 * @param {string} urlString
 * @returns {import ('next/dist/shared/lib/image-config').RemotePattern}
 */
function remoteURL(urlString) {
	const { hostname, pathname } = new URL(urlString)
	return { protocol: 'https', hostname, pathname }
}

export default nextConfig
