import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { DatabaseStack } from '../lib/database-stack';
import { BaseStackProps } from '../lib/types/StackProps';

describe('Database Stack contains expected resources', () => {
    const app = new cdk.App();

    const props: BaseStackProps = {
        appName: 'vietaws-meetup-10-cdk',
        envName: 'dev',
        tags: {
            env: 'dev',
            application: 'vietaws-meetup-10-cdk',
        },
    };

    const stack = new DatabaseStack(app, 'TestStack', props);

    const template = Template.fromStack(stack);

    test('should have DynamoDB Table', () => {
        template.hasResourceProperties(
            'AWS::DynamoDB::Table',
            Match.objectLike({
                TableName: `vietaws-meetup-10-cdk-${props.envName}-orders`,
                BillingMode: 'PAY_PER_REQUEST',
            })
        );
    });
});