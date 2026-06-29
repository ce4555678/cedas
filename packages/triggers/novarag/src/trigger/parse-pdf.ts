import { logger, schemaTask } from "@trigger.dev/sdk/v3"
import * as z from "zod"
import { parsePdf } from "@workspace/utils/parse-pdf"
import { fetchPdfTask } from "./fetch-pdf"
import { cleanTextTask } from "./clean-text"

export const parsePdfTask = schemaTask({
  id: "parse-pdf",
  machine: "micro",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  schema: z.object({
    url: z.url("Tem que ser um url válido"),
  }),
  run: async ({ url }, { ctx }) => {
    logger.log("pegando pdf", { ctx })
    const result = await fetchPdfTask.triggerAndWait({
      url,
    })

    if (result.ok) {
      logger.log("iniciando parse", { ctx })
      const buffer = Buffer.from(result.output.base64, "base64")
      const content = await parsePdf(buffer.buffer)
      logger.log("limpando texto", { ctx })
      const resultClean = await cleanTextTask.triggerAndWait({
        text: content,
      })

      if (resultClean.ok) return resultClean.output

      return content
    }

    return ""
  },
})
