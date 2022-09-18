import { Stack, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Alarm, Metric, ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';

const dotenv = require('dotenv');
import { PecuniaryMessagingStackProps } from './types/PecuniaryStackProps';

dotenv.config();

export class MessagingStack extends Stack {
  public eventHandlerQueueArn: string;
  public eventBusArn: string;

  constructor(scope: Construct, id: string, props: PecuniaryMessagingStackProps) {
    super(scope, id, props);

    /***
     *** AWS SQS - Dead letter Queues
     ***/

    // Event handler DLQ
    const eventHandlerQueue = new Queue(this, 'EventHandlerQueue', {
      queueName: `${props.appName}-eventHandler-DeadLetterQueue-${props.envName}`,
    });

    /***
     *** AWS SNS - Topics
     ***/

    const eventHandlerTopic = new Topic(this, 'EventHandlerTopic', {
      topicName: `${props.appName}-eventHandler-Topic-${props.envName}`,
      displayName: 'Event Handler Topic',
    });
    if (props.params.dlqNotifications) {
      eventHandlerTopic.addSubscription(new EmailSubscription(props.params.dlqNotifications));
    }

    /***
     *** AWS CloudWatch - Alarms
     ***/

    // Generic metric
    const metric = new Metric({
      namespace: 'AWS/SQS',
      metricName: 'NumberOfMessagesSent',
    });
    // TODO Doesn't seem to work
    metric.with({
      statistic: 'Sum',
      period: Duration.seconds(300),
    });

    const eventHandlerAlarm = new Alarm(this, 'EventHandlerAlarm', {
      alarmName: `${props.appName}-eventHandler-Alarm-${props.envName}`,
      alarmDescription: 'One or more failed EventHandler messages',
      metric: metric,
      datapointsToAlarm: 1,
      evaluationPeriods: 2,
      threshold: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });
    eventHandlerAlarm.addAlarmAction(new SnsAction(eventHandlerTopic));

    /***
     *** AWS EventBridge - Event Bus
     ***/

    // EventBus
    const eventBus = new EventBus(this, 'PecuniaryEventBus', {
      eventBusName: `${props.appName}-bus-${props.envName}`,
    });

    /***
     *** Outputs
     ***/

    // Dead Letter Queues
    new CfnOutput(this, 'EventHandlerQueueArn', {
      value: eventHandlerQueue.queueArn,
      exportName: `${props.appName}-${props.envName}-eventHandlerQueueArn`,
    });

    // SNS Topics
    new CfnOutput(this, 'EventHandlerTopicArn', { value: eventHandlerTopic.topicArn });

    // EventBridge
    new CfnOutput(this, 'EventBusArn', { value: eventBus.eventBusArn, exportName: `${props.appName}-${props.envName}-eventBusArn` });
    new CfnOutput(this, 'EventBusName', { value: eventBus.eventBusName, exportName: `${props.appName}-${props.envName}-eventBusName` });

    /***
     *** Properties
     ***/

    this.eventHandlerQueueArn = eventHandlerTopic.topicArn;
    this.eventBusArn = eventBus.eventBusArn;
  }
}
