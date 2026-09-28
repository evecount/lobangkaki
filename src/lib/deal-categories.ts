import all from "@/assets/deal-all.png";
import rice from "@/assets/deal-rice.png";
import noodles from "@/assets/deal-noodles.png";
import malay from "@/assets/deal-malay.png";
import indian from "@/assets/deal-indian.png";
import soup from "@/assets/deal-soup.png";
import western from "@/assets/deal-western.png";
import veg from "@/assets/deal-veg.png";
import halal from "@/assets/deal-halal.png";
import sweet from "@/assets/deal-sweet.png";
import boba from "@/assets/deal-boba.png";
import fruit from "@/assets/deal-fruit.png";

export type DealLike = { stall: string; description: string; diet: string };

export const dealCategories = [
  { id: "all", image: all, label: "Everything", alt: "A happy hawker table full of dishes", match: () => true },
  { id: "rice", image: rice, label: "Chicken Rice", alt: "Smiling bowl of chicken rice", match: (d: DealLike) => /chicken rice|rice|duck|char siew|roast/i.test(`${d.stall} ${d.description}`) },
  { id: "noodles", image: noodles, label: "Noodles", alt: "Smiling bowl of noodles with chopsticks", match: (d: DealLike) => /noodle|mee|laksa|prawn|ban mian|ramen|pasta|kway teow/i.test(`${d.stall} ${d.description}`) },
  { id: "malay", image: malay, label: "Malay", alt: "Smiling satay skewers with peanut sauce", match: (d: DealLike) => /nasi|mee siam|mee rebus|satay|lontong|ambeng|lemak|malay/i.test(`${d.stall} ${d.description}`) },
  { id: "indian", image: indian, label: "Indian", alt: "Smiling roti prata with curry dip", match: (d: DealLike) => /prata|briyani|thosai|idli|curry|indian|murtabak/i.test(`${d.stall} ${d.description}`) },
  { id: "soup", image: soup, label: "Soup & Porridge", alt: "Steaming smiling bowl of soup", match: (d: DealLike) => /soup|porridge|bak kut|congee|fish/i.test(`${d.stall} ${d.description}`) },
  { id: "western", image: western, label: "Western", alt: "Smiling burger and fries", match: (d: DealLike) => /western|burger|chop|pasta|pizza|steak|fries/i.test(`${d.stall} ${d.description}`) },
  { id: "veg", image: veg, label: "Vegetarian", alt: "Smiling greens and tofu in a bowl", match: (d: DealLike) => d.diet === "vegetarian" },
  { id: "halal", image: halal, label: "Halal", alt: "Smiling crescent moon with nasi lemak", match: (d: DealLike) => d.diet === "halal" },
  { id: "sweet", image: sweet, label: "Drinks & Dessert", alt: "Smiling teh tarik and ice kacang", match: (d: DealLike) => /drink|kopi|teh|dessert|cake|beancurd|tau huay|ice|sweet|juice/i.test(`${d.stall} ${d.description}`) },
  { id: "boba", image: boba, label: "Bubble Tea", alt: "Smiling cup of bubble tea with pearls", match: (d: DealLike) => /bubble|boba|pearl|milk tea/i.test(`${d.stall} ${d.description}`) },
  { id: "fruit", image: fruit, label: "Fruit Stall", alt: "Smiling tropical cut fruits on a plate", match: (d: DealLike) => /fruit|watermelon|papaya|pineapple|mango|durian|rojak/i.test(`${d.stall} ${d.description}`) },
] as const;

export type DealCategoryId = typeof dealCategories[number]["id"];

export function dealSticker(d: DealLike) {
  const hit = dealCategories.slice(1).find(c => c.id !== "halal" && c.id !== "veg" && (c.match as (x: DealLike) => boolean)(d));
  if (hit) return hit;
  if (d.diet === "halal") return dealCategories.find(c => c.id === "halal")!;
  if (d.diet === "vegetarian") return dealCategories.find(c => c.id === "veg")!;
  return dealCategories[0];
}
