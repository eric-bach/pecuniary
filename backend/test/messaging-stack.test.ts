import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { PecuniaryMessagingStackProps } from '../lib/types/PecuniaryStackProps';
import { MessagingStack } from '../lib/messaging-stack';

describe('Messaging Stack contains expected resources', () => {
  const app = new cdk.App();

  const props: PecuniaryMessagingStackProps = {
    appName: 'pecuniary',
    envName: 'dev',
    params: {
      dlqNotifications: 'test@test.com',
    },
    tags: {
      env: 'dev',
      application: 'pecuniary',
    },
  };

  const stack = new MessagingStack(app, 'PecuniaryTestStack', props);

  const template = Template.fromStack(stack);

  test('should have SQS Queues and SNS Topics', () => {
    template.hasResourceProperties(
      'AWS::SQS::Queue',
      Match.objectLike({ QueueName: `pecuniary-eventHandler-DeadLetterQueue-${props.envName}` })
    );
    template.hasResourceProperties('AWS::SNS::Topic', Match.objectLike({ TopicName: `pecuniary-eventHandler-Topic-${props.envName}` }));
    template.hasResourceProperties('AWS::SNS::Subscription', Match.objectLike({ Protocol: 'email' }));

    template.hasResourceProperties(
      'AWS::CloudWatch::Alarm',
      Match.objectLike({
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 2,
        AlarmName: `pecuniary-eventHandler-Alarm-${props.envName}`,
        DatapointsToAlarm: 1,
        MetricName: 'NumberOfMessagesSent',
        Namespace: 'AWS/SQS',
        Period: 300,
        Statistic: 'Average',
        Threshold: 1,
      })
    );
  });

  test('should have EventBridge', () => {
    template.hasResourceProperties('AWS::Events::EventBus', Match.objectLike({ Name: `pecuniary-bus-${props.envName}` }));
  });
});
