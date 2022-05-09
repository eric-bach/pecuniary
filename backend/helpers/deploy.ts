import { argv } from 'process';
import { runCommand } from './runCommand';

const cdkDeploy = () => {
  try {
    let profile = '';
    if (argv[2]) {
      profile = ` --profile ${argv[2]}`;
    }

    runCommand(`npm run cdk -- deploy  ${profile} pecuniary-dev --require-approval=never`, '🚀 Deploying Pecuniary...');
  } catch (error) {
    console.error('🛑 Error deploying CDK app\n', error);
    process.exit(-1);
  }
};

cdkDeploy();
