import { join } from 'path';
import { App, CustomResource, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

interface TableFixtureProps {
  table: ITable;
  records: any[];
}

class TableFixture extends Construct {
  constructor(scope: Construct, id: string, props: TableFixtureProps) {
    super(scope, id);

    const handler = new NodejsFunction(this, 'FixtureHandler', {
      entry: join(__dirname, 'fixture-handler.ts'),
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });

    props.table.grantWriteData(handler);

    new CustomResource(this, 'FixtureCR', {
      serviceToken: handler.functionArn,
      properties: {
        records: props.records,
      },
    });
  }
}

export class MyCustomResourcesExample extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const table = new Table(this, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
    });

    new TableFixture(this, 'FixtureData', {
      table,
      records: [{ PK: 'something', value: 'whatever' }],
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyCustomResourcesExample(app, 'MyCustomResource', { env: devEnv });

app.synth();