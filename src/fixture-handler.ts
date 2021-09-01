import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { FAILED, send, SUCCESS } from './cfn-response';


export const handler = async (event: CloudFormationCustomResourceEvent, context: any) => {
  const tableName = process.env.TABLE_NAME;
  console.log('Event: ', JSON.stringify(event, null, 2));
  console.log('TableName: ', tableName);
  const records = event.ResourceProperties.records;
  console.log('Records:', records);

  if (event.RequestType === 'Delete') {
    return send({ ...event, PhysicalResourceId: context.logStreamName }, SUCCESS, {});
  }

  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  try {
    for (const record of records) {
      await client.send(new PutItemCommand({ Item: record, TableName: tableName }));
    }
    await send({ ...event, PhysicalResourceId: context.logStreamName }, SUCCESS, {});
  } catch (err) {
    console.error('Error occurred while trying to write records', err);
    await send({ ...event, PhysicalResourceId: context.logStreamName }, FAILED, err);
  }
};