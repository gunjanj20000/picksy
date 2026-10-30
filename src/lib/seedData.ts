import { Question } from '@/types/question';

// Inline high-quality SVG illustrations for 100% offline visual answers
export const SVG_ICONS = {
  toothbrush: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%2360a5fa'/%3E%3Cstop offset='100%25' stop-color='%233b82f6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='90' fill='%23dbeafe'/%3E%3Cpath d='M60 140 L130 70 C138 62 150 62 158 70 C166 78 166 90 158 98 L88 168 C80 176 68 176 60 168 C52 160 52 148 60 140 Z' fill='url(%23bg)'/%3E%3Cpath d='M130 70 L145 55 C148 52 153 52 156 55 L165 64 C168 67 168 72 165 75 L150 90 Z' fill='%2338bdf8'/%3E%3Crect x='132' y='50' width='6' height='16' rx='3' fill='%23ffffff' transform='rotate(45 135 58)'/%3E%3Crect x='142' y='60' width='6' height='16' rx='3' fill='%23ffffff' transform='rotate(45 145 68)'/%3E%3Crect x='152' y='70' width='6' height='16' rx='3' fill='%23ffffff' transform='rotate(45 155 78)'/%3E%3Ccircle cx='70' cy='150' r='5' fill='%23ffffff' opacity='0.7'/%3E%3C/svg%3E`,

  milk: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%2338bdf8'/%3E%3Cstop offset='100%25' stop-color='%230284c7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='90' fill='%23e0f2fe'/%3E%3Crect x='70' y='60' width='60' height='90' rx='12' fill='%23ffffff' stroke='%230284c7' stroke-width='6'/%3E%3Cpath d='M70 95 Q100 110 130 95 L130 140 Q130 148 120 148 L80 148 Q70 148 70 140 Z' fill='%23bae6fd'/%3E%3Cpath d='M80 60 L85 45 C86 42 90 40 94 40 L106 40 C110 40 114 42 115 45 L120 60 Z' fill='url(%23g1)'/%3E%3Ccircle cx='100' cy='120' r='12' fill='%2338bdf8'/%3E%3Cpath d='M96 116 L100 112 L104 116' stroke='%23ffffff' stroke-width='3' stroke-linecap='round' fill='none'/%3E%3C/svg%3E`,

  fruits: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23fef2f2'/%3E%3Ccircle cx='85' cy='110' r='35' fill='%23ef4444'/%3E%3Ccircle cx='125' cy='115' r='30' fill='%23f97316'/%3E%3Cpath d='M85 75 Q90 60 100 55' stroke='%2378350f' stroke-width='6' stroke-linecap='round' fill='none'/%3E%3Cellipse cx='102' cy='65' rx='12' ry='7' fill='%2322c55e' transform='rotate(-20 102 65)'/%3E%3Ccircle cx='75' cy='100' r='4' fill='%23ffffff' opacity='0.6'/%3E%3Ccircle cx='118' cy='105' r='3' fill='%23ffffff' opacity='0.6'/%3E%3C/svg%3E`,

  roti: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23fef3c7'/%3E%3Ccircle cx='100' cy='100' r='55' fill='%23fbbf24' stroke='%23d97706' stroke-width='5'/%3E%3Ccircle cx='85' cy='85' r='5' fill='%23b45309' opacity='0.7'/%3E%3Ccircle cx='115' cy='95' r='7' fill='%23b45309' opacity='0.7'/%3E%3Ccircle cx='95' cy='120' r='6' fill='%23b45309' opacity='0.7'/%3E%3Ccircle cx='118' cy='122' r='4' fill='%23b45309' opacity='0.7'/%3E%3C/svg%3E`,

  egg: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23fffbeb'/%3E%3Cellipse cx='100' cy='105' rx='45' ry='55' fill='%23ffffff' stroke='%23f59e0b' stroke-width='5'/%3E%3Ccircle cx='100' cy='112' r='24' fill='%23fbbf24'/%3E%3Ccircle cx='94' cy='106' r='6' fill='%23ffffff' opacity='0.8'/%3E%3C/svg%3E`,

  ball: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23eff6ff'/%3E%3Ccircle cx='100' cy='100' r='55' fill='%233b82f6' stroke='%231d4ed8' stroke-width='5'/%3E%3Cpath d='M100 45 A 55 55 0 0 0 100 155' fill='%23ef4444'/%3E%3Cpath d='M100 45 A 25 55 0 0 0 100 155' fill='%23fbbf24'/%3E%3Ccircle cx='80' cy='80' r='8' fill='%23ffffff' opacity='0.6'/%3E%3C/svg%3E`,

  cycle: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23ecfdf5'/%3E%3Ccircle cx='60' cy='125' r='25' fill='none' stroke='%23059669' stroke-width='7'/%3E%3Ccircle cx='140' cy='125' r='25' fill='none' stroke='%23059669' stroke-width='7'/%3E%3Ccircle cx='60' cy='125' r='6' fill='%23059669'/%3E%3Ccircle cx='140' cy='125' r='6' fill='%23059669'/%3E%3Cpath d='M60 125 L95 125 L125 90 L140 125' stroke='%2310b981' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Cpath d='M95 125 L85 85 L75 85' stroke='%2310b981' stroke-width='6' stroke-linecap='round' fill='none'/%3E%3Cpath d='M125 90 L120 70 L135 70' stroke='%23059669' stroke-width='6' stroke-linecap='round' fill='none'/%3E%3Crect x='70' y='80' width='25' height='7' rx='3.5' fill='%23047857'/%3E%3C/svg%3E`,

  drawing: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23faf5ff'/%3E%3Crect x='60' y='50' width='80' height='100' rx='8' fill='%23ffffff' stroke='%239333ea' stroke-width='5'/%3E%3Ccircle cx='90' cy='85' r='15' fill='%23f59e0b'/%3E%3Cpath d='M70 135 L95 105 L115 125 L125 115 L135 135 Z' fill='%2310b981'/%3E%3Cpath d='M140 45 L155 60 L120 95 L105 80 Z' fill='%23ec4899'/%3E%3Cpolygon points='105,80 120,95 100,97' fill='%23fbbf24'/%3E%3C/svg%3E`,

  moon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%231e1b4b'/%3E%3Cstop offset='100%25' stop-color='%23312e81'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='100' cy='100' r='90' fill='url(%23sky)'/%3E%3Cpath d='M115 50 A 48 48 0 1 0 145 130 A 42 42 0 1 1 115 50 Z' fill='%23fef08a'/%3E%3Cpolygon points='60,65 64,75 75,75 66,82 69,92 60,86 51,92 54,82 45,75 56,75' fill='%23ffffff' transform='scale(0.8) translate(15,10)'/%3E%3Cpolygon points='60,65 64,75 75,75 66,82 69,92 60,86 51,92 54,82 45,75 56,75' fill='%23ffffff' transform='scale(0.5) translate(160,110)'/%3E%3C/svg%3E`,

  sun: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23fffbeb'/%3E%3Cg stroke='%23f59e0b' stroke-width='7' stroke-linecap='round'%3E%3Cline x1='100' y1='30' x2='100' y2='45'/%3E%3Cline x1='100' y1='155' x2='100' y2='170'/%3E%3Cline x1='30' y1='100' x2='45' y2='100'/%3E%3Cline x1='155' y1='100' x2='170' y2='100'/%3E%3Cline x1='50' y1='50' x2='62' y2='62'/%3E%3Cline x1='138' y1='138' x2='150' y2='150'/%3E%3Cline x1='150' y1='50' x2='138' y2='62'/%3E%3Cline x1='62' y1='138' x2='50' y2='150'/%3E%3C/g%3E%3Ccircle cx='100' cy='100' r='40' fill='%23fbbf24' stroke='%23f59e0b' stroke-width='5'/%3E%3Ccircle cx='88' cy='95' r='5' fill='%2378350f'/%3E%3Ccircle cx='112' cy='95' r='5' fill='%2378350f'/%3E%3Cpath d='M90 110 Q100 120 110 110' stroke='%2378350f' stroke-width='4' stroke-linecap='round' fill='none'/%3E%3C/svg%3E`,

  bed: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23ede9fe'/%3E%3Crect x='45' y='95' width='110' height='40' rx='8' fill='%238b5cf6'/%3E%3Crect x='40' y='75' width='15' height='70' rx='4' fill='%236d28d9'/%3E%3Crect x='145' y='105' width='15' height='40' rx='4' fill='%236d28d9'/%3E%3Crect x='58' y='85' width='35' height='20' rx='6' fill='%23ffffff' stroke='%23c4b5fd' stroke-width='3'/%3E%3Crect x='75' y='100' width='80' height='30' rx='6' fill='%23a78bfa'/%3E%3C/svg%3E`,

  washHands: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23ecfeff'/%3E%3Cpath d='M65 110 Q85 85 105 105 Q125 85 145 110 L135 140 Q105 150 75 140 Z' fill='%23fbcfe8' stroke='%23db2777' stroke-width='4'/%3E%3Ccircle cx='100' cy='75' r='14' fill='%2338bdf8' opacity='0.7'/%3E%3Ccircle cx='80' cy='65' r='10' fill='%2338bdf8' opacity='0.6'/%3E%3Ccircle cx='120' cy='65' r='12' fill='%2338bdf8' opacity='0.6'/%3E%3Ccircle cx='95' cy='50' r='8' fill='%2338bdf8' opacity='0.5'/%3E%3Cpath d='M95 115 L105 125' stroke='%23db2777' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E`,

  dirtyHands: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='90' fill='%23fef2f2'/%3E%3Cpath d='M65 110 Q85 85 105 105 Q125 85 145 110 L135 140 Q105 150 75 140 Z' fill='%23d6d3d1' stroke='%2378716c' stroke-width='4'/%3E%3Ccircle cx='90' cy='100' r='8' fill='%2378350f'/%3E%3Ccircle cx='115' cy='115' r='10' fill='%2378350f'/%3E%3Ccircle cx='100' cy='130' r='7' fill='%2378350f'/%3E%3Ccircle cx='80' cy='120' r='6' fill='%2378350f'/%3E%3C/svg%3E`,

  defaultRight: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%2334d399'/%3E%3Cstop offset='100%25' stop-color='%23059669'/%3E%3C/linearGradient%3E%3Cfilter id='s' x='-10%25' y='-10%25' width='120%25' height='120%25'%3E%3CfeDropShadow dx='0' dy='8' stdDeviation='10' flood-color='%23059669' flood-opacity='0.4'/%3E%3C/filter%3E%3C/defs%3E%3Ccircle cx='256' cy='256' r='220' fill='url(%23g)' filter='url(%23s)'/%3E%3Cpath d='M150 260 L220 330 L362 188' fill='none' stroke='white' stroke-width='44' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E`,

  defaultWrong: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Cdefs%3E%3ClinearGradient id='r' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23f87171'/%3E%3Cstop offset='100%25' stop-color='%23dc2626'/%3E%3C/linearGradient%3E%3Cfilter id='s2' x='-10%25' y='-10%25' width='120%25' height='120%25'%3E%3CfeDropShadow dx='0' dy='8' stdDeviation='10' flood-color='%23dc2626' flood-opacity='0.4'/%3E%3C/filter%3E%3C/defs%3E%3Ccircle cx='256' cy='256' r='220' fill='url(%23r)' filter='url(%23s2)'/%3E%3Cpath d='M176 176 L336 336 M336 176 L176 336' fill='none' stroke='white' stroke-width='44' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E`,
};

export const SEED_QUESTIONS: Question[] = [
  {
    id: 'seed-m-1',
    text: 'क्या आपने आज सुबह दाँत साफ़ किए?',
    textHi: 'क्या आपने आज सुबह दाँत साफ़ किए?',
    image: SVG_ICONS.toothbrush,
    answerType: 'yesno',
    category: 'M',
    order: 1,
    createdAt: Date.now() - 50000,
  },
  {
    id: 'seed-m-2',
    text: 'सुबह नाश्ते में क्या खाना पसंद करेंगे?',
    textHi: 'सुबह नाश्ते में क्या खाना पसंद करेंगे?',
    image: SVG_ICONS.sun,
    answerType: 'images',
    category: 'M',
    order: 2,
    createdAt: Date.now() - 40000,
    imageAnswers: [
      { id: 'm2-1', text: 'दूध / Milk', image: SVG_ICONS.milk },
      { id: 'm2-2', text: 'फल / Fruits', image: SVG_ICONS.fruits },
      { id: 'm2-3', text: 'रोटी / Roti', image: SVG_ICONS.roti },
      { id: 'm2-4', text: 'अंडा / Egg', image: SVG_ICONS.egg },
    ],
  },
  {
    id: 'seed-m-3',
    text: 'खाना खाने से पहले हाथ धोना सही है या गलत?',
    textHi: 'खाना खाने से पहले हाथ धोना सही है या गलत?',
    answerType: 'rightwrong',
    category: 'M',
    order: 3,
    createdAt: Date.now() - 30000,
    rightWrongImages: {
      image1: SVG_ICONS.washHands,
      image2: SVG_ICONS.dirtyHands,
      rightIcon: SVG_ICONS.defaultRight,
      wrongIcon: SVG_ICONS.defaultWrong,
      correctOption: 'image1',
    },
  },
  {
    id: 'seed-e-1',
    text: 'क्या शाम को बाहर खेलने का समय हो गया?',
    textHi: 'क्या शाम को बाहर खेलने का समय हो गया?',
    image: SVG_ICONS.ball,
    answerType: 'yesno',
    category: 'E',
    order: 4,
    createdAt: Date.now() - 25000,
  },
  {
    id: 'seed-e-2',
    text: 'शाम को आप कौन सा खेल खेलना चाहते हैं?',
    textHi: 'शाम को आप कौन सा खेल खेलना चाहते हैं?',
    image: SVG_ICONS.ball,
    answerType: 'images',
    category: 'E',
    order: 5,
    createdAt: Date.now() - 20000,
    imageAnswers: [
      { id: 'e2-1', text: 'गेंद / Ball', image: SVG_ICONS.ball },
      { id: 'e2-2', text: 'साइकिल / Cycle', image: SVG_ICONS.cycle },
      { id: 'e2-3', text: 'ड्राइंग / Drawing', image: SVG_ICONS.drawing },
    ],
  },
  {
    id: 'seed-n-1',
    text: 'क्या रात को आसमान में चाँद और तारे दिखते हैं?',
    textHi: 'क्या रात को आसमान में चाँद और तारे दिखते हैं?',
    image: SVG_ICONS.moon,
    answerType: 'yesno',
    category: 'N',
    order: 6,
    createdAt: Date.now() - 15000,
  },
  {
    id: 'seed-n-2',
    text: 'सोने के लिए सही जगह कौन सी है?',
    textHi: 'सोने के लिए सही जगह कौन सी है?',
    answerType: 'rightwrong',
    category: 'N',
    order: 7,
    createdAt: Date.now() - 10000,
    rightWrongImages: {
      image1: SVG_ICONS.bed,
      image2: SVG_ICONS.cycle,
      rightIcon: SVG_ICONS.defaultRight,
      wrongIcon: SVG_ICONS.defaultWrong,
      correctOption: 'image1',
    },
  },
];
