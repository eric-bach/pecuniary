import { CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import { PecuniaryObservabilityStackProps } from './types/PecuniaryStackProps';
import { Construct } from 'constructs';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Alarm, ComparisonOperator, Metric, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';

export class ObservabilityStack extends Stack {
  public updateBankAccountDlqArn: string;
  public updateInvestmentAccountDlqArn: string;

  constructor(scope: Construct, id: string, props: PecuniaryObservabilityStackProps) {
    super(scope, id, props);

    /***
     *** AWS SQS - Dead letter Queues
     ***/

    // UpdateInvestmentAccount DLQ
    const updateInvestmentAccountDLQ = new Queue(this, 'UpdateInvestmentAccountDLQ', {
      queueName: `${props.appName}-${props.envName}-updateInvestmentAccountDLQ`,
    });

    // UpdateBankAccount DLQ
    const updateBankAccountDLQ = new Queue(this, 'UpdateBankAccountDLQ', {
      queueName: `${props.appName}-${props.envName}-updateBankAccountDLQ`,
    });

    /***
     *** AWS SNS - Topics
     ***/

    const updateInvestmentAccountTopic = new Topic(this, 'UpdateInvestmentAccountTopic', {
      topicName: `${props.appName}-${props.envName}-updateInvestmentAccountTopic`,
      displayName: 'Update Investment Account DLQ Notification',
    });

    const updateBankAccountTopic = new Topic(this, 'UpdateBankAccountTopic', {
      topicName: `${props.appName}-${props.envName}-updateBankAccountTopic`,
      displayName: 'Update Bank Account Balance DLQ Notification',
    });

    if (props.params.dlqNotifications) {
      updateBankAccountTopic.addSubscription(new EmailSubscription(props.params.dlqNotifications));
      updateInvestmentAccountTopic.addSubscription(new EmailSubscription(props.params.dlqNotifications));
    }

    /***
     *** AWS CloudWatch - Alarms
     ***/

    // Generic metric
    const updateInvestmentAccountDlqMetric = new Metric({
      namespace: 'AWS/SQS',
      metricName: 'ApproximateNumberOfMessagesVisible',
      dimensionsMap: {
        QueueName: updateInvestmentAccountDLQ.queueName,
      },
      period: Duration.minutes(60),
      statistic: 'Sum',
    });
    const updateInvestmentAccountAlarm = new Alarm(this, 'UpdateInvestmentAccountAlarm', {
      alarmName: `${props.appName}-${props.envName}-updateInvestmentAccountAlarm`,
      alarmDescription: 'Unable to update investment account',
      metric: updateInvestmentAccountDlqMetric,
      datapointsToAlarm: 1,
      evaluationPeriods: 1,
      threshold: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });
    updateInvestmentAccountAlarm.addAlarmAction(new SnsAction(updateInvestmentAccountTopic));

    const updateBankAccountDlqMetric = new Metric({
      namespace: 'AWS/SQS',
      metricName: 'ApproximateNumberOfMessagesVisible',
      dimensionsMap: {
        QueueName: updateBankAccountDLQ.queueName,
      },
      period: Duration.minutes(60),
      statistic: 'Sum',
    });
    const updateBankAccountAlarm = new Alarm(this, 'UpdateBankAccountAlarm', {
      alarmName: `${props.appName}-${props.envName}-updateBankAccountAlarm`,
      alarmDescription: 'Unable to update bank account',
      metric: updateBankAccountDlqMetric,
      datapointsToAlarm: 1,
      evaluationPeriods: 1,
      threshold: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });
    updateBankAccountAlarm.addAlarmAction(new SnsAction(updateBankAccountTopic));

    /***
     *** Outputs
     ***/

    // Dead Letter Queues
    new CfnOutput(this, 'UpdateInvestmentAccountDLQArn', {
      value: updateInvestmentAccountDLQ.queueArn,
      exportName: `${props.appName}-${props.envName}-updateInvestmentAccountDLQ`,
    });
    new CfnOutput(this, 'UpdateBankAccountDLQArn', {
      value: updateBankAccountDLQ.queueArn,
      exportName: `${props.appName}-${props.envName}-updateBankAccountDLQ`,
    });

    // SNS Topics
    new CfnOutput(this, 'UpdateBankAccountTopicArn', { value: updateBankAccountTopic.topicArn });
    new CfnOutput(this, 'UpdateInvestmentAccountTopicArn', { value: updateInvestmentAccountTopic.topicArn });

    /***
     *** Properties
     ***/

    this.updateBankAccountDlqArn = updateBankAccountDLQ.queueArn;
    this.updateInvestmentAccountDlqArn = updateInvestmentAccountDLQ.queueArn;
  }
}
