export async function fetchPdf(url: string) {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  return buffer
}
