import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import * as path from 'path';

const root = path.resolve(process.cwd() + '/..');
const excludedDirs = ['node_modules', 'cdk.out', 'build'];

const subdirs = (dir: string) => {
  return readdirSync(dir)
    .filter((subdir) => statSync(path.join(dir, subdir)).isDirectory())
    .filter((subdir) => !excludedDirs.includes(subdir) && subdir[0] !== '.')
    .map((subdir) => path.join(dir, subdir));
};

const installAll = (dir: string) => {
  const installable = existsSync(path.join(dir, 'package.json'));

  if (installable && dir !== root) {
    console.log(`\n🚧🚧🚧 npm ci ${dir}`);

    execSync('rm -fR node_modules', { cwd: dir, env: process.env, stdio: 'inherit' });
    execSync('npm ci', { cwd: dir, env: process.env, stdio: 'inherit' });
  }

  for (const subdir of subdirs(dir)) {
    installAll(subdir);
  }
};

installAll(root);
