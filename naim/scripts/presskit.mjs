// Locks the press-kit link behind a password.
//
//   npm run presskit -- "the-password" "https://drive.google.com/…/press-kit.pdf"
//
// The link is encrypted with AES-GCM using a key derived from the password
// (PBKDF2, 250k rounds), and written to src/data/presskit.json. The real link
// never appears in the site's source: without the password there is nothing
// to find. Rebuild/redeploy after running it.
import { webcrypto as crypto } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

const [password, url] = process.argv.slice(2);
if (!password || !url) {
  console.error('Usage: npm run presskit -- "<password>" "<press-kit-url>"');
  process.exit(1);
}
const enc = new TextEncoder();
const b64 = (buf) => Buffer.from(buf).toString('base64');
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' },
  base, { name: 'AES-GCM', length: 256 }, false, ['encrypt'],
);
const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(url));
const out = { salt: b64(salt), iv: b64(iv), data: b64(data), iterations: 250000 };
await writeFile(new URL('../src/data/presskit.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log('Press kit locked → src/data/presskit.json');
