import '@testing-library/jest-dom'
import React from 'react'

// Global mock for next/image to avoid DOM warnings for unsupported boolean props (fill, priority) and blurDataURL leakage.
jest.mock('next/image', () => {
	return {
		__esModule: true,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		default: function MockNextImage(props: any) {
			// Extract and discard Next.js-specific optimization props to avoid React DOM warnings
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { src, alt = '', fill, priority, placeholder, blurDataURL, style, ...rest } = props
			const finalStyle: React.CSSProperties = { ...(style || {}) }
			if (fill) {
				Object.assign(finalStyle, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' })
				if (!finalStyle.objectFit) finalStyle.objectFit = 'contain'
			}
			const resolvedSrc = typeof src === 'string' ? src : (src?.src || '')
			return React.createElement('img', { src: resolvedSrc, alt, ...rest, style: finalStyle, 'data-next-image-mock': true })
		}
	}
})
