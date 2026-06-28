import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
})

export async function splitText(content: string) {
  const chuncks = await splitter.splitText(content)
  return chuncks
}
