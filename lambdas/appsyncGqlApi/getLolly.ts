import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Lolly from "./Lolly";

var docClient = new AWS.DynamoDB.DocumentClient();
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-document-client.html

const getLolly = async (id: string): Promise<Lolly> => {
  try {
    var params: DocumentClient.GetItemInput = {
      TableName: process.env.LOLLIES_TABLE as string,
      Key: {id : id}
    };

    const data = await docClient.get(params).promise();
    console.log("getLolly query:", data);
    return data.Item as Lolly;
  } catch (error) {
    console.log("Dynamo DB Error", error);
    throw error;
  }
};

export default getLolly;
