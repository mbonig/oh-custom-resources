import * as path from 'path';
import { App, CustomResource, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

interface TableFixtureProps {
  table: ITable;
  records: any[];
}

class TableFixture extends Construct {
  constructor(scope: Construct, id: string, props: TableFixtureProps) {
    super(scope, id);

    const handler = new NodejsFunction(this, 'FixtureHandler', {
      entry: path.join(__dirname, 'fixture-handler.ts'),
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });

    props.table.grantWriteData(handler);
    const provider = new Provider(this, 'FixtureProvider', {
      onEventHandler: handler,
    });
    new CustomResource(this, 'FixtureCR', {
      serviceToken: provider.serviceToken,
      properties: {
        records: props.records,
        timestamp: new Date().toISOString(),
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
      records: [{ PK: { S: 'something' }, value: { S: 'whatever' } }],
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