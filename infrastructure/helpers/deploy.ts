import { execSync } from 'child_process';
import { Command } from 'commander';

const runCommand = (command: string, message: string = '') => {
  console.log(`\n🤖`, message.length ? `${message}\n` : `Running command: ${command}\n`);
  return execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] });
};

const cdkDeploy = () => {
  try {
    const program = new Command();
    program.arguments('<env> [profile]').option('-s, --stage <stage>');
    program.parse();
    const options = program.opts();

    const env = program.args[0].toLowerCase() ?? '';
    const profile = program.args.length === 2 ? program.args[1] : '';

    console.log(`env: ${env}, profile: ${profile}, stage: ${options.stage}`);

    let profileArg = '';
    if (profile !== '') {
      profileArg = `--profile ${profile}`;
    }

    if (options.stage) {
      runCommand(
        `npm run cdk -- deploy --all -c stage=${options.stage} -c env=${env} ${profileArg} --require-approval=never`,
        `🚀 Deploying ${options.stage}...`
      );
    } else {
      runCommand(
        `npm run cdk -- deploy --all -c stage=backend -c env=${env} ${profileArg} --require-approval=never`,
        '🚀 Deploying backend...'
      );

      runCommand(
        `npm run cdk -- deploy --all -c stage=frontend -c env=${env} ${profileArg} --require-approval=never`,
        '🚀 Deploying frontend...'
      );
    }
  } catch (error) {
    console.error('🛑 Error deploying CDK app\n', error);
    process.exit(-1);
  }
};

cdkDeploy();
