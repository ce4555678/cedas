import { pipeline, FeatureExtractionPipeline } from "@huggingface/transformers";

// Classe Singleton para garantir que o modelo seja carregado apenas uma vez
class EmbeddingPipeline {
  private static instance: FeatureExtractionPipeline | null = null;
  private static modelName = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

  public static async getInstance(): Promise<FeatureExtractionPipeline> {
    if (!this.instance) {
      this.instance = await pipeline("feature-extraction", this.modelName);
    }
    return this.instance;
  }
}

export async function genEmbedding(text: string): Promise<Float32Array | number[]> {
  // Recupera a instância já existente (ou cria a primeira)
  const extractor = await EmbeddingPipeline.getInstance();
  
  const output = await extractor(text, {
    normalize: true,
    pooling: "mean",
    // Nota: A quantização geralmente é aplicada no carregamento do modelo/pipeline, 
    // mas se o runner do transformers aceitar no output, mantemos aqui.
    quantize: true, 
  });

  // O transformers.js costuma retornar um Tensor. 
  // Para extrair os dados puros como array (ou Float32Array):
  return output.data as Float32Array;
}