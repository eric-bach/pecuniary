import { execSync } from 'child_process';
import { Command } from 'commander';

const runCommand = (command: string, message: string = '') => {
  console.log(`\n🤖`, message.length ? `${message}\n` : `Running command: ${command}\n`);
  return execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] });
};

const cdkDeploy = () => {
  try {
    const program = new Command();
    program.arguments('<env> [profile]');
    program.parse();

    const env = program.args[0].toLowerCase() ?? '';
    const profile = program.args.length === 2 ? program.args[1] : '';

    console.log(`env: ${env}, profile: ${profile}`);

    let profileArg = '';
    if (profile !== '') {
      profileArg = `--profile ${profile}`;
    }

    runCommand(`npm run cdk -- deploy --all  -c env=${env} ${profileArg} --require-approval=never`, `🚀 Deploying...`);
  } catch (error) {
    console.error('🛑 Error deploying CDK app\n', error);
    process.exit(-1);
  }
};

cdkDeploy();
