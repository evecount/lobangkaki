// SYNTHETIC DEMO DATA. Hawker centre and community club names are real public places,
// but every stall name, dish, price and dietary label below is invented for the demo.
export type StallDiet = "halal" | "vegetarian";
export type SampleStall = { name: string; dish: string; price: string; diet?: StallDiet | undefined };
export type Neighbourhood = { name: string; sectors: string[]; centre: string; cc: string; park: string; stalls: SampleStall[] };

type Row = [name: string, sectors: string, centre: string, cc: string, park: string, stalls: [string, string, string, StallDiet?][]];

const rows: Row[] = [
  ["Ang Mo Kio", "56", "Ang Mo Kio 628 Market", "Ang Mo Kio CC", "Bishan-Ang Mo Kio Park", [["Ah Heng Chicken Rice", "Steamed chicken rice", "2-for-1 after 8pm"], ["Makcik Siti Nasi Padang", "Nasi padang set", "Free for seniors after 8pm", "halal"], ["Lotus Veg Bee Hoon", "Vegetarian bee hoon", "50% off last hour", "vegetarian"], ["Uncle Tan Fishball Noodle", "Fishball mee pok", "2-for-1 closing special"]]],
  ["Bishan", "57", "Bishan 511 Market", "Bishan CC", "Bishan-Ang Mo Kio Park", [["Kim Kee Wanton Mee", "Wanton mee", "Free upsize today"], ["Rahmah Mee Rebus", "Mee rebus", "50% off after 8:30pm", "halal"], ["Bodhi Economic Veg Rice", "Veg rice, 3 dishes", "2-for-1 before closing", "vegetarian"], ["Hup Seng Kway Chap", "Kway chap set", "Free extra portion"]]],
  ["Bedok", "46,47", "Bedok 85 Fengshan Market", "Bedok CC", "Bedok Reservoir Park", [["Bedok Auntie Chicken Rice", "Roasted chicken rice", "2-for-1 after 8pm"], ["Hajjah Mariam Mee Soto", "Mee soto", "Free for seniors after 8pm", "halal"], ["Green Leaf Veg Noodles", "Vegetarian laksa", "50% off last hour", "vegetarian"], ["Seng Kee Bak Chor Mee", "Minced pork noodles", "2-for-1 closing special"]]],
  ["Tampines", "52", "Tampines Round Market", "Tampines West CC", "Tampines Eco Green", [["Tampines Lor Mee 138", "Lor mee", "Free upsize today"], ["Warung Pak Ali", "Mee goreng", "50% off after 8:30pm", "halal"], ["Heart Sutra Veg Rice", "Veg rice, 3 dishes", "2-for-1 before closing", "vegetarian"], ["Chuan Kee Porridge", "Fish porridge", "Free extra portion"]]],
  ["Toa Payoh", "31", "Toa Payoh Lorong 8 Market", "Toa Payoh East CC", "Toa Payoh Town Park", [["Lorong 8 Chwee Kueh", "Chwee kueh, 5 pcs", "2-for-1 after 8pm"], ["Aminah Nasi Lemak", "Nasi lemak", "Free for seniors after 8pm", "halal"], ["Kwan Yin Veg Bee Hoon", "Fried bee hoon", "50% off last hour", "vegetarian"], ["Ah Kow Hokkien Mee", "Fried Hokkien mee", "2-for-1 closing special"]]],
  ["Jurong West", "64", "Jurong West 505 Market", "Jurong Green CC", "Jurong Lake Gardens", [["Boon Lay Duck Rice", "Braised duck rice", "Free upsize today"], ["Kak Yah Mee Siam", "Mee siam", "50% off after 8:30pm", "halal"], ["Sunflower Veg Delights", "Veg bee hoon set", "2-for-1 before closing", "vegetarian"], ["Hock Lee Char Kway Teow", "Char kway teow", "Free extra portion"]]],
  ["Jurong East", "60", "Yuhua Village Market", "Yuhua CC", "Jurong Lake Gardens", [["Yuhua Prawn Mee", "Prawn noodle soup", "2-for-1 after 8pm"], ["Pak Hassan Satay Bee Hoon", "Satay bee hoon", "Free for seniors after 8pm", "halal"], ["Pure Land Veg Kitchen", "Mock meat rice", "50% off last hour", "vegetarian"], ["Teck Seng Carrot Cake", "Fried carrot cake", "2-for-1 closing special"]]],
  ["Clementi", "12,13", "Clementi 448 Market", "Clementi CC", "Clementi Woods Park", [["Clementi Hainan Curry Rice", "Curry rice", "Free upsize today"], ["Zainab Roti Prata", "2 plain prata", "50% off after 8:30pm", "halal"], ["Amitabha Veg Noodles", "Veg mee pok", "2-for-1 before closing", "vegetarian"], ["Chye Kee Yong Tau Foo", "Yong tau foo, 7 pcs", "Free extra portion"]]],
  ["Queenstown", "14,15", "ABC Brickworks Food Centre", "Queenstown CC", "Alexandra Canal Linear Park", [["Brickworks Fish Soup", "Sliced fish soup", "2-for-1 after 8pm"], ["Mak Long Nasi Ayam", "Nasi ayam penyet", "Free for seniors after 8pm", "halal"], ["Metta Veg Fried Rice", "Veg fried rice", "50% off last hour", "vegetarian"], ["Mei Ling Chee Cheong Fun", "Chee cheong fun", "2-for-1 closing special"]]],
  ["Tiong Bahru & Bukit Merah", "16", "Tiong Bahru Market", "Tiong Bahru CC", "Tiong Bahru Park", [["Tiong Bahru Lor Mee 91", "Lor mee", "Free upsize today"], ["Rumah Makan Bonda", "Lontong", "50% off after 8:30pm", "halal"], ["Lotus Leaf Veg Pau", "Veg pau, 3 pcs", "2-for-1 before closing", "vegetarian"], ["Jian Bo Style Chwee Kueh", "Chwee kueh, 4 pcs", "Free extra portion"]]],
  ["Chinatown & Tanjong Pagar", "05,06,07,08", "Chinatown Complex Food Centre", "Kreta Ayer CC", "Pearl's Hill City Park", [["Smith Street Claypot Rice", "Claypot rice", "2-for-1 after 8pm"], ["Maxwell Nasi Briyani", "Chicken briyani", "Free for seniors after 8pm", "halal"], ["Buddha Tooth Veg Rice", "Veg rice, 3 dishes", "50% off last hour", "vegetarian"], ["Sago Lane Soya Beancurd", "Tau huay + soya milk", "2-for-1 closing special", "vegetarian"]]],
  ["Geylang & Eunos", "38,40,41", "Geylang Serai Market", "Geylang Serai CC", "Kallang Riverside Park", [["Serai Nasi Padang", "Nasi padang set", "Free upsize today", "halal"], ["Eunos Mee Rebus Haji", "Mee rebus", "50% off after 8:30pm", "halal"], ["Joo Chiat Veg Popiah", "Veg popiah, 2 rolls", "2-for-1 before closing", "vegetarian"], ["Aljunied Frog Porridge", "Frog leg porridge", "Free extra portion"]]],
  ["Katong & Marine Parade", "42,43,44", "Old Airport Road Food Centre", "Marine Parade CC", "East Coast Park", [["Old Airport Rojak", "Fruit rojak", "2-for-1 after 8pm"], ["Opah Nasi Lemak", "Nasi lemak", "Free for seniors after 8pm", "halal"], ["Katong Veg Laksa", "Vegetarian laksa", "50% off last hour", "vegetarian"], ["Dakota Hokkien Mee", "Fried Hokkien mee", "2-for-1 closing special"]]],
  ["Pasir Ris", "51", "Pasir Ris Central Hawker Centre", "Pasir Ris East CC", "Pasir Ris Park", [["Pasir Ris Chicken Rice", "Steamed chicken rice", "Free upsize today"], ["Kampung Loyang Nasi Ambeng", "Nasi ambeng (single)", "50% off after 8:30pm", "halal"], ["Seaside Veg Kitchen", "Veg rice set", "2-for-1 before closing", "vegetarian"], ["Elias Fishball Noodle", "Fishball noodles", "Free extra portion"]]],
  ["Punggol", "82", "Punggol Coast Hawker Centre", "Punggol 21 CC", "Punggol Waterway Park", [["Waterway Ban Mian", "Ban mian soup", "2-for-1 after 8pm"], ["Punggol Mee Goreng Mamak", "Mee goreng mamak", "Free for seniors after 8pm", "halal"], ["Coast Veg Bento", "Veg bento", "50% off last hour", "vegetarian"], ["Sumang Duck Noodle", "Duck noodle", "2-for-1 closing special"]]],
  ["Sengkang", "54", "Kopitiam Square Food Court", "Sengkang CC", "Sengkang Riverside Park", [["Anchorvale Chicken Rice", "Roasted chicken rice", "Free upsize today"], ["Rivervale Nasi Lemak", "Nasi lemak", "50% off after 8:30pm", "halal"], ["Compassvale Veg Rice", "Veg rice, 3 dishes", "2-for-1 before closing", "vegetarian"], ["Fernvale Teochew Porridge", "Porridge set", "Free extra portion"]]],
  ["Hougang & Serangoon", "53,55", "Chomp Chomp Food Centre", "Hougang CC", "Punggol Park", [["Kovan Hainanese Curry Rice", "Curry rice", "2-for-1 after 8pm"], ["Serangoon Mee Soto Asli", "Mee soto", "Free for seniors after 8pm", "halal"], ["Hougang Veg Beehoon", "Veg bee hoon", "50% off last hour", "vegetarian"], ["Lorong Ah Soo Satay", "10 pork satay", "2-for-1 closing special"]]],
  ["Yishun", "76", "Chong Pang Market", "Chong Pang CC", "Yishun Park", [["Chong Pang Nasi Lemak", "Nasi lemak", "Free upsize today", "halal"], ["Yishun Fishball Mee Pok", "Mee pok dry", "50% off after 8:30pm"], ["Nee Soon Veg Delight", "Veg rice set", "2-for-1 before closing", "vegetarian"], ["Khatib Wanton Mee", "Wanton mee", "Free extra portion"]]],
  ["Woodlands", "73", "Woodlands 888 Plaza Food Centre", "Woodlands CC", "Woodlands Waterfront Park", [["Marsiling Chicken Rice", "Chicken rice", "2-for-1 after 8pm"], ["Admiralty Mee Rebus", "Mee rebus", "Free for seniors after 8pm", "halal"], ["Woodlands Veg Kitchen", "Veg noodles", "50% off last hour", "vegetarian"], ["Causeway Kway Chap", "Kway chap set", "2-for-1 closing special"]]],
  ["Sembawang", "75", "Sembawang Hills Food Centre", "Sembawang CC", "Sembawang Park", [["Canberra Prawn Mee", "Prawn mee", "Free upsize today"], ["Pak Man Nasi Campur", "Nasi campur", "50% off after 8:30pm", "halal"], ["Wellington Veg Rice", "Veg rice set", "2-for-1 before closing", "vegetarian"], ["Sembawang Carrot Cake", "Black carrot cake", "Free extra portion"]]],
  ["Choa Chu Kang & Bukit Panjang", "67,68", "Teck Whye Market", "Choa Chu Kang CC", "Choa Chu Kang Park", [["Teck Whye Duck Rice", "Duck rice", "2-for-1 after 8pm"], ["Keat Hong Nasi Lemak", "Nasi lemak", "Free for seniors after 8pm", "halal"], ["Senja Veg Bee Hoon", "Veg bee hoon", "50% off last hour", "vegetarian"], ["Bangkit Yong Tau Foo", "Yong tau foo, 6 pcs", "2-for-1 closing special"]]],
  ["Bukit Batok", "65,66", "Bukit Batok 153 Market", "Bukit Batok CC", "Bukit Batok Nature Park", [["Batok Hainan Chicken", "Chicken rice", "Free upsize today"], ["Gombak Mee Siam", "Mee siam", "50% off after 8:30pm", "halal"], ["Hillview Veg Noodle", "Veg mee sua", "2-for-1 before closing", "vegetarian"], ["Guilin Fish Soup", "Fish soup", "Free extra portion"]]],
  ["Kallang & Whampoa", "32,33,39", "Whampoa Makan Place", "Kallang CC", "Kallang Riverside Park", [["Whampoa Prawn Noodle", "Prawn noodles", "2-for-1 after 8pm"], ["Balestier Nasi Padang", "Nasi padang set", "Free for seniors after 8pm", "halal"], ["Boon Keng Veg Rice", "Veg rice set", "50% off last hour", "vegetarian"], ["Bendemeer Bak Kut Teh", "Bak kut teh set", "2-for-1 closing special"]]],
  ["Little India & Jalan Besar", "20,21", "Tekka Centre", "Kampong Glam CC", "Farrer Park Field", [["Tekka Briyani House", "Mutton briyani", "Free upsize today", "halal"], ["Serangoon Road Thosai", "Masala thosai", "50% off after 8:30pm", "vegetarian"], ["Jalan Besar Chicken Rice", "Chicken rice", "2-for-1 before closing"], ["Race Course Idli Corner", "Idli set, 3 pcs", "Free extra portion", "vegetarian"]]],
];

export const neighbourhoods: Neighbourhood[] = rows.map(([name, sectors, centre, cc, park]) => ({
  name,
  sectors: sectors.split(","),
  centre,
  cc,
  park,
  stalls: [
    { name: `${name.split(" & ")[0]} Neighbourhood Bakery`, dish: "Closing-time bread and buns", price: "50% off before closing" },
    { name: `${name.split(" & ")[0]} Sushi Corner`, dish: "Fresh sushi selection", price: "50% off in the last hour" },
    { name: `${name.split(" & ")[0]} Fruit Stall`, dish: "Bulk oranges", price: "$2 for 5 oranges", diet: "vegetarian" },
    { name: `${name.split(" & ")[0]} Mixed Rice Stall`, dish: "Closing meal set", price: "2-for-1 before closing" },
  ],
}));

/** Finds the demo neighbourhood from a 6-digit postal code (by its first two digits) or an estate name. */
export function findNeighbourhood(text: string): { area: Neighbourhood; approximate: boolean; postal?: string } | null {
  const postal = text.match(/\b(\d{6})\b/)?.[1];
  if (postal) {
    const sector = Number(postal.slice(0, 2));
    const exact = neighbourhoods.find(n => n.sectors.includes(postal.slice(0, 2)));
    if (exact) return { area: exact, approximate: false, postal };
    const nearest = [...neighbourhoods].sort((a, b) => Math.min(...a.sectors.map(s => Math.abs(Number(s) - sector))) - Math.min(...b.sectors.map(s => Math.abs(Number(s) - sector))))[0];
    return nearest ? { area: nearest, approximate: true, postal } : null;
  }
  const lower = text.toLowerCase()
    .replace(/\bamk\b/, "ang mo kio")
    .replace(/\btpy\b/, "toa payoh")
    .replace(/\bj(?:urong)?\s*west\b/, "jurong west")
    .replace(/\bj(?:urong)?\s*east\b/, "jurong east");
  if (/\bjurong\b/.test(lower) && !/\bjurong (?:east|west)\b/.test(lower)) {
    const jurongWest = neighbourhoods.find(n => n.name === "Jurong West");
    return jurongWest ? { area: jurongWest, approximate: true } : null;
  }
  const byName = neighbourhoods.find(n => n.name.toLowerCase().split(/ & /).some(part => lower.includes(part)));
  return byName ? { area: byName, approximate: false } : null;
}
