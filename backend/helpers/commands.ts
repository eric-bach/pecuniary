import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import * as path from 'path';
import { Command } from 'commander';

const subdirs = (dir: string, excludedDirs: string[]) => {
  return readdirSync(dir)
    .filter((subdir) => statSync(path.join(dir, subdir)).isDirectory())
    .filter((subdir) => !excludedDirs.includes(subdir) && subdir[0] !== '.')
    .map((subdir) => path.join(dir, subdir));
};

const execCmd = (cmd: string, dir: any, excludedDirs: string[]) => {
  const root = path.resolve(process.cwd() + '/..');
  const installable = existsSync(path.join(dir, 'package.json'));

  if (installable && dir !== root) {
    console.log(`\n🚧🚧🚧 ${cmd} ${dir}`);

    execSync(cmd, { cwd: dir, env: process.env, stdio: 'inherit' });
  }

  for (let subdir of subdirs(dir, excludedDirs)) {
    execCmd(cmd, subdir, excludedDirs);
  }
};

const runCmd = () => {
  try {
    const program = new Command();
    program.arguments('<cmd> [dir] [excludedDirs]');
    program.parse();

    const cmd = program.args[0] ?? '';
    const dir = program.args[1] ? process.cwd() + '/../' + program.args[1] : process.cwd() + '/..';
    const root = path.resolve(dir);
    const excludedDirs = program.args.length > 2 ? program.args[2].split(',') : ['node_modules', 'cdk.out', 'build'];

    execCmd(cmd, root, excludedDirs);
  } catch (error) {
    console.error('🛑 Error deploying CDK app\n', error);
    process.exit(-1);
  }
};

runCmd();
