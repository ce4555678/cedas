import { logger, schemaTask } from "@trigger.dev/sdk/v3"
import * as z from "zod"
import { cleanText } from "@workspace/utils/clean-text"
import { PaddleOcrService, V6_MEDIUM_MODEL } from "ppu-paddle-ocr"
import { fetchimageTask } from "./fetch-image"

export const imageOCRTask = schemaTask({
  id: "image-ocr",
  machine: "small-2x",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  schema: z.object({
    url: z.url("Tem que ser um url valido"),
  }),
  run: async ({ url }, { ctx }) => {
    logger.log("buscando imagem", { ctx })
    const resultFetch = await fetchimageTask.triggerAndWait({ url })
    const service = new PaddleOcrService({
      model: V6_MEDIUM_MODEL,
    })

    if (resultFetch.ok) {
      const buffer = Buffer.from(resultFetch.output.base64, "base64")
      await service.initialize()

      logger.log("analisando imagem")
      const result = await service.recognize(buffer.buffer, {
        strategy: "per-line",
      })

      await service.destroy()
        return result?.text ?? "";
    }

    return ""
  },
})
