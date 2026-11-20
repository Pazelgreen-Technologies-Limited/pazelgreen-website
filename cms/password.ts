import { pbkdf2, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(pbkdf2);

/** Verify the formats supported by pinned Payload 3.93, without login side effects. */
export async function matchesStoredPassword(password: string, hash: string, salt: string) {
  const prefix = hash.startsWith("pbkdf2-sha256-100k-v1:") ? "pbkdf2-sha256-100k-v1:"
    : hash.startsWith("pbkdf2-sha256-v1:") ? "pbkdf2-sha256-v1:" : "";
  const iterations = prefix === "pbkdf2-sha256-100k-v1:" ? 100000 : prefix ? 600000 : 25000;
  const expected = Buffer.from(hash.slice(prefix.length), "hex");
  const actual = await derive(password, salt, iterations, prefix ? 32 : 512, "sha256");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
