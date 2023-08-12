import { compileString } from 'sass'
import createPlugin from 'tailwindcss/plugin'
import type { CSSRuleObject } from 'tailwindcss/types/config'

/** custom styling in sass syntax */
const customStyle = `
h1,h2,h3,h4,h5,h6
	@apply font-raleway

@each $tag,$size in (h1:4xl, h2:3xl, h3:2xl, h4:xl)
	#{$tag}
		@apply text-#{$size}

@each $w in (2xl,3xl,4xl,5xl,6xl,7xl)
	.container-#{$w}
		@apply container max-w-#{$w}

.flex-center
	@apply items-center justify-center
`

const customPlugin = (() => {
	const cssString = compileString(customStyle, {
		style: 'compressed',
		syntax: 'indented',
	})
	const cssObject: CSSRuleObject = {}
	// loop through each entries
	cssString.css.match(/([^{]+){([^}]+)}/g)?.forEach((entry) => {
		let [, className, styles] = entry.split(/([^{]+){([^}]+)}/g)
		if (!className || !styles) return
		// add property
		cssObject[className] = styles.split(';').reduce((props, style) => {
			if (style.startsWith('@apply')) {
				props[style] = {}
			} else {
				let [key, value = null] = style.split(':')
				// convert to pascalCase  for css-in-js
				key = key.replace(/-(\w)/g, (_, e) => e.toUpperCase())
				props[key] = value
			}
			return props
		}, {} as CSSRuleObject)
	})
	return createPlugin(({ addComponents }) => {
		addComponents(cssObject)
	})
})()

export default customPlugin
