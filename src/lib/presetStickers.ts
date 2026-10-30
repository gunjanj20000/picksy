import { SVG_ICONS } from './seedData';

export interface PresetSticker {
  id: string;
  nameEn: string;
  nameHi: string;
  category: string;
  svgData: string;
}

export const PRESET_STICKERS: PresetSticker[] = [
  { id: 'brush', nameEn: 'Toothbrush', nameHi: 'दाँत ब्रश', category: 'Routine', svgData: SVG_ICONS.toothbrush },
  { id: 'sun', nameEn: 'Sun', nameHi: 'सूरज', category: 'Nature', svgData: SVG_ICONS.sun },
  { id: 'moon', nameEn: 'Moon & Stars', nameHi: 'चाँद तारे', category: 'Nature', svgData: SVG_ICONS.moon },
  { id: 'milk', nameEn: 'Milk Glass', nameHi: 'दूध', category: 'Food', svgData: SVG_ICONS.milk },
  { id: 'fruits', nameEn: 'Fresh Fruits', nameHi: 'ताज़ा फल', category: 'Food', svgData: SVG_ICONS.fruits },
  { id: 'roti', nameEn: 'Roti / Bread', nameHi: 'रोटी', category: 'Food', svgData: SVG_ICONS.roti },
  { id: 'egg', nameEn: 'Egg', nameHi: 'अंडा', category: 'Food', svgData: SVG_ICONS.egg },
  { id: 'ball', nameEn: 'Football / Ball', nameHi: 'गेंद', category: 'Play', svgData: SVG_ICONS.ball },
  { id: 'cycle', nameEn: 'Bicycle', nameHi: 'साइकिल', category: 'Play', svgData: SVG_ICONS.cycle },
  { id: 'drawing', nameEn: 'Art & Drawing', nameHi: 'चित्रकारी', category: 'Play', svgData: SVG_ICONS.drawing },
  { id: 'bed', nameEn: 'Cozy Bed', nameHi: 'बिस्तर', category: 'Routine', svgData: SVG_ICONS.bed },
  { id: 'wash', nameEn: 'Clean Wash Hands', nameHi: 'साफ़ हाथ', category: 'Health', svgData: SVG_ICONS.washHands },
  { id: 'dirty', nameEn: 'Dirty Hands', nameHi: 'गंदे हाथ', category: 'Health', svgData: SVG_ICONS.dirtyHands },
  { id: 'check', nameEn: 'Green Check', nameHi: 'सही का निशान', category: 'Badge', svgData: SVG_ICONS.defaultRight },
  { id: 'cross', nameEn: 'Red Cross', nameHi: 'गलत का निशान', category: 'Badge', svgData: SVG_ICONS.defaultWrong },
];
