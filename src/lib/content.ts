import { asset } from './asset';

export type Stage =
  | 'invitation'
  | 'flowers'
  | 'world'
  | 'distance'
  | 'letter'
  | 'finale';

export interface Chapter {
  id: Exclude<Stage, 'finale'>;
  number: string;
  label: string;
}

export const chapters: Chapter[] = [
  { id: 'invitation', number: '01', label: 'The invitation' },
  { id: 'flowers', number: '02', label: 'The flowers' },
  { id: 'world', number: '03', label: 'Our little world' },
  { id: 'distance', number: '04', label: 'The distance' },
  { id: 'letter', number: '05', label: 'The letter' },
];

export interface FlowerNote {
  id: number;
  lead: string;
  text: string;
}

export const flowerNotes: FlowerNote[] = [
  {
    id: 1,
    lead: 'For your laugh',
    text: "I wish I could keep every little moment that makes you laugh. They're some of my favorite moments to be part of.",
  },
  {
    id: 2,
    lead: 'For how you care',
    text: 'You make an effort, even in ways that might seem small. I notice those things, and I hope you know they never go unappreciated.',
  },
  {
    id: 3,
    lead: 'For the side of you I keep discovering',
    text: "Even after all the things I've learned, there's still so much more about you that I can't wait to discover.",
  },
  {
    id: 4,
    lead: 'For ordinary days',
    text: 'You make them feel like somewhere I want to stay. No occasion required. Just you.',
  },
];

export interface Memory {
  id: string;
  label: string;
  title: string;
  caption: string;
  copy: string;
  image: string;
  alt: string;
  point: { x: number; y: number };
}

export const memories: Memory[] = [
  {
    id: 'calls',
    label: 'a call after midnight',
    title: 'The hour that belongs to us',
    caption: 'late-night calls',
    copy: "After everything the day brings, getting to hear your voice is something I always look forward to. It's a small part of my day, but one I wouldn't want to miss.",
    image: asset('/images/scenes/03-call.webp'),
    alt: 'The boy and the girl on a late-night call in their separate bedrooms.',
    point: { x: 0.083, y: 0.305 },
  },
  {
    id: 'game',
    label: 'our adventure',
    title: 'Our little quest',
    caption: 'playing together',
    copy: 'I would play with you everytime because everything is better when you are on the other side of the screen.',
    image: asset('/images/scenes/03-quest.webp'),
    alt: 'The boy and girl playing a PC game together from two different bedrooms, connected by a glowing heart thread between their screens.',
    point: { x: 0.095, y: 0.46 },
  },
  {
    id: 'flowers',
    label: 'the flowers',
    title: 'A little beauty, just like yours',
    caption: 'the bouquet',
    copy: 'Every flower has its own way of being beautiful, and somehow, that made me think of you. Not just because of how lovely you are, but because of all the little things that make you, you.',
    image: asset('/images/scenes/02-flowers.webp'),
    alt: 'The boy holding a bouquet of blush roses.',
    point: { x: 0.071, y: 0.735 },
  },
  {
    id: 'movie',
    label: 'movie night',
    title: 'I never make it to the ending',
    caption: 'movie nights',
    copy: "Somehow, I'm always the one falling asleep first. But I think there's something nice about ending my day with you, even if I don't always get to see how the movie ends.",
    image: asset('/images/scenes/03-movie.webp'),
    alt: 'The boy and the girl watching a movie in their rooms, the boy asleep while the girl smiles at him.',
    point: { x: 0.198, y: 0.875 },
  },
  {
    id: 'someday',
    label: 'a page not yet written',
    title: 'A page we have not filled',
    caption: 'whatever comes next',
    copy: 'I do not know what the future looks like. I just know I keep imagining you in it, especially in all the ordinary days I hope we get to share.',
    image: asset('/images/scenes/03-future.webp'),
    alt: 'A scrapbook page of empty polaroids, roses and ribbon.',
    point: { x: 0.632, y: 0.34 },
  },
];

export interface DistanceNote {
  id: number;
  label: string;
  short: string;
  title: string;
  copy: string;
  point: { x: number; y: number };
}

export const distanceNotes: DistanceNote[] = [
  {
    id: 1,
    label: 'A thought at the end of the day',
    short: 'a thought',
    title: "I don't think you realize how often you make me smile without even trying.",
    copy: '',
    point: { x: 0.301, y: 0.475 },
  },
  {
    id: 2,
    label: 'A promise for the quiet hours',
    short: 'a promise',
    title: "I'll keep learning how to love you better, even on the days I don't get everything right",
    copy: '',
    point: { x: 0.503, y: 0.39 },
  },
  {
    id: 3,
    label: 'A hope for someday',
    short: 'a someday',
    title: 'Someday, distance will just be an old story.',
    copy: "I'll get to be beside you for all the moments we currently share through a screen.",
    point: { x: 0.715, y: 0.455 },
  },
];

export const letter = {
  salutation: 'My favorite person,',
  paragraphs: [
    `There's something about being with you that makes even the most ordinary moments feel worth looking forward to. Whether we're talking about absolutely nothing, watching a movie, or staying up later than we probably should, I find myself enjoying every bit of it. I don't think every moment has to be something extraordinary to be special, and i guess that's something I've come to appreciate about us.`,
    `I feel incredibly lucky to have someone i can be completely myself around. I love that we can be silly, tease each other, and just have fun without having to think too much about it. I can be weird, annoy you with my silly antics, and sometimes be a little too much, but you still meet me with patience and understanding. i know I'm not always the easiest person to deal with, and that's something i never want to take for granted.`,
    `I especially appreciate how you help me see the things i sometimes fail to notice about myself. You don't just point out where i go wrong; you help me understand and become better. I'm thankful for your honesty and patience, and i want to keep growing into someone who can love you even better.`,
    `Even with the distance between us, you've made me feel closer to you than i ever expected. I especially love the time we spend playing games together. As silly as it might sound, there are moments when it genuinely feels like you're right beside me. I guess that's one of the things i appreciate most about us. Somehow, even from miles away, we still get to share these little experiences and make them feel like we're together.`,
    `I know there's still so much ahead of us, and i get excited thinking about all the things we have yet to experience together. I can't wait for the day when we can finally play, watch movies, and laugh beside each other without a screen between us.`,
    `Until then, I hope we keep making time for each other, finding reasons to smile, and enjoying all the little moments that make us who we are.`,
    `Thank you for being you, for being patient with me, and for making this first month so special. I'm genuinely lucky to have you, and i hope i make you feel just as appreciated and loved as you make me feel.`,
    `Happy one month of us!`,
    `Here's to us and all the little adventures still waiting for us.`,
  ],
  signature: 'Yours, in all the quiet ways',
};

export const sealReplyCopy = {
  intro:
    'P.S. I would like to hear you, too. Write back if you would like it does not have to be big. A sentence is enough.',
  placeholder: 'Write something back…',
  saved:
    'Sealed and kept on this little page. Copy it whenever you are ready to send it to me.',
  copySuccess: 'Copied. It is yours to send now.',
  copyError: 'Could not copy automatically you can select the words above instead.',
};

export const chapterCopy = {
  flowers: {
    overline: 'Chapter two the flowers',
    title: 'These are for you.',
    intro:
      'I picked the softest ones I could find. Each one is holding something I do not say out loud often enough.',
    hint: 'Tap the bouquet',
    hintDone: 'Every flower, opened.',
    closing:
      "Four flowers, four little things I love about you. Just a few of the reasons I'm glad it's you.",
  },
  
  world: {
    overline: 'Chapter three our little world',
    title: 'Five little memories live here.',
    intro: 'Find them all. Follow the softest glow.',
    progress: 'memories found',
    hint: 'Show me',
    hinting: 'Look for the glow…',
    completeTitle: 'You found every one.',
    completeCopy:
      'I told you that you notice things. This whole world is my favorite place because you are in it.',
    cta: 'Onward, to the stars',
  },
  distance: {
    overline: 'Chapter four the distance',
    title: 'Some nights, the miles feel loud.',
    intro:
      'So I send little pieces of me across the sky. Three of them are waiting for you.',
    completeTitle: 'Distance is just a place the light has to travel a little farther.',
    completeCopy: 'It always arrives. I always will.',
    cta: 'There is a letter waiting',
  },
  letter: {
    overline: 'Chapter five the letter',
    title: 'One last thing.',
    intro:
      'It is not long. It is just true. Whenever you are ready, break the seal.',
    sealed: 'Press the heart',
  },
};
