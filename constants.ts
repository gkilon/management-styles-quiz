import type { Question } from './types';

export const QUESTIONS: Question[] = [
  // A vs B
  { id: 1, options: [{ text: 'דברן', column: 'A' }, { text: 'שקט', column: 'B' }] },
  { id: 2, options: [{ text: 'מעורב', column: 'A' }, { text: 'מתבונן', column: 'B' }] },
  { id: 3, options: [{ text: 'חברותי', column: 'A' }, { text: 'מרוחק', column: 'B' }] },
  { id: 4, options: [{ text: 'בימתי', column: 'A' }, { text: 'אינטימי', column: 'B' }] },
  { id: 5, options: [{ text: 'מביע בחופשיות', column: 'A' }, { text: 'אינו מרבה במילים', column: 'B' }] },
  { id: 6, options: [{ text: 'נועז', column: 'A' }, { text: 'זהיר', column: 'B' }] },
  { id: 7, options: [{ text: 'עושה', column: 'A' }, { text: 'חושב', column: 'B' }] },
  { id: 8, options: [{ text: 'מוחצן', column: 'A' }, { text: 'מופנם', column: 'B' }] },
  { id: 9, options: [{ text: 'מדבר', column: 'A' }, { text: 'מקשיב', column: 'B' }] },
  { id: 10, options: [{ text: 'מבטא', column: 'A' }, { text: 'מבליע (שומר בבטן)', column: 'B' }] },
  { id: 11, options: [{ text: 'נלהב', column: 'A' }, { text: 'רגוע', column: 'B' }] },
  { id: 12, options: [{ text: 'קצר רוח', column: 'A' }, { text: 'סבלני', column: 'B' }] },
  { id: 13, options: [{ text: 'מוביל', column: 'A' }, { text: 'משתלב', column: 'B' }] },
  { id: 14, options: [{ text: 'מהיר', column: 'A' }, { text: 'איטי', column: 'B' }] },
  { id: 15, options: [{ text: 'וכחן', column: 'A' }, { text: 'שואף להרמוניה', column: 'B' }] },

  // C vs D
  { id: 16, options: [{ text: 'פורמלי', column: 'C' }, { text: 'בלתי פורמלי', column: 'D' }] },
  { id: 17, options: [{ text: 'אנליטי', column: 'C' }, { text: 'אינטואיטיבי', column: 'D' }] },
  { id: 18, options: [{ text: 'ממוקד בפרטים', column: 'C' }, { text: 'רואה את התמונה הגדולה', column: 'D' }] },
  { id: 19, options: [{ text: 'מתעקש', column: 'C' }, { text: 'מוותר', column: 'D' }] },
  { id: 20, options: [{ text: 'עומד על שלו', column: 'C' }, { text: 'משתלב', column: 'D' }] },
  { id: 21, options: [{ text: 'מחושב', column: 'C' }, { text: 'ספונטני', column: 'D' }] },
  { id: 22, options: [{ text: 'מכוון משימה', column: 'C' }, { text: 'מכוון יחסי אנוש', column: 'D' }] },
  { id: 23, options: [{ text: 'מרוחק', column: 'C' }, { text: 'נגיש', column: 'D' }] },
  { id: 24, options: [{ text: 'מאופק', column: 'C' }, { text: 'אימפולסיבי', column: 'D' }] },
  { id: 25, options: [{ text: 'מובנה', column: 'C' }, { text: 'לא מובנה', column: 'D' }] },
  { id: 26, options: [{ text: 'מתבדל', column: 'C' }, { text: 'מעורב עם הבריות', column: 'D' }] },
  { id: 27, options: [{ text: 'נוקשה', column: 'C' }, { text: 'גמיש', column: 'D' }] },
  { id: 28, options: [{ text: 'שכלתני', column: 'C' }, { text: 'רגשני', column: 'D' }] },
  { id: 29, options: [{ text: 'דעתן', column: 'C' }, { text: 'מתפשר', column: 'D' }] },
  { id: 30, options: [{ text: 'מחשיב נהלים ושיטות', column: 'C' }, { text: 'מחשיב אנשים ויחסים', column: 'D' }] },
];

export const SCENARIOS = [
  { key: 'feedback', text: 'מתן משוב לעובד' },
  { key: 'conflict', text: 'התמודדות עם קונפליקט' },
  { key: 'motivation', text: 'הנעת הצוות לפעולה' },
];
