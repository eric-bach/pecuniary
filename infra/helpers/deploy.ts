import { runCommand } from './runCommand';
import { Command } from 'commander';

const cdkDeploy = () => {
  try {
    const program = new Command();
    program.arguments('<env> [profile]').option('-s, --stage <stage>');
    program.parse();
    const options = program.opts();

    const env = program.args[0].toLowerCase() ?? 'dev';
    const profile = program.args.length === 2 ? program.args[1] : 'default';

    console.log(`env: ${env}, profile: ${profile}, stage: ${options.stage}`);

    if (options.stage) {
      runCommand(
        `npm run cdk -- deploy --all -c stage=${options.stage} -c env=${env} --profile ${profile} --require-approval=never`,
        `🚀 Deploying ${options.stage}...`
      );
    } else {
      runCommand(
        `npm run cdk -- deploy --all -c stage=backend -c env=${env} --profile ${profile} --require-approval=never`,
        '🚀 Deploying backend...'
      );

      runCommand(
        `npm run cdk -- deploy --all -c stage=frontend -c env=${env} --profile ${profile} --require-approval=never`,
        '🚀 Deploying frontend...'
      );
    }
  } catch (error) {
    console.error('🛑 Error deploying CDK app\n', error);
    process.exit(-1);
  }
};

cdkDeploy();
