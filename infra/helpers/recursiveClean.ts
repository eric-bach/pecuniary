import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import * as path from 'path';

const root = path.resolve(process.cwd() + '/..');
const excludedDirs = ['node_modules', 'cdk.out', 'build'];

const subdirs = (dir: any) => {
  return readdirSync(dir)
    .filter((subdir) => statSync(path.join(dir, subdir)).isDirectory())
    .filter((subdir) => !excludedDirs.includes(subdir) && subdir[0] !== '.')
    .map((subdir) => path.join(dir, subdir));
};

const clean = (dir: any) => {
  const installable = existsSync(path.join(dir, 'package.json'));

  if (installable && dir !== root) {
    console.log(`\n🚧🚧🚧 clean ${dir}`);

    execSync('rm -fR node_modules', { cwd: dir, env: process.env, stdio: 'inherit' });
  }

  for (let subdir of subdirs(dir)) {
    clean(subdir);
  }
};

clean(root);
