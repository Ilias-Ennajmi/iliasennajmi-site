// ─────────────────────────────────────────────────────────────
//  Everything on the site that changes lives in this one file.
//  Anything marked PLACEHOLDER is waiting for the real thing.
// ─────────────────────────────────────────────────────────────

export const artist = {
  name: 'Naïm',
  stylised: 'NΛIM',
  tagline: 'Selector · DJ · Morocco ⇄ France',
  origin: 'Morocco',
  base: 'Paris',
  bookingEmail: 'booking@naim.example.com', // PLACEHOLDER
  managementEmail: 'hello@naim.example.com', // PLACEHOLDER
};

export const socials = [
  { label: 'Instagram', short: 'IG', href: 'https://instagram.com/' }, // PLACEHOLDER handle
  { label: 'SoundCloud', short: 'SC', href: 'https://soundcloud.com/naim_wav' },
  { label: 'Spotify', short: 'SP', href: 'https://open.spotify.com/search/Paraiso%20Naim' }, // PLACEHOLDER artist link
  { label: 'Resident Advisor', short: 'RA', href: 'https://ra.co/' }, // PLACEHOLDER
];

// Short bio that sits under the name.
export const bio = [
  `Naïm is a DJ raised on Moroccan wedding tapes, Parisian basements and everything that crackled in between. Born in Morocco and sharpened on the French circuit, he plays long, patient sets where house, tribal percussion and leftfield edits melt into one slow-burning temperature.`,
  `He doesn't play tracks — he curates a room. Records nobody Shazams on the first listen, a groove that refuses to break, and the exact moment the lights go red.`,
];

// The longer "journey" text.
export const journey = {
  kicker: 'The Journey',
  title: ['From the medina', 'to the dancefloor'],
  paragraphs: [
    `It started with a cassette player and a crate of borrowed tapes: chaabi, gnawa, Cheb Hasni bootlegs, a dubbed copy of a Detroit mix nobody could name. In Morocco, music was never background — it was the reason everyone was in the same room.`,
    `France gave him the booths. Small clubs first, then the late slots, then the rooms that stay open until the sun is an insult. Night after night he learned the oldest rule in the job: read the floor, then take it somewhere it didn't know it wanted to go.`,
    `Today his sets move like a road trip between both shores — hypnotic house, desert-dry percussion, warm analog low end and the odd unreleased edit that makes the whole room turn to look at the booth. Unique without trying. Curated without being precious.`,
  ],
  stats: [
    { value: '2', label: 'Shores — Morocco & France' },
    { value: '125', label: 'BPM, give or take a heartbeat' },
    { value: '∞', label: 'Records still to dig' },
  ],
};

// Performance photos for the carousel. Drop files in /public/img/live/
// and set src (e.g. '/img/live/01.jpg'). Empty src shows a styled placeholder.
export const photos: { src: string; alt: string; caption: string; icon: string }[] = [
  { src: '', alt: 'Naïm behind the decks', caption: 'Live — Club night', icon: 'globe' },
  { src: '', alt: 'Crowd at a festival', caption: 'Festival — Sunset slot', icon: 'sun' },
  { src: '', alt: 'Close-up on the mixer', caption: 'Booth — Hands on', icon: 'vinyl' },
  { src: '', alt: 'Dancefloor in red light', caption: 'Warehouse — 4 AM', icon: 'diver' },
  { src: '', alt: 'Naïm on stage', caption: 'Open air — Main stage', icon: 'tent' },
  { src: '', alt: 'Crowd hands up', caption: 'Closing set', icon: 'crowd' },
];

// Venues band. Swap names for real ones, or set logo: '/img/venues/x.svg'.
// PLACEHOLDER names — fictional, replace with the clubs he has played.
export const venues: { name: string; city: string; style: 'grotesk' | 'mono' | 'serif' | 'outline' | 'stencil'; logo?: string }[] = [
  { name: 'Le Sous-Sol', city: 'Paris', style: 'serif' },
  { name: 'DAR BEAT', city: 'Casablanca', style: 'stencil' },
  { name: 'Salle Noire', city: 'Lyon', style: 'grotesk' },
  { name: 'MEDINA SOUND', city: 'Marrakech', style: 'outline' },
  { name: 'club.parallèle', city: 'Paris', style: 'mono' },
  { name: 'Atlas Open Air', city: 'Agadir', style: 'grotesk' },
  { name: 'La Cave Rouge', city: 'Marseille', style: 'serif' },
  { name: 'TANGIER NIGHTS', city: 'Tangier', style: 'stencil' },
  { name: 'Hangar 21', city: 'Bordeaux', style: 'outline' },
  { name: 'rabat/radio', city: 'Rabat', style: 'mono' },
  { name: 'Le Jardin', city: 'Nice', style: 'serif' },
  { name: 'SAHARA SESSIONS', city: 'Merzouga', style: 'grotesk' },
];

// Upcoming dates. type picks the icon: club | festival | release | event | radio.
// Past dates hide themselves automatically. PLACEHOLDER dates.
export const dates: {
  date: string; // YYYY-MM-DD
  city: string;
  country: string;
  venue: string;
  type: 'club' | 'festival' | 'release' | 'event' | 'radio';
  tickets?: string;
  status?: 'soldout' | 'free' | 'soon';
}[] = [
  { date: '2026-11-21', city: 'Casablanca', country: 'MA', venue: 'Dar Beat', type: 'club', tickets: '#' },
  { date: '2026-11-28', city: 'Paris', country: 'FR', venue: 'Le Sous-Sol — All Night Long', type: 'club', status: 'soldout' },
  { date: '2026-12-06', city: 'Online', country: '—', venue: 'Rabat/Radio — 2h guest mix', type: 'radio', status: 'free' },
  { date: '2026-12-31', city: 'Marrakech', country: 'MA', venue: 'Medina Sound — NYE', type: 'event', tickets: '#' },
  { date: '2027-01-16', city: 'Everywhere', country: '—', venue: '“Paraiso” — out on all platforms', type: 'release' },
  { date: '2027-03-14', city: 'Agadir', country: 'MA', venue: 'Atlas Open Air Festival', type: 'festival', status: 'soon' },
];

// Video sets. Use a YouTube ID (the bit after v=) or a direct mp4 path.
// Empty = placeholder card. PLACEHOLDER entries.
export const videos: { title: string; place: string; length: string; youtubeId?: string; mp4?: string; poster?: string }[] = [
  { title: 'Sunset set', place: 'Rooftop, Casablanca', length: '1:02:14', youtubeId: '' },
  { title: 'Late night session', place: 'Le Sous-Sol, Paris', length: '58:40', youtubeId: '' },
  { title: 'Boiler-style live cut', place: 'Warehouse, Lyon', length: '24:07', youtubeId: '' },
  { title: 'Desert sunrise', place: 'Merzouga', length: '1:15:00', youtubeId: '' },
];

// The single. Paste the Spotify track ID (open.spotify.com/track/<ID>)
// to switch from the custom card to the real Spotify embed.
export const release = {
  title: 'Paraiso',
  artist: 'NΛIM',
  year: '2026',
  spotifyTrackId: '', // PLACEHOLDER — couldn't find it on Spotify yet
  spotifyUrl: 'https://open.spotify.com/search/Paraiso%20Naim',
  bpm: 124,
  key: 'A min',
};

// Press kit. The password and the link are set with:
//   npm run presskit -- "password" "https://link-to-press-kit"
// Current placeholder password: paraiso
export const pressKitIncludes = ['Bio (EN / FR)', 'Hi-res photos', 'Logo pack', 'Technical rider', 'Hospitality rider'];
