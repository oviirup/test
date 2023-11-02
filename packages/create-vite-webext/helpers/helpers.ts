import fs from 'node:fs';
import path from 'node:path';
import { logger } from './utils';
import validateName from 'validate-npm-package-name';

export function validateProjectName(name: string) {
	const projectName = path.basename(path.resolve(name));
	const validation = validateName(projectName);

	return {
		valid: validation.validForNewPackages,
		error: [...(validation.errors || []), ...(validation.warnings || [])],
	};
}

export function isFolderEmpty(root: string, name: string): boolean {
	// prettier-ignore
	const validFiles = ['.ds_store','.git','.gitattributes','.gitignore','.idea','.npmignore','.travis.yml','license','thumbs.db','npm-debug.log','yarn-debug.log','yarn-error.log','yarnrc.yml','.yarn'];

	const conflicts = fs
		.readdirSync(root)
		.filter((file) => !validFiles.includes(file.toLowerCase()));

	if (conflicts.length > 0) {
		logger(
			`The directory GREEN{{${name}}} contains files that could conflict:`,
		);
		console.log();
		for (const file of conflicts) {
			try {
				const stats = fs.lstatSync(path.join(root, file));
				stats.isDirectory()
					? console.log(`  BLUE{{${file}/}}`)
					: console.log(`  ${file}`);
			} catch {
				console.log(`  ${file}`);
			}
		}
		console.log(
			'\nEither try using a new directory name, or remove the files listed above.\n',
		);
		return false;
	}

	return true;
}
