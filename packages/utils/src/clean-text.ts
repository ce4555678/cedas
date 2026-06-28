import nlp from "compromise"

export function cleanText(text: string) {
  const textResult = nlp(
    text.replace(/Página\s+\d+/gi, "").replace(/\n{3,}/g, "\n")
  )
    .normalize({
      whitespace: true,
    })
    .text()

  return textResult.replace(/-+\s*Page\s*\(\d+\)\s*Break\s*-+/gi, "")
}
