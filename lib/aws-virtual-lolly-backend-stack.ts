import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";

export class AwsVirtualLollyBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appsyncApi = new appsync.GraphqlApi(
      this,
      `${id}_appsync_graphql_api`,
      {
        name: `${id}_appsync_graphql_api`,
        schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              expires: cdk.Expiration.after(cdk.Duration.days(365)),
            },
          },
        },
        // xrayEnabled: true,
      }
    );

    const lambdaLollies = new lambda.Function(
      this,
      `${id}_lambda_for_appsync_graphql_api`,
      {
        functionName: `${id}_lambda_for_appsync_graphql_api`,
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset("lambdas/appsyncGqlApi"),
        handler: "main.handler",
      }
    );

    const lambdaDataSource = appsyncApi.addLambdaDataSource(
      `${id}_lambda_datasource_for_appsync_graphql_api`,
      lambdaLollies
    );

    lambdaDataSource.createResolver({
      fieldName: "getLolly",
      typeName: "Query",
    });

    lambdaDataSource.createResolver({
      fieldName: "getLollies",
      typeName: "Query",
    });

    lambdaDataSource.createResolver({
      fieldName: "createLolly",
      typeName: "Mutation",
    });

    lambdaDataSource.createResolver({
      fieldName: "triggerWebsiteRebuild",
      typeName: "Mutation",
    });

    const ddbTable = new ddb.Table(this, `${id}_dynamoDb_table`, {
      tableName: `${id}_Lollies`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    ddbTable.grantFullAccess(lambdaLollies);

    lambdaLollies.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ["*"],
        actions: ["codepipeline:StartPipelineExecution"],
      })
    );

    lambdaLollies.addEnvironment("LOLLIES_TABLE", ddbTable.tableName);

    lambdaLollies.addEnvironment(
      "VIRTUAL_LOLLY_FRONTEND_PIPELINE",
      "AwsVirtualLollyFrontendPipelineStack_pipeline"
    );

    const outputAppsyncUrl = new cdk.CfnOutput(this, "AppSyncUrl", {
      value: appsyncApi.graphqlUrl,
    });

    const outputAppsyncApiKey = new cdk.CfnOutput(this, "AppSyncApiKey", {
      value: appsyncApi.apiKey as string,
    });

    const outputTable = new cdk.CfnOutput(this, "Table", {
      value: ddbTable.tableName,
    });
  }
}
