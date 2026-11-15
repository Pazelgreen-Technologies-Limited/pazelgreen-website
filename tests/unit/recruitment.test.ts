import { describe, expect, it } from "vitest";
import { applicantReference, maxCVBytes, validateCV } from "../../cms/recruitment-rules";

describe("recruitment validation", () => {
  it("pads applicant references without wrapping large sequences", () => {
    expect(applicantReference("D-TE | DH-2027-01", 1)).toBe("D-TE | DH-2027-01-001");
    expect(applicantReference("D-TE | DH-2027-01", 1000)).toBe("D-TE | DH-2027-01-1000");
  });
  it("checks CV bytes and size independently of the supplied extension", () => {
    expect(validateCV(Buffer.from("%PDF-1.7\nfixture\n%%EOF\n"), "CV.PDF")).toBe("application/pdf");
    for (const [bytes, name] of [[Buffer.from("executable"), "cv.pdf"], [Buffer.from("PKbad zip"), "cv.docx"], [Buffer.from("%PDF-1.7\n%%EOF"), "cv.exe"], [Buffer.alloc(maxCVBytes + 1), "cv.pdf"]] as const) expect(() => validateCV(bytes, name)).toThrow();
  });
});
