/**
 * Reads a ReadableStream from the backend and fires callbacks for each chunk.
 *
 * @param {ReadableStreamDefaultReader} reader  - from api.js streaming calls
 * @param {(chunk: string) => void} onChunk     - called for each text piece
 * @param {() => void} [onDone]                 - called when stream is complete
 */
export async function readStream(reader, onChunk, onDone) {
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        onDone?.();
        break;
      }
      const text = decoder.decode(value, { stream: true });
      onChunk(text);
    }
  } catch (err) {
    console.error('Stream reading error:', err);
    onDone?.();
  }
}
