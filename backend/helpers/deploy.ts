import { runCommand } from './runCommand';
import { Command } from 'commander';

const cdkDeploy = () => {
  const program = new Command();

  program
    .arguments('<env> [profile]')
    .option('-s, --stage <stage>')
    .action((env: string, profile: string) => {
      console.log(`Env: ${env}, Profile: ${profile}`);
    });
  program.parse();
  const options = program.opts();

  try {
    const env = program.args[0].toLowerCase() ?? 'dev';
    const profile = program.args.length === 2 ? program.args[1] : 'default';

    console.log(`Env: ${env}, Profile: ${profile}`);

    if (options.stage) {
      // Deploy a specific stage
      runCommand(
        `npm run cdk -- deploy --all -c deployStage=${options.stage} -c env=${env} --profile ${profile} --require-approval=never`,
        '🚀 Deploying Pecuniary...'
      );
    } else {
      runCommand(
        `npm run cdk -- deploy --all -c deployStage=backend -c env=${env} --profile ${profile} --require-approval=never`,
        '🚀 Deploying Auth...'
      );

      runCommand(
        `npm run cdk -- deploy --all -c deployStage=frontend -c env=${env} --profile ${profile} --require-approval=never`,
        '🚀 Deploying Pecuniary...'
      );
    }
  } catch (error) {
    console.error('🛑 Error deploying CDK app\n', error);
    process.exit(-1);
  }
};

cdkDeploy();
