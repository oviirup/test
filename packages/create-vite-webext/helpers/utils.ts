import clr from 'picocolors';

export function logger(...messages: any[]) {
	const colorMap = {
		DIM: clr.dim,
		BLUE: clr.blue,
		BOLD: clr.bold,
		CYAN: clr.cyan,
		GREEN: clr.green,
		RED: clr.red,
		YELLOW: clr.yellow,
	};
	type ColorKey = keyof typeof colorMap;
	messages.forEach((msg) => {
		let formattedString = String(msg).replace(
			/([A-Z]+){{(.*?)}}/g,
			(_, name, text) => {
				if (!(name in colorMap)) return text;
				const fn = colorMap[name as ColorKey];
				return fn(text);
			},
		);
		console.log(formattedString);
	});
}
