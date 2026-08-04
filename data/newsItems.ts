export type NewsItem = {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  tags: string[];
};

export const newsItems: NewsItem[] = [
  {
    id: "news-001",
    title: "狗來富！愛犬耳疾意外創業 她打造出80億寵物食品王國還親自試吃",
    source: "自由財經",
    date: "2026-07-31",
    summary:
      "英國創業家 Lucy Postins 因愛犬長期耳疾困擾，親自下廚將鮮食脫水製成保存更方便的狗食，2002年創立 The Honest Kitchen，如今發展成規模達2.5億美元的寵物食品企業，至今仍會親自試吃確認產品品質。",
    url: "https://ec.ltn.com.tw/article/breakingnews/5524456",
    tags: ["產業動態"],
  },
  {
    id: "news-002",
    title: "獨家》寵物食品未訂「苯駢芘」標準 農業部：用到毒油即移動管制",
    source: "自由時報",
    date: "2026-07-08",
    summary:
      "中聯油脂沙拉油致癌物「苯駢芘」超標事件延燒，農業部表示全球目前均未對寵物食品訂定苯駢芘標準，但已要求地方政府一旦接獲通報有業者使用問題油品，須立即調查並移動管制；經追查目前僅一家業者曾進貨問題油，但未用於製造飼料本身。",
    url: "https://news.ltn.com.tw/news/life/breakingnews/5498572",
    tags: ["食安", "飼料"],
  },
  {
    id: "news-003",
    title: "賴清德逛寵物展試吃「狗肉乾」大讚好吃 幕僚、隨扈吃驚瞪大眼",
    source: "自由時報",
    date: "2026-07-03",
    summary:
      "總統賴清德出席台北寵物用品展開幕典禮，在攤位上試吃無添加物、「人也可以吃」的寵物肉乾，直呼很香、很棒、好吃，還當場買了4包帶回家，逗趣反應讓隨扈與幕僚都嚇了一跳。",
    url: "https://news.ltn.com.tw/news/politics/breakingnews/5492641",
    tags: ["零食", "時事"],
  },
  {
    id: "news-004",
    title: "毛小孩也想清涼一夏 寵物食品業者推專用優格冰淇淋",
    source: "自由時報",
    date: "2026-06-25",
    summary:
      "業者攜手獸醫師、營養師開發寵物專用冰淇淋，添加龍根菌等10種益生菌，推出原味、羊奶、藍莓三種口味；獸醫師提醒僅能作為補充食品，小型犬貓建議每日食用1/3至1/4盒，無法取代正餐。",
    url: "https://news.ltn.com.tw/news/life/breakingnews/5483822",
    tags: ["零食", "新品"],
  },
  {
    id: "news-005",
    title: "超萌貓型觀光工廠投產 搶攻逾百億貓食商機",
    source: "自由財經",
    date: "2026-04-01",
    summary:
      "隆順漁業集團與泰山前董事長共同創辦的「愛貓一生」貓型觀光工廠開幕，導入全自動產線、每小時可生產約4000杯主食產品，以台灣在地退役母鴨母雞結合海產原料，製成肉含量達95%的主食罐，訴求全程不使用化學添加物。",
    url: "https://ec.ltn.com.tw/article/breakingnews/5389963",
    tags: ["罐頭", "產業動態"],
  },
];
