export const categoryIds = [
  "alcohol",
  "twd",
  "foreign",
  "shopping",
  "combined",
] as const;

export type CategoryId = (typeof categoryIds)[number];

export type Category = {
  id: CategoryId;
  shortName: string;
  name: string;
  checkpoint: string;
  rule: string;
};

export type Question = {
  id: string;
  category: CategoryId;
  prompt: string;
  mustDeclare: boolean;
};

export const categories: Record<CategoryId, Category> = {
  alcohol: {
    id: "alcohol",
    shortName: "酒類",
    name: "酒類申報",
    checkpoint: "1.5 L",
    rule: "所有酒類合計超過 1.5 公升才須申報；剛好 1.5 公升不算超過。",
  },
  twd: {
    id: "twd",
    shortName: "臺幣",
    name: "臺幣現金",
    checkpoint: "NT$ 10萬",
    rule: "新臺幣現金合計超過 10 萬元才須申報；紙鈔、硬幣與分裝金額都要合計。",
  },
  foreign: {
    id: "foreign",
    shortName: "外幣",
    name: "外幣現金",
    checkpoint: "US$ 1萬",
    rule: "外幣現金合計超過等值 1 萬美元才須申報；剛好等值 1 萬美元不算超過。",
  },
  shopping: {
    id: "shopping",
    shortName: "購物",
    name: "購物商品",
    checkpoint: "NT$ 3.5萬",
    rule: "一般自用、家用商品完稅價格合計超過 3.5 萬元才須申報。",
  },
  combined: {
    id: "combined",
    shortName: "綜合",
    name: "綜合判斷",
    checkpoint: "任一超標",
    rule: "各類別分開依門檻判斷；只要其中一類超過規定，就須申報。",
  },
};

const yes = true;
const no = false;

const alcoholData: Array<[number, number, boolean]> = [
  [1, 1000, no], [2, 750, no], [3, 600, yes], [2, 700, no],
  [4, 375, no], [5, 375, yes], [6, 250, no], [4, 400, yes],
  [3, 500, no], [2, 1000, yes], [1, 1500, no], [1, 1750, yes],
  [5, 300, no], [7, 250, yes], [3, 400, no], [2, 500, no],
  [4, 500, yes], [6, 200, no], [8, 200, yes], [1, 750, no],
];

const twdData: Array<[number, boolean]> = [
  [50000, no], [100000, no], [110000, yes], [90000, no], [120000, yes],
  [75000, no], [101000, yes], [80000, no], [99999, no], [100500, yes],
  [60000, no], [150000, yes], [95000, no], [130000, yes], [70000, no],
  [105000, yes], [40000, no], [100001, yes], [85000, no], [200000, yes],
];

const foreignData: Array<[number, boolean]> = [
  [5000, no], [10000, no], [11000, yes], [9000, no], [12000, yes],
  [7500, no], [10100, yes], [8000, no], [9999, no], [10500, yes],
  [6000, no], [15000, yes], [9500, no], [13000, yes], [7000, no],
  [10050, yes], [4000, no], [10001, yes], [8500, no], [20000, yes],
];

const shoppingData: Array<[number, number, boolean]> = [
  [20000, 20000, yes], [20000, 10000, no], [28000, 8000, yes],
  [25000, 10000, no], [12000, 25000, yes], [10000, 12000, no],
  [18000, 18000, yes], [15000, 15000, no], [30000, 6000, yes],
  [30000, 5000, no], [20000, 16000, yes], [14000, 18000, no],
  [25000, 15000, yes], [17000, 17000, no], [22000, 14000, yes],
  [19000, 16000, no], [18000, 12000, no], [10000, 26000, yes],
  [32000, 3000, no], [9000, 28000, yes],
];

const combinedData: Array<[string, boolean]> = [
  ["入境攜帶 1 公升酒及新臺幣 12 萬元現金，須申報嗎？", yes],
  ["入境攜帶 1 公升酒及新臺幣 8 萬元現金，須申報嗎？", no],
  ["入境攜帶 1.5 公升酒及 10,000 美元（US$），須申報嗎？", no],
  ["入境攜帶 2 公升酒及 5,000 美元（US$），須申報嗎？", yes],
  ["入境攜帶 1 公升酒及新買商品（價值新臺幣 40,000 元），須申報嗎？", yes],
  ["入境攜帶 1 公升酒及新買商品（價值新臺幣 30,000 元），須申報嗎？", no],
  ["入境攜帶新臺幣 11 萬元及新買商品（價值新臺幣 20,000 元），須申報嗎？", yes],
  ["入境攜帶新臺幣 9 萬元及新買商品（價值新臺幣 35,000 元），須申報嗎？", no],
  ["入境攜帶 11,000 美元（US$）及新臺幣 5 萬元，須申報嗎？", yes],
  ["入境攜帶 8,000 美元（US$）及新臺幣 10 萬元，須申報嗎？", no],
  ["入境攜帶酒 750 毫升及新買商品（價值新臺幣 36,000 元），須申報嗎？", yes],
  ["入境攜帶酒 750 毫升及新買商品（價值新臺幣 25,000 元），須申報嗎？", no],
  ["入境攜帶新臺幣 100,500 元及酒 500 毫升，須申報嗎？", yes],
  ["入境攜帶新臺幣 100,000 元及酒 1.5 公升，須申報嗎？", no],
  ["入境攜帶 9,000 美元（US$）及新買商品（價值新臺幣 38,000 元），須申報嗎？", yes],
  ["入境攜帶 10,000 美元（US$）及新買商品（價值新臺幣 30,000 元），須申報嗎？", no],
  ["入境攜帶酒 2 公升及新臺幣 9 萬元，須申報嗎？", yes],
  ["入境攜帶酒 1 公升及新臺幣 11 萬元，須申報嗎？", yes],
  ["入境攜帶 12,000 美元（US$）及酒 1 公升，須申報嗎？", yes],
  ["入境攜帶 6,000 美元（US$）、酒 1 公升及新買商品（價值新臺幣 35,000 元），須申報嗎？", no],
];

const formatNumber = (value: number) => value.toLocaleString("en-US");
const id = (value: number) => String(value).padStart(3, "0");

export const questions: Question[] = [
  ...alcoholData.map(([bottles, ml, mustDeclare], index) => ({
    id: id(index + 1),
    category: "alcohol" as const,
    prompt: `攜帶 ${bottles} 瓶酒，每瓶 ${formatNumber(ml)} 毫升，須申報嗎？`,
    mustDeclare,
  })),
  ...twdData.map(([amount, mustDeclare], index) => ({
    id: id(index + 21),
    category: "twd" as const,
    prompt: `攜帶新臺幣 ${formatNumber(amount)} 元現金，須申報嗎？`,
    mustDeclare,
  })),
  ...foreignData.map(([amount, mustDeclare], index) => ({
    id: id(index + 41),
    category: "foreign" as const,
    prompt: `攜帶 ${formatNumber(amount)} 美元（US$）現金，須申報嗎？`,
    mustDeclare,
  })),
  ...shoppingData.map(([clothes, shoes, mustDeclare], index) => ({
    id: id(index + 61),
    category: "shopping" as const,
    prompt: `入境攜帶新買商品（均為新臺幣）：衣服 ${formatNumber(clothes)} 元、鞋子 ${formatNumber(shoes)} 元，須申報嗎？`,
    mustDeclare,
  })),
  ...combinedData.map(([prompt, mustDeclare], index) => ({
    id: id(index + 81),
    category: "combined" as const,
    prompt,
    mustDeclare,
  })),
];
