import { fromBuffer } from "pdf2pic"
import { imageOcr } from "./image-ocr"
import fs from "fs"
import { cleanText } from "./clean-text"
const options = {
  density: 300,
  format: "jpeg",
  width: 1000,
  height: 1000,
}

async function convertPdfPage(pdfUrl: string, pageNumber: number = 1) {
  // Fetch the PDF and convert ArrayBuffer → Buffer
  const arrayBuffer = await fetch(pdfUrl).then((res) => res.arrayBuffer())
  const buffer = Buffer.from(arrayBuffer)

  const convert = fromBuffer(buffer, options)

  const result = await convert(pageNumber, { responseType: "buffer" })

  console.log(`Page ${pageNumber} is now converted as image`)
  return result
}

const estatuto = ""
// Usage
for (let i = 1; i < 12; i++) {
  const result = await convertPdfPage("", i)
  const arrayBuffer = result.buffer!.buffer.slice(
    result.buffer!.byteOffset,
    result.buffer!.byteOffset + result.buffer!.byteLength
  ) as ArrayBuffer

  const text = await imageOcr(arrayBuffer)
  estatuto.concat(text)
}

const clean = cleanText(estatuto)

fs.writeFileSync("./estatuto.txt", clean)
