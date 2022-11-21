import { runCommand } from './runCommand';
import { Command } from 'commander';

const cdkDiff = () => {
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
        `🚀 Comparing ${options.stage}...`
      );
    } else {
      runCommand(
        `npm run cdk -- diff --all -c stage=backend -c env=${env} ${profileArg}`,
        '🚀 Comparing backend...'
      );

      runCommand(
        `npm run cdk -- diff --all -c stage=frontend -c env=${env} ${profileArg}`,
        '🚀 Comparing frontend...'
      );
    }
  } catch (error) {
    console.error('🛑 Error comparing CDK app\n', error);
    process.exit(-1);
  }
};

cdkDiff();
