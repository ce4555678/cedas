import { PaddleOcrService, V6_MEDIUM_MODEL } from "ppu-paddle-ocr";

const service = new PaddleOcrService({
  model: V6_MEDIUM_MODEL,
});

// Criamos uma Promise global para rastrear o status da inicialização
const initPromise = service.initialize().catch((err) => {
  console.error("Falha crítica ao inicializar o PaddleOCR:", err);
  throw err; // Repassa o erro para travar futuras requisições caso falhe
});

export async function imageOcr(image: ArrayBuffer): Promise<string> {
  // GARANTIA: Se o serviço já inicializou, ele passa direto instantaneamente.
  // Se ainda estiver inicializando, ele espera (await) o initPromise concluir.
  await initPromise;

  const result = await service.recognize(image, {
    strategy: "per-line"
  });

  await service.destroy();

  return result?.text ?? "";
}