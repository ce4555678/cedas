import { extractText, getDocumentProxy } from "unpdf"

export async function parsePdf(buffer: ArrayBuffer) {
  const pdf = await getDocumentProxy(buffer)
  const { text } = await extractText(pdf, { mergePages: true })

  return text
}
