import { AppSyncResolverHandler } from "aws-lambda";
import AppSyncEventArguments from "./AppSyncEventArguments";
import createLolly from "./createLolly";
import getLolly from "./getLolly";
import getLollies from "./getLollies";
import triggerWebsiteRebuild from "./triggerWebsiteRebuild";
import Lolly from "./Lolly";

export const handler: AppSyncResolverHandler<
  AppSyncEventArguments,
  Lolly | null | boolean
> = async (event) => {
  console.log("event: ", JSON.stringify(event.identity, null, 2));
  console.log("operation name: ", event.info.fieldName);
  const username = event.identity?.username as string;
  switch (event.info.fieldName) {
    case "getLollies":
      console.log("getting Lollies...");
      return await getLollies();
    case "getLolly":
      console.log("getting Lolly...");
      return await getLolly(event.arguments.id);
    case "createLolly":
      console.log("creating Lolly...");
      return await createLolly(
        event.arguments.colorTop,
        event.arguments.colorMiddle,
        event.arguments.colorBottom,
        event.arguments.from,
        event.arguments.to,
        event.arguments.message
      );
    case "triggerWebsiteRebuild":
      console.log("triggering Website Rebuild...");
      return await triggerWebsiteRebuild();
    default:
      throw new Error("Query/Mutation/Subscription Not Found");
  }
};
