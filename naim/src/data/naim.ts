// Everything on the site that changes lives in this one file.
// Anything marked PLACEHOLDER is waiting for the real thing.
// House style: short sentences, no em dashes.

export const artist = {
  name: 'Naïm',
  stylised: 'NΛIM',
  tagline: 'DJ and producer · Morocco / Paris',
  origin: 'Morocco',
  bookingEmail: 'n.oumounah@gmail.com', // from his bio doc
  managementEmail: 'n.oumounah@gmail.com',
};

export const socials: { label: string; href: string; icon: 'instagram' | 'soundcloud' | 'spotify' | 'linktree' }[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/naim_wav/', icon: 'instagram' },
  { label: 'SoundCloud', href: 'https://soundcloud.com/naim_wav', icon: 'soundcloud' },
  { label: 'Spotify', href: 'https://open.spotify.com/artist/5GOJpvP4TY4WHmY2eyf08j', icon: 'spotify' },
  { label: 'Linktree', href: 'https://linktr.ee/naim_wav', icon: 'linktree' },
];

export const bio = [
  `NΛIM is a Moroccan and Parisian DJ and producer. He lives where indie dance, ethnic house and techno meet, and turns it into one sound that is his.`,
  `High energy, wide range. US rap beats, Berlin house and Moroccan gnawa can all land in the same set. No borders, just the dancefloor. Hear it in his podcast series, Harmony Somewhere.`,
];
// One-line version, used for search results and share previews.
export const bioShort = 'Moroccan and Parisian DJ and producer. Indie dance, ethnic house and techno, played as one sound.';

// Performance photos. Drop files in /public/img/live/ and set src
// (e.g. '/img/live/01.jpg'). Empty src shows a placeholder.
export const photos: { src: string; alt: string; caption: string }[] = [
  { src: '/img/live/01-1000.webp', alt: 'Open air crowd dancing, hands up, warm lights over the booth', caption: 'Open air' },
  { src: '/img/live/02-1000.webp', alt: 'Arm up behind the decks under red lasers', caption: 'Lasers on' },
  { src: '/img/live/03-1000.webp', alt: 'Naïm with headphones and tinted glasses, lit gold', caption: 'In the mix' },
  { src: '/img/live/04-1000.webp', alt: 'A packed dancefloor in red light, the booth in the distance', caption: 'Hands up' },
  { src: '/img/live/05-1000.webp', alt: 'Playing at golden hour under a Sunset Ritual neon sign', caption: 'Sunset Ritual' },
  { src: '/img/live/06-1000.webp', alt: 'The booth through red haze, a hand raised in the crowd', caption: 'Red room' },
  { src: '/img/live/07-1000.webp', alt: 'Back to back at the CDJs under a laser and a chandelier', caption: 'Back to back' },
  { src: '/img/live/08-1000.webp', alt: 'The booth seen through the crowd, headphones on', caption: 'From the floor' },
];

// Venue rows. kind picks the row: festivals on top, clubs below.
// Use a real name, or set logo: '/img/venues/x.svg'.
// PLACEHOLDER names, all fictional. Replace with the real ones.
export const venues: {
  name: string;
  city: string;
  kind: 'festival' | 'club';
  style: 'grotesk' | 'mono' | 'serif' | 'outline' | 'stencil';
  logo?: string;
}[] = [
  { name: 'Atlas Open Air', city: 'Agadir', kind: 'festival', style: 'grotesk' },
  { name: 'Sahara Sessions', city: 'Merzouga', kind: 'festival', style: 'stencil' },
  { name: 'Dunes Festival', city: 'Essaouira', kind: 'festival', style: 'serif' },
  { name: 'Côte Sauvage', city: 'Biarritz', kind: 'festival', style: 'outline' },
  { name: 'atlantique.open', city: 'Dakhla', kind: 'festival', style: 'mono' },
  { name: 'Les Nuits Chaudes', city: 'Marseille', kind: 'festival', style: 'serif' },
  { name: 'Le Sous-Sol', city: 'Paris', kind: 'club', style: 'serif' },
  { name: 'Dar Beat', city: 'Casablanca', kind: 'club', style: 'stencil' },
  { name: 'Salle Noire', city: 'Lyon', kind: 'club', style: 'grotesk' },
  { name: 'club.parallèle', city: 'Paris', kind: 'club', style: 'mono' },
  { name: 'La Cave Rouge', city: 'Marseille', kind: 'club', style: 'serif' },
  { name: 'Hangar 21', city: 'Bordeaux', kind: 'club', style: 'outline' },
  { name: 'Tanger Club', city: 'Tangier', kind: 'club', style: 'grotesk' },
];

// Upcoming dates. type picks the icon: club | festival | release | event | radio.
// Past dates hide themselves. PLACEHOLDER dates.
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
  { date: '2026-11-28', city: 'Paris', country: 'FR', venue: 'Le Sous-Sol, all night long', type: 'club', status: 'soldout' },
  { date: '2026-12-06', city: 'Online', country: '', venue: 'Guest mix, 2 hours', type: 'radio', status: 'free' },
  { date: '2026-12-31', city: 'Marrakech', country: 'MA', venue: 'New Year’s Eve', type: 'event', tickets: '#' },
  { date: '2027-01-16', city: 'Everywhere', country: '', venue: 'Paraiso, on all platforms', type: 'release' },
  { date: '2027-03-14', city: 'Agadir', country: 'MA', venue: 'Atlas Open Air', type: 'festival', status: 'soon' },
];

// Reels: vertical clips. Use a YouTube Shorts ID or a vertical mp4 in /public/video/.
// poster is optional (a still from the clip). Empty = placeholder card.
export const videos: { title: string; place: string; youtubeId?: string; mp4?: string; poster?: string }[] = [
  { title: 'Sunset set', place: 'Casablanca', youtubeId: '' },
  { title: 'Late night', place: 'Paris', youtubeId: '' },
  { title: 'Closing track', place: 'Lyon', youtubeId: '' },
  { title: 'Open air', place: 'Agadir', youtubeId: '' },
  { title: 'Back to back', place: 'Marseille', youtubeId: '' },
];

// The single. Paste the Spotify track ID (open.spotify.com/track/<ID>)
// to switch from the preview card to the real Spotify player.
export const release = {
  title: 'Paraiso',
  artist: 'NΛIM',
  year: '2026',
  blurb: 'New single. Warm, percussive, built for late. Out now.',
  spotifyTrackId: '', // PLACEHOLDER
  spotifyUrl: 'https://open.spotify.com/artist/5GOJpvP4TY4WHmY2eyf08j',
  spotifyArtistId: '5GOJpvP4TY4WHmY2eyf08j',
  bpm: 124,
  key: 'A min',
};

// Press kit. Password and link are set with:
//   npm run presskit -- "password" "https://link-to-press-kit"
// Current placeholder password: paraiso
export const pressKitIncludes = ['Bio, EN and FR', 'Hi-res photos', 'Logo pack', 'Tech rider', 'Hospitality rider'];
