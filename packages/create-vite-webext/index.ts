#!/usr/bin/env node
import { initialize } from './helpers/initialize';
import { logger } from './helpers/utils';
import pkg from './package.json';
import { Command } from 'commander';

// exit process on termination
['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGKILL'].forEach((signal) =>
	process.on(signal, () => process.exit()),
);

// parse the cli commands and arguments
const program = new Command(pkg.name)
	.version(pkg.version)
	.arguments('[project-directory]')
	.usage('<project-directory> [options]')
	.option(
		'--ts, --typescript',
		'Initialize as a TypeScript project. Explicitly tell the CLI to use Typescript version of the templates',
	)
	.option(
		'--js, --javascript',
		'Initialize as a TypeScript project. Explicitly tell the CLI to use Typescript version of the templates',
	)
	.option(
		'-t, --template [name]|[github-url]',
		'An template to bootstrap the app or a GitHub URL.',
	)
	.option(
		'--template-path <path-to-template>',
		'In a rare case, your GitHub URL might contain a branch name with a slash (e.g. bug/fix-1) and the path to the template (e.g. foo/bar). In this case, you must specify the path to the template separately: --template-path foo/bar',
	)
	.option(
		'-p, --packman <package-manager>',
		'Explicitly tell the CLI to bootstrap the application using npm, pnpm, or yarn',
	)
	.allowUnknownOption()
	.parse(process.argv);

const opts = program.opts();

console.log(opts);

initialize({
	program,
	template: opts.template,
	packman: opts.packman,
	useJS: opts.javascript,
	useTS: opts.typescript,
})
	.then(() => {})
	.catch(async (reason) => {
		logger('Aborting installation.');
		if (reason.command) {
			logger(`  CYAN{{${reason.command}}} has failed.`);
		} else {
			logger(`RED{{Unexpected error. Please report it as a bug:}}\n ${reason}`);
		}
		process.exit(1);
	});
