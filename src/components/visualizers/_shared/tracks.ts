export type Track = {
  label: string;
  file: string;
  genre: string;
};

export const TRACKS: Track[] = [
  { label: "Rock – Take the Lead (Kevin MacLeod)", file: "/audio/kevin-macleod_take-the-lead.mp3", genre: "Rock" },
  { label: "Jazz – George Street Shuffle (Kevin MacLeod)", file: "/audio/kevin-macleod_george-street-shuffle.mp3", genre: "Jazz" },
  { label: "Metal – Metalmania (Kevin MacLeod)", file: "/audio/kevin-macleod_metalmania.mp3", genre: "Metal" },
  { label: "Industrial – Industrial Music Box (Kevin MacLeod)", file: "/audio/kevin-macleod_industrial-music-box.mp3", genre: "Industrial" },
];
