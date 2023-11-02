import fs from 'node:fs';
import path from 'node:path';
import { isFolderEmpty, validateProjectName } from './helpers';
import { logger } from './utils';
import prompts from 'prompts';
import type { Command } from 'commander';

export interface ProgramProps {
	program: Command;
	template?: string | boolean;
	packman?: string;
	useJS?: boolean;
	useTS?: boolean;
}
export async function initialize({
	program,
	template,
	packman,
	useJS,
	useTS,
}: ProgramProps) {
	console.log({ template, packman });
	let projectPath = program.args[0];
	let projectName = '';

	if (!projectPath) {
		// prompt to get the project path
		const res = await prompts({
			onState: onPromptState,
			type: 'text',
			name: 'path',
			message: 'What is your project named?',
			initial: 'web-extension',
			validate: (name) => {
				const validation = validateProjectName(name);
				return validation.valid
					? true
					: `Invalid project name: ${validation.error![0]}`;
			},
		});
		if (typeof res.path === 'string') {
			projectPath = res.path.trim();
		}
	}

	if (!projectPath) {
		logger(
			`\nPlease specify the project directory:\n  CYAN{{${program.name()}}} GREEN{{<project-directory>}}`,
			`For example:\n  CYAN{{${program.name()}}} GREEN{{web-extension}}\n`,
			`\nRun CYAN{{${program.name()} --help}} to see all options.`,
		);
		process.exit(1);
	}

	projectPath = path.resolve(projectPath);
	projectName = path.basename(projectPath);

	const validation = validateProjectName(projectName);
	if (!validation.valid) {
		logger(
			`Could not create a project called RED{{${projectName}}} because of npm naming restrictions:`,
			...validation.error.map((p) => `    RED{{*}} ${p}`),
		);

		process.exit(1);
	}

	if (template === true) {
		logger(
			`RED{{Please provide an template name or url, otherwise remove the template option.}}`,
		);
		process.exit(1);
	}

	// Verify the project dir is empty or doesn't exist
	const root = path.resolve(projectPath);
	const appName = path.basename(root);
	const folderExists = fs.existsSync(root);

	if (folderExists && !isFolderEmpty(root, appName)) {
		process.exit(1);
	}

	// parse the template name
	template = typeof template === 'string' && template.trim();

	console.log({ projectPath, projectName });
}

function onPromptState(state: any) {
	if (state.aborted) {
		// If we don't re-enable the terminal cursor before exiting
		// the program, the cursor will remain hidden
		process.stdout.write('\x1B[?25h');
		process.stdout.write('\n');
		process.exit(1);
	}
}
