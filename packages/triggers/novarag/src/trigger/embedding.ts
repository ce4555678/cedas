import { logger, schemaTask } from "@trigger.dev/sdk/v3"
import * as z from "zod"
import { pipeline, env } from "@huggingface/transformers"
import os from "os"

// 1. Configurações de ambiente rodam uma única vez quando o container spawna
env.cacheDir = os.tmpdir()

// 2. Criamos uma promessa global para o pipeline. 
// Ela começa a carregar assim que o Trigger.dev sobe o container, ANTES mesmo da primeira task chegar.
const extractorPromise = pipeline(
  "feature-extraction",
  "Xenova/paraphrase-multilingual-MiniLM-L12-v2",
  { 
    quantized: true
  }
)

export const embeddingTask = schemaTask({
  id: "embedding",
  machine: "medium-2x",
  maxDuration: 300, 
  schema: z.object({
    text: z.string("Tem que ser um texto válido"),
  }),
  run: async ({ text }, { ctx }) => {
    logger.info("Iniciando extração de embedding...", ctx)

    // 3. Aguarda a promessa global. 
    // Na primeira execução, ele espera carregar. Nas próximas (Warm Start), 
    // ele retorna a instância INSTANTANEAMENTE porque ela já está na memória do container!
    const extractor = await extractorPromise

    const output = await extractor(text, {
      normalize: true,
      pooling: "mean",
    })

    logger.info("Embedding gerado com sucesso.", ctx)
    return Array.from(output.data) as number[]
  },
})