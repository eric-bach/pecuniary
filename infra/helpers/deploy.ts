import { runCommand } from './runCommand';
import { Command } from 'commander';

const cdkDeploy = () => {
  try {
    const program = new Command();
    program.arguments('<env> [profile]').option('-s, --stage <stage>');
    program.parse();
    const options = program.opts();

    const env = program.args[0].toLowerCase() ?? 'dev';
    const profileArg = program.args.length === 2 ? `--profile ${program.args[1]}` : '';

    console.log(`env: ${env}, profile: ${profileArg}, stage: ${options.stage}`);

    if (options.stage) {
      runCommand(
        `npm run cdk -- deploy --all -c stage=${options.stage} -c env=${env} ${profileArg} --require-approval=never`,
        `🚀 Deploying ${options.stage}...`
      );
    } else {
      runCommand(
        `npm run cdk -- deploy --all -c stage=backend -c env=${env} --profile ${profileArg} --require-approval=never`,
        '🚀 Deploying backend...'
      );

      runCommand(
        `npm run cdk -- deploy --all -c stage=frontend -c env=${env} --profile ${profileArg} --require-approval=never`,
        '🚀 Deploying frontend...'
      );
    }
  } catch (error) {
    console.error('🛑 Error deploying CDK app\n', error);
    process.exit(-1);
  }
};

cdkDeploy();
