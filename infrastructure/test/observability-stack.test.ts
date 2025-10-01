import { Match, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import { PecuniaryObservabilityStackProps } from '../lib/types/PecuniaryStackProps';
import { ObservabilityStack } from '../lib/observability-stack';

describe('Api Stack contains expected resources', () => {
  const app = new cdk.App();

  const props: PecuniaryObservabilityStackProps = {
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

  const stack = new ObservabilityStack(app, 'PecuniaryTestStack', props);

  const template = Template.fromStack(stack);

  test('should have SQS Queues and SNS Topics', () => {
    template.hasResourceProperties('AWS::SQS::Queue', Match.objectLike({ QueueName: `pecuniary-${props.envName}-updateBankAccountDLQ` }));
    template.hasResourceProperties(
      'AWS::SQS::Queue',
      Match.objectLike({ QueueName: `pecuniary-${props.envName}-updateInvestmentAccountDLQ` })
    );
    template.hasResourceProperties('AWS::SNS::Topic', Match.objectLike({ TopicName: `pecuniary-${props.envName}-updateBankAccountTopic` }));
    template.hasResourceProperties(
      'AWS::SNS::Topic',
      Match.objectLike({ TopicName: `pecuniary-${props.envName}-updateInvestmentAccountTopic` })
    );
    template.hasResourceProperties('AWS::SNS::Subscription', Match.objectLike({ Protocol: 'email' }));

    template.hasResourceProperties(
      'AWS::CloudWatch::Alarm',
      Match.objectLike({
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 1,
        AlarmName: `pecuniary-${props.envName}-updateBankAccountAlarm`,
        DatapointsToAlarm: 1,
        MetricName: 'ApproximateNumberOfMessagesVisible',
        Namespace: 'AWS/SQS',
        Period: 3600,
        Statistic: 'Sum',
        Threshold: 1,
      })
    );
    template.hasResourceProperties(
      'AWS::CloudWatch::Alarm',
      Match.objectLike({
        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
        EvaluationPeriods: 1,
        AlarmName: `pecuniary-${props.envName}-updateInvestmentAccountAlarm`,
        DatapointsToAlarm: 1,
        MetricName: 'ApproximateNumberOfMessagesVisible',
        Namespace: 'AWS/SQS',
        Period: 3600,
        Statistic: 'Sum',
        Threshold: 1,
      })
    );
  });
});
