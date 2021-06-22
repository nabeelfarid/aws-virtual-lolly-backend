import { AwsVirtualLollyBackendStack } from "./aws-virtual-lolly-backend-stack";
import { Stage, Construct, StageProps } from "@aws-cdk/core";

export class AwsVirtualLollyBackendPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new AwsVirtualLollyBackendStack(this, `VirtualLollyBackendStack`);
  }
}
