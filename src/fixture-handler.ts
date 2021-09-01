import { CloudFormationCustomResourceEvent } from "aws-lambda";
import { send, SUCCESS } from './cfn-response';

const tableName = process.env.TABLE_NAME;

export const handler = async (event: CloudFormationCustomResourceEvent, context: any) => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  console.log('TableName: ', tableName);

  // start making some DynamoDB calls.
  await send({ ...event, PhysicalResourceId: context.logStreamName }, SUCCESS, {});
}