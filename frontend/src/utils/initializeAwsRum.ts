import { AwsRum, AwsRumConfig } from 'aws-rum-web';

export function initializeAwsRum(): void {
  try {
    const config: AwsRumConfig = {
      sessionSampleRate: 1,
      identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
      endpoint: process.env.NEXT_PUBLIC_AWS_CLOUDWATCH_RUM_ENDPOINT,
      telemetries: ['performance', 'errors', 'http'],
      allowCookies: true,
      enableXRay: false,
    };

    const APPLICATION_ID: string = process.env.NEXT_PUBLIC_AWS_APPLICATION_ID || '';
    const APPLICATION_VERSION: string = process.env.NEXT_PUBLIC_AWS_CLOUDWATCH_RUM_APP_VERSION || '1.0.0';
    const APPLICATION_REGION: string = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';

    const awsRum: AwsRum = new AwsRum(APPLICATION_ID, APPLICATION_VERSION, APPLICATION_REGION, config);

    console.log('Initialized CloudWatch RUM', awsRum);

    // Example of recording a custom event
    awsRum.recordEvent('customEvent', {
      customAttribute: 'customValue',
    });

    console.log('Recorded custom event');
  } catch (error) {
    // Ignore errors thrown during CloudWatch RUM web client initialization
    console.log('Error initializing CloudWatch RUM', error);
  }
}
