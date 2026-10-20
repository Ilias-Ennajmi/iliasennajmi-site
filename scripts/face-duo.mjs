// Static duotone portraits for the strand hubs (ember for Ilias, tide for
// Ulysses): the logo with its inks mapped to one strand color and its paper
// to the page. Plain files, so they cost the page nothing but an <img>.
import fs from 'node:fs';
const src = fs.readFileSync('public/logo-mark.svg', 'utf8');
const maps = {
  ember: { ink: '#a52716', mid: '#cf8f82', paper: '#ebe5db' },
  tide: { ink: '#755938', mid: '#b9a58c', paper: '#ebe5db' },
};
for (const [name, m] of Object.entries(maps)) {
  let out = src.replace(/fill="(#1e1d19|#322f29|#36342a|#171513|#5e5953|#3c1311|#671b0f)"/g, `fill="${m.ink}"`)
    .replace(/fill="(#83817e|#a5a5a5)"/g, `fill="${m.mid}"`)
    .replace(/fill="(#cbcbcc|#eeedee|#f6f6f6|#c4a3ae|#f79c97)"/g, `fill="${m.paper}"`)
    .replace(/fill="(#ef1c19|#c3222e|#940513|#ea474b)"/g, `fill="${m.ink}"`)
    .replace(/stop-color="#[0-9a-f]{6}"/g, `stop-color="${m.ink}"`)
    .replace('width="1536" height="1536" preserveAspectRatio="none" style="display:block" ', '');
  fs.writeFileSync(`public/face-${name}.svg`, out);
  console.log(name, out.length, 'bytes');
}
