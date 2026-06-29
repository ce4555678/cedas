import { logger, schemaTask } from "@trigger.dev/sdk/v3"
import * as z from "zod"
import { fetchPdf } from "@workspace/utils/fetch-pdf"

export const fetchPdfTask = schemaTask({
  id: "fetch-pdf",
  machine: "micro",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  schema: z.object({
    url: z.url("Tem que ser um url válido"),
  }),
  run: async ({ url }, { ctx }) => {
    logger.log("pegando pdf", { ctx })
    // await wait.for({ seconds: 5 });
    const content = await fetchPdf(url)
const base64 = Buffer.from(content).toString("base64")

return { base64 }
  },
})
