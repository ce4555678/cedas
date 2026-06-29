import { logger, schemaTask } from "@trigger.dev/sdk/v3"
import * as z from "zod"
import { cleanText } from "@workspace/utils/clean-text"
export const cleanTextTask = schemaTask({
  id: "clean-text",
  machine: "micro",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  schema: z.object({
    text: z.string("Tem que ser um texto valido"),
  }),
  run: async ({ text }, { ctx }) => {
    logger.log("Limpando texto", { ctx })
    // await wait.for({ seconds: 5 });
    const content = cleanText(text)
    return content
  },
})
