import { logger, schemaTask } from "@trigger.dev/sdk/v3"
import * as z from "zod"

export const fetchimageTask = schemaTask({
  id: "fetch-image",
  machine: "micro",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  schema: z.object({
    url: z.url("Tem que ser um url válido"),
  }),
  run: async ({ url }, { ctx }) => {
    logger.log("pegando image", { ctx })
    // await wait.for({ seconds: 5 });
    const content = await fetch(url)
    const buffer = await content.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")

    return { base64 }
  },
})
