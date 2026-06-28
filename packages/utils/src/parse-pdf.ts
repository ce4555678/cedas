import { readFile, writeFile } from "node:fs/promises"
import { extractText, getDocumentProxy } from "unpdf"
import { cleanText } from "./clean-text"

export async function parsePdf(source: string) {
  let buffer: Buffer | ArrayBuffer

  // Verifica se a string é uma URL ou um arquivo local
  if (source.startsWith("http://") || source.startsWith("https://")) {
    buffer = await fetch(source).then((res) => res.arrayBuffer())
  } else {
    // Carrega do sistema de arquivos local
    buffer = await readFile(source)
  }

  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const { text } = await extractText(pdf, { mergePages: true })

  return text
}

// Executando a função com um arquivo local (lembre-se do await)
const text = await parsePdf("./ESTATUTO SOCIAL - COOPERSEL (1).pdf")

await writeFile("./estatuto.txt", cleanText(text))