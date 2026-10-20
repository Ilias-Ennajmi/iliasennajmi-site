import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'src/assets/illus');

/** Essays that have an engraved object (src/assets/illus/<id>.svg). */
export function hasIllustration(id: string): boolean {
  return fs.existsSync(path.join(DIR, `${id}.svg`));
}
export function illustratedIds(ids: string[]): string[] {
  return ids.filter(hasIllustration);
}
