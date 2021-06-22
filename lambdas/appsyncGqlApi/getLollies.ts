import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Lolly from "./Lolly";

var docClient = new AWS.DynamoDB.DocumentClient();
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-document-client.html

const getLollies = async (): Promise<Lolly[]> => {
  try {
    var params: DocumentClient.ScanInput = {
      TableName: process.env.LOLLIES_TABLE as string,
    };

    const data = await docClient.scan(params).promise();
    console.log("getLollies query:", data);
    return data.Items as Lolly[];
  } catch (error) {
    console.log("Dynamo DB Error", error);
    throw error;
  }
};

export default getLollies;
