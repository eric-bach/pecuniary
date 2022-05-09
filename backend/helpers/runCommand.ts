import { execSync } from 'child_process';

export const runCommand = (command: string, message: string = '') => {
  console.log(`\n🤖`, message.length ? `${message}\n` : `Running command: ${command}\n`);
  return execSync(command, { stdio: [process.stdin, process.stdout, process.stderr] });
};
