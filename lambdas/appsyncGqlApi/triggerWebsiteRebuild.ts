import * as AWS from "aws-sdk";
var codepipeline = new AWS.CodePipeline();

const triggerWebsiteRebuild = async (): Promise<boolean> => {
  try {
    await codepipeline
      .startPipelineExecution({
        name: process.env.VIRTUAL_LOLLY_FRONTEND_PIPELINE as string,
      })
      .promise();
    console.log(
      "Pipeline Triggered successfully: ",
      process.env.VIRTUAL_LOLLY_FRONTEND_PIPELINE
    );

    return true;
  } catch (error) {
    console.log("Error Starting Pipeline", error);
    throw error;
  }
};

export default triggerWebsiteRebuild;
