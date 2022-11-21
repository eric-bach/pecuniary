import { runCommand } from './runCommand';
import { Command } from 'commander';

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
        `npm run cdk -- diff --all -c stage=${options.stage} -c env=${env} ${profileArg} `,
        `🚀 Deploying ${options.stage}...`
      );
    } else {
      runCommand(
        `npm run cdk -- diff --all -c stage=backend -c env=${env} ${profileArg}`,
        '🚀 Deploying backend...'
      );

      runCommand(
        `npm run cdk -- diff --all -c stage=frontend -c env=${env} ${profileArg}`,
        '🚀 Deploying frontend...'
      );
    }
  } catch (error) {
    console.error('🛑 Error deploying CDK app\n', error);
    process.exit(-1);
  }
};

cdkDeploy();
