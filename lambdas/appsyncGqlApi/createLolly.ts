import * as AWS from "aws-sdk";
import { nanoid } from "nanoid";
import Lolly from "./Lolly";

var docClient = new AWS.DynamoDB.DocumentClient();

const createLolly = async (
  colorTop: string,
  colorMiddle: string,
  colorBottom: string,
  from: string,
  to: string,
  message: string
): Promise<Lolly> => {
  const lolly: Lolly = {
    id: nanoid(10),
    colorTop,
    colorMiddle,
    colorBottom,
    to,
    from,
    message,
  };
  try {
    await docClient
      .put({
        TableName: process.env.LOLLIES_TABLE as string,
        Item: lolly,
      })
      .promise();
    console.log("New lolly created:", JSON.stringify(lolly, null, 4));
    return lolly;
  } catch (error) {
    console.log("Dynamo DB Error", error);
    throw error;
  }
};

export default createLolly;
