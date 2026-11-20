import { inflateRawSync } from "node:zlib";

export const maxCVBytes = 5 * 1024 * 1024;
export const applicantReference = (advert: string, sequence: number) => `${advert}-${String(sequence).padStart(3, "0")}`;
export const hiringStatuses = ["new", "in-review", "shortlisted", "interview", "offer", "hired", "rejected", "withdrawn"] as const;

/** Inspect bytes, not the browser's MIME declaration. Bound ZIP expansion too. */
export function validateCV(bytes: Buffer, filename: string): string {
  if (!bytes.length || bytes.length > maxCVBytes) throw new Error("CV must be no larger than 5 MB.");
  if (/\.pdf$/i.test(filename) && bytes.subarray(0, 8).toString().match(/^%PDF-(?:1\.[0-7]|2\.0)/) && /%%EOF\s*$/.test(bytes.subarray(-1024).toString())) return "application/pdf";
  if (/\.docx$/i.test(filename)) {
    try {
      // Read central directory: reject encryption, traversal, macros and zip bombs.
      let end = -1;
      for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) if (bytes.readUInt32LE(i) === 0x06054b50) { end = i; break; }
      if (end < 0 || bytes.readUInt16LE(end + 4) || bytes.readUInt16LE(end + 6)) throw new Error();
      const count = bytes.readUInt16LE(end + 10);
      if (!count || count > 1000) throw new Error();
      let offset = bytes.readUInt32LE(end + 16), expanded = 0;
      const entries = new Map<string, Buffer>();
      for (let i = 0; i < count; i++) {
        if (bytes.readUInt32LE(offset) !== 0x02014b50 || bytes.readUInt16LE(offset + 8) & 1) throw new Error();
        const method = bytes.readUInt16LE(offset + 10), packed = bytes.readUInt32LE(offset + 20), size = bytes.readUInt32LE(offset + 24);
        const length = bytes.readUInt16LE(offset + 28), name = bytes.subarray(offset + 46, offset + 46 + length).toString();
        expanded += size;
        if (expanded > 30 * 1024 * 1024 || /(^\/|\\|\.\.|vbaproject|\.exe$)/i.test(name) || entries.has(name)) throw new Error();
        const local = bytes.readUInt32LE(offset + 42);
        if (bytes.readUInt32LE(local) !== 0x04034b50) throw new Error();
        const start = local + 30 + bytes.readUInt16LE(local + 26) + bytes.readUInt16LE(local + 28);
        const compressed = bytes.subarray(start, start + packed);
        const content = method === 0 ? compressed : method === 8 ? inflateRawSync(compressed, { maxOutputLength: Math.max(1, size) }) : undefined;
        if (!content || content.length !== size) throw new Error();
        entries.set(name, content);
        offset += 46 + length + bytes.readUInt16LE(offset + 30) + bytes.readUInt16LE(offset + 32);
      }
      if (!entries.get("[Content_Types].xml")?.toString().includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml") || !entries.get("word/document.xml")?.toString().includes(":document")) throw new Error();
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } catch { /* Return the same safe validation error for malformed archives. */ }
  }
  throw new Error("Upload a valid PDF or DOCX CV.");
}
