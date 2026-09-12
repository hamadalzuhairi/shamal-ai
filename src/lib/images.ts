/**
 * صور الخلفيات — صور مجانية من Pexels (رخصة Pexels: استخدام حر بدون إسناد).
 * تُحمَّل مباشرة من CDN بيكسلز بأحجام مناسبة للجوال.
 */
const px = (id: number, w: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const IMAGES = {
  /** جرف حافة العالم — الرياض (الرئيسية) */
  heroCliff: px(9822971, 900),
  /** جبال صحراوية تحت سماء زرقاء — الشاشة التمهيدية */
  splash: px(7895307, 900),
  /** جبال وادي رم — خلفية باهتة خلف مؤشر الجاهزية */
  readiness: px(28086996, 900),
};
