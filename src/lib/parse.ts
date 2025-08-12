export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function extractTextFromFile(file: File): Promise<{ text: string; mime: string }> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }
  const mime = file.type || "application/octet-stream";
  const text = await file.text();
  return { text, mime };
}
