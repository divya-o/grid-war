const ANIMAL_NAMES = [
  'tiger','fox','wolf','cat','panda', 'bear','lion', 'hawk','eagle',
  'dragon', 'phoenix','raven', 'shark', 'dolphin', 'cheetah','cobra',
  'badger', 'otter', 'lynx','owl', 'deer', 'elk','moose', 'bison',
];

const COLOR_NAMES = [
  'neon', 'cyber', 'neo', 'blue', 'cyan', 'lime', 'pink', 'purple', 'violet',
  'pixel', 'electric', 'sonic', 'azure', 'magenta', 'fuchsia', 'crimson',
];

const COLORS = [
  '#00D9FF', 
  '#FF10F0', 
  '#00FF00', 
  '#0099FF', 
  '#FFD700', 
  '#FF4500', 
  '#00FFC3', 
  '#00FFCC', 
  '#7B00FF', 
  '#FF0066', 
  '#00FFFF', 
];

export function generateRandomUser() {

  const colorName = COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)];

  const animalName = ANIMAL_NAMES[Math.floor(Math.random() * ANIMAL_NAMES.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  return {

    name: colorName + animalName,
    color,
  };
}