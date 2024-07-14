import { execSync } from 'child_process';
const glob = require('glob');

const runCommand = (command: string, message: string = '') => {
  console.log(`\n👉`, message.length ? `${message}\n` : `Running command: ${command}\n`);
  return execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] });
};

const build = () => {
  glob('src/appsync/*.ts', function (err: Error, files: string[]) {
    if (err) {
      console.error('Error while expanding glob:', err);
      return;
    }

    files.map((f) => {
      runCommand(
        `esbuild ${f} --bundle --sourcemap=inline --sources-content=false --platform=node --target=esnext --format=esm --external:@aws-appsync/utils --outdir=src/appsync/build`
      );
    });
  });
};

build();
