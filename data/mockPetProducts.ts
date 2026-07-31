export type PetProductCategory =
  | "貓咪主食罐"
  | "貓咪乾糧"
  | "貓砂/用品"
  | "狗狗主食罐"
  | "狗狗乾糧"
  | "毛孩保健品";

/** 「貓砂/用品」分類專用的子分類，用於下拉篩選 */
export type LitterSubCategory = "礦砂" | "豆腐砂" | "用品";

export interface PetProductReview {
  /** 工程師毛拔麻的一句話短評 */
  comment: string;
}

export type CatVerdict = "like" | "neutral" | "dislike";

export interface CatRating {
  /** 本站三貓的名字，例如：本丸、海苔、麻糬 */
  cat: string;
  verdict: CatVerdict;
}

/** 完整保證分析對照表所需的原始數據，皆為包裝標示的「以現狀為準」數值 */
export interface PetProductDetailedAnalysis {
  /** 商品型態標籤，例如：肉泥、主食罐 */
  productType?: string;
  /** 成分表全文 */
  ingredientsText: string;
  /** 產地 */
  originCountry: string;
  /** 保證分析（以現狀為準，%） */
  moisture: number;
  protein: number;
  fat: number;
  fiber: number;
  ash: number;
  phosphorus: number;
  /** 鈣（%），選填 */
  calcium?: number;
  /** 鈣磷比，包裝標示文字，例如 "1.2"，選填 */
  caPhosRatio?: string;
  /** 鈉（%），選填 */
  sodium?: number;
  /** 熱量 kcal/100g */
  kcalPer100g: number;
  /** 容量（g） */
  weightGrams: number;
  /** 定價（未折扣） */
  listPrice: number;
  /** 售價（實際販售價） */
  salePrice: number;
}

/** 官方僅部分揭露保證分析數值時使用，原樣列出已知數字，不做 DM/ME 換算 */
export interface PetProductPartialNutrition {
  /** 成分表全文，選填 */
  ingredientsText?: string;
  /** 已知的官方標示項目，例如 { label: "蛋白質(min)", value: "9.0%" } */
  items: { label: string; value: string }[];
  /** 說明為何無法提供完整保證分析對照表 */
  note: string;
  /** 已知的概略數值（%，以現狀為準），有提供才會估算部分評分；缺灰分故用於估算的碳水會偏保守（略高） */
  estimateInputs?: {
    protein?: number;
    fat?: number;
    fiber?: number;
    moisture?: number;
  };
}

/** 農業部寵物食品申報網單筆申報紀錄 */
export interface PetProductOfficialFilingRecord {
  /** 規格，例如 "1.36 公斤" */
  spec: string;
  /** 申報方式：製造、加工／委託代工廠製造／輸入／分裝 */
  sourceType: string;
  /** 產地，未標示則為 "—" */
  origin: string;
  /** 業者名稱 */
  company: string;
  /** 代工廠，未標示則為 "—" */
  subcontractor: string;
}

/** 農業部寵物食品申報網查詢結果快照（人工查詢後靜態記錄，非即時串接） */
export interface PetProductOfficialFiling {
  /** 查詢日期，例如 "2026-07-30" */
  queryDate: string;
  records: PetProductOfficialFilingRecord[];
}

export interface PetProduct {
  id: string;
  category: PetProductCategory;
  brand: string;
  name: string;
  /** 商品圖片網址（示意圖，正式上線請替換為實拍圖） */
  image: string;
  /** 完整保證分析對照表，選填，補齊後會在商品卡片顯示詳細表格 */
  detailedAnalysis?: PetProductDetailedAnalysis;
  /** 官方僅部分揭露保證分析數值時使用，與 detailedAnalysis 互斥 */
  partialNutrition?: PetProductPartialNutrition;
  /** 農業部寵物食品申報網查詢結果，人工核對後靜態記錄 */
  officialFiling?: PetProductOfficialFiling;
  /** Engineering Debug 標籤，例如 [無膠/低敏]、[乾物質碳水 5.2%] */
  debugTags: string[];
  /** 特色標籤，例如 ['零澱粉', '零穀物', '單一肉源'] */
  features?: string[];
  /** 乾物質基礎碳水化合物比例（DMB, %） */
  dmbCarb?: number;
  /** 包裝是否標示符合 AAFCO / FEDIAF 營養標準 */
  aafcoCertified?: boolean;
  /** 包裝標示的營養標準名稱，預設 "AAFCO" */
  certStandard?: "AAFCO" | "FEDIAF";
  /** 包裝是否標示符合 NRC 營養標準 */
  nrcCertified?: boolean;
  /** 本站三貓（本丸／海苔／麻糬）試吃心得 */
  ourCatsRating?: CatRating[];
  review: PetProductReview;
  price: number;
  originalPrice?: number;
  discountNote?: string;
  /** 僅「貓砂/用品」分類使用：礦砂／豆腐砂／用品 */
  litterSubCategory?: LitterSubCategory;
  /** 外站導購連結 */
  affiliateUrl: string;
}

export const mockPetProducts: PetProduct[] = [
  {
    id: "cat-can-000",
    category: "貓咪主食罐",
    brand: "nu4PET 陪心寵糧",
    name: "Super貓小白主食罐 (鮮雞 x 蒲公英)",
    image: "/images/products/nu4pet-super-cat.png",
    debugTags: ["無膠"],
    features: [
      "零澱粉",
      "零穀物",
      "無添加爭議性膠類",
      "低磷",
      "超低碳水",
      "雞肉",
      "雞心",
    ],
    dmbCarb: 5.36,
    detailedAnalysis: {
      productType: "肉泥",
      ingredientsText:
        "雞肉、雞心、雞油、蛋黃粉、魚油、磷酸鈣、乾燥海帶、洋車前子、酵母維生素B群、綜合礦物質(鋅、鐵、銅、錳、碘)、綜合維生素(A、D3、E)、半乳寡糖、蒟蒻粉、蒲公英肽、水溶性纖維素、牛磺酸、酵母抽出物、碳酸鈣。",
      originCountry: "台灣",
      moisture: 83.2,
      protein: 10.5,
      fat: 4,
      fiber: 0.5,
      ash: 0.9,
      phosphorus: 0.17,
      calcium: 0.2,
      caPhosRatio: "1.2",
      sodium: 0.04,
      kcalPer100g: 82,
      weightGrams: 80,
      listPrice: 46,
      salePrice: 46,
    },
    officialFiling: {
      queryDate: "2026-07-30",
      records: [
        {
          spec: "80g（0.08±0.002公斤）",
          sourceType: "製造、加工",
          origin: "—",
          company: "唯寵股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    nrcCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "neutral" },
    ],
    review: {
      comment:
        "鮮雞搭配蒲公英，配方乾淨無爭議性膠類增稠，DMB 碳水控制得很低，本丸跟海苔一吃就愛上。",
    },
    price: 46,
    affiliateUrl: "https://s.shopee.tw/2LX3cefdNR",
  },
  {
    id: "cat-can-001",
    category: "貓咪主食罐",
    brand: "nu4PET 陪心寵糧",
    name: "Super貓小白主食罐 (雞甲魚 x 大麥草)",
    image: "/images/products/nu4pet-super-cat-chicken-turtle-barley.png",
    debugTags: ["無膠"],
    features: ["零澱粉", "零穀物", "低磷", "超低碳水", "雞肉", "甲魚", "雞心"],
    dmbCarb: 4.7,
    detailedAnalysis: {
      productType: "肉泥",
      ingredientsText:
        "雞肉、甲魚、雞心、雞油、魚油、洋車前子、磷酸鈣、酵母維生素B群、乾燥海帶、牛乳寡糖、綜合維生素(A、D3、E)、綜合礦物質(鋅、鐵、銅、錳、碘)、大麥草、蒟蒻粉、水溶性纖維素、牛磺酸、酵母抽出物。",
      originCountry: "台灣",
      moisture: 83,
      protein: 10.7,
      fat: 4,
      fiber: 0.5,
      ash: 1,
      phosphorus: 0.15,
      calcium: 0.17,
      caPhosRatio: "1.1",
      sodium: 0.04,
      kcalPer100g: 82,
      weightGrams: 80,
      listPrice: 46,
      salePrice: 46,
    },
    officialFiling: {
      queryDate: "2026-07-30",
      records: [
        {
          spec: "80g（0.08±0.002公斤）",
          sourceType: "製造、加工",
          origin: "—",
          company: "唯寵股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    nrcCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
    ],
    review: {
      comment:
        "雞肉甲魚搭配大麥草，無添加膠類增稠，零澱粉零穀物、低磷配方，DMB 碳水控制在超低水平，本丸、海苔、麻糬三隻都捧場。",
    },
    price: 46,
    affiliateUrl: "https://s.shopee.tw/3Vj2SLnkCR",
  },
  {
    id: "cat-can-002",
    category: "貓咪主食罐",
    brand: "nu4PET 陪心寵糧",
    name: "Super貓小白主食罐 (鮪魚 x 優格)",
    image: "/images/products/nu4pet-super-cat-tuna-yogurt.png",
    debugTags: ["無膠"],
    features: ["零澱粉", "零穀物", "低磷", "鮪魚"],
    dmbCarb: 11.5,
    detailedAnalysis: {
      productType: "肉泥",
      ingredientsText:
        "鮪魚、雞油、蛋黃粉、乾燥海帶、洋車前子、酵母維生素B群、綜合維生素(A、D3、E)、綜合礦物質(鋅、鐵、銅、錳、碘)、半乳寡糖、磷酸鈣、蒟蒻粉、碳酸鈣、水溶性纖維素、優格粉、牛磺酸、酵母抽出物。",
      originCountry: "台灣",
      moisture: 80,
      protein: 11.4,
      fat: 4.8,
      fiber: 0.3,
      ash: 1.2,
      phosphorus: 0.18,
      calcium: 0.2,
      sodium: 0.14,
      kcalPer100g: 98,
      weightGrams: 80,
      listPrice: 46,
      salePrice: 46,
    },
    officialFiling: {
      queryDate: "2026-07-30",
      records: [
        {
          spec: "80g（0.08±0.002公斤）",
          sourceType: "製造、加工",
          origin: "—",
          company: "唯寵股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    nrcCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
    ],
    review: {
      comment:
        "鮪魚搭配優格，零澱粉零穀物、低磷配方，DMB 碳水控制在超低水平，本丸、海苔、麻糬三隻都捧場。",
    },
    price: 46,
    affiliateUrl: "https://s.shopee.tw/3Vj2SLnkCR",
  },
  {
    id: "cat-can-003",
    category: "貓咪主食罐",
    brand: "nu4PET 陪心寵糧",
    name: "Super貓小白主食罐 (石斑魚 x 奇亞籽)",
    image: "/images/products/nu4pet-super-cat-grouper-chiaseed.png",
    debugTags: ["無膠"],
    features: ["零澱粉", "零穀物", "低磷", "超低碳水", "石斑魚"],
    detailedAnalysis: {
      productType: "肉泥",
      ingredientsText:
        "石斑魚、雞油、蛋黃粉、酵母維生素B群、洋車前子、乾燥海帶、綜合維生素(A、D3、E)、綜合礦物質(鋅、鐵、銅、錳、碘)、半乳寡糖、磷酸鈣、奇亞籽、蒟蒻粉、水溶性纖維素、牛磺酸、碳酸鈣、酵母抽出物。",
      originCountry: "台灣",
      moisture: 83.7,
      protein: 9.6,
      fat: 4.3,
      fiber: 0.5,
      ash: 1,
      phosphorus: 0.16,
      calcium: 0.18,
      sodium: 0.04,
      kcalPer100g: 81,
      weightGrams: 80,
      listPrice: 65,
      salePrice: 65,
    },
    officialFiling: {
      queryDate: "2026-07-30",
      records: [
        {
          spec: "80g（0.08±0.002公斤）",
          sourceType: "製造、加工",
          origin: "—",
          company: "唯寵股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    dmbCarb: 5.52,
    aafcoCertified: true,
    nrcCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
    ],
    review: {
      comment:
        "石斑魚搭配奇亞籽，零澱粉零穀物、低磷配方，DMB 碳水控制在超低水平，本丸、海苔、麻糬三隻都愛吃。",
    },
    price: 65,
    affiliateUrl: "https://s.shopee.tw/3Vj2SLnkCR",
  },
  {
    id: "cat-can-004",
    category: "貓咪主食罐",
    brand: "nu4PET 陪心寵糧",
    name: "Super貓小白主食罐 (鵝肉 x 紅藜)",
    image: "/images/products/nu4pet-super-cat-goose-redquinoa.png",
    debugTags: ["無膠"],
    features: ["零澱粉", "零穀物", "低磷", "超低碳水", "鵝肉"],
    dmbCarb: 5.45,
    detailedAnalysis: {
      productType: "肉泥",
      ingredientsText:
        "雞肉、帶骨鵝肉、雞油、蛋黃粉、磷酸鈣、魚油、洋車前子、酵母維生素B群、乾燥海帶、綜合維生素(A、D3、E)、綜合礦物質(鋅、鐵、銅、錳、碘)、半乳寡糖、紅藜、蒟蒻粉、水溶性纖維素、牛磺酸、酵母抽出物。",
      originCountry: "台灣",
      moisture: 83.5,
      protein: 9.1,
      fat: 4.9,
      fiber: 0.5,
      ash: 1.1,
      phosphorus: 0.17,
      calcium: 0.2,
      sodium: 0.04,
      kcalPer100g: 84,
      weightGrams: 80,
      listPrice: 46,
      salePrice: 46,
    },
    officialFiling: {
      queryDate: "2026-07-30",
      records: [
        {
          spec: "80g（0.08±0.002公斤）",
          sourceType: "製造、加工",
          origin: "—",
          company: "唯寵股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    nrcCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
    ],
    review: {
      comment:
        "鵝肉搭配紅藜，零澱粉零穀物、低磷配方，DMB 碳水控制在超低水平，本丸、海苔、麻糬三隻都捧場。",
    },
    price: 46,
    affiliateUrl: "https://s.shopee.tw/3Vj2SLnkCR",
  },
  {
    id: "cat-can-005",
    category: "貓咪主食罐",
    brand: "nu4PET 陪心寵糧",
    name: "Super貓小白主食罐 (雞魚 x 野莓)",
    image: "/images/products/nu4pet-super-cat-chicken-fish-wildberry.png",
    debugTags: ["無膠"],
    features: ["野莓"],
    dmbCarb: 10.47,
    detailedAnalysis: {
      productType: "肉泥",
      ingredientsText:
        "雞肉、白身鮪魚、雞油、雞心、雞肝、乾燥蛋黃、鱈魚魚油、乾燥海帶、洋車前子、酵母維生素B群、磷酸鈣、半乳寡糖、水溶性纖維素、碳酸鈣、蒟蒻粉、綜合維生素(A、D3、E)、綜合礦物質(鋅、鐵、銅、錳、碘)、野莓、牛磺酸、酵母萃取物。",
      originCountry: "台灣",
      moisture: 82.8,
      protein: 10.1,
      fat: 4.1,
      fiber: 0.2,
      ash: 1.0,
      phosphorus: 0.15,
      calcium: 0.18,
      sodium: 0.1,
      kcalPer100g: 85,
      weightGrams: 80,
      listPrice: 46,
      salePrice: 46,
    },
    officialFiling: {
      queryDate: "2026-07-30",
      records: [
        {
          spec: "80g（0.08±0.002公斤）",
          sourceType: "製造、加工",
          origin: "—",
          company: "唯寵股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
    ],
    review: {
      comment:
        "雞魚搭配野莓，配方乾淨無爭議性膠類增稠，DMB 碳水約 10.5%、鈣磷比約 1.2:1，本丸、海苔、麻糬都愛吃。",
    },
    price: 46,
    affiliateUrl: "https://s.shopee.tw/50XrvlsC3s",
  },
  {
    id: "cat-can-006",
    category: "貓咪主食罐",
    brand: "沙發馬鈴薯",
    name: "貓 POWER超能主食罐 (活力野鮭)",
    image: "/images/products/sofapotato-power-cat-wildsalmon.png",
    debugTags: ["無膠"],
    features: ["鮭魚"],
    dmbCarb: 1.7,
    detailedAnalysis: {
      ingredientsText:
        "鮭魚、蛋黃粉、磷酸鈣、酵母維生素B群、綜合維生素(A、D3、E)、綜合礦物質(鋅、鐵、銅、錳、鉀)、半乳寡糖、水溶性纖維素、木鱉果粉、蒟蒻粉、酵母抽出物、牛磺酸。",
      originCountry: "台灣",
      moisture: 82.4,
      protein: 9,
      fat: 6.8,
      fiber: 0.5,
      ash: 1,
      phosphorus: 0.2,
      calcium: 0.2,
      sodium: 0.07,
      kcalPer100g: 98,
      weightGrams: 80,
      listPrice: 49,
      salePrice: 49,
    },
    officialFiling: {
      queryDate: "2026-07-30",
      records: [
        {
          spec: "80g（0.08±0.002公斤）",
          sourceType: "製造、加工",
          origin: "—",
          company: "唯寵股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
    ],
    review: {
      comment:
        "沙發馬鈴薯 POWER超能主食罐鮭魚口味，DMB 碳水極低（約1.7%），符合 AAFCO 標準，本丸、海苔、麻糬都愛吃。鈣磷比剛好1:1，略低於理想範圍 1.1-1.4，建議留意。",
    },
    price: 49,
    affiliateUrl: "https://s.shopee.tw/40fKkljaXg",
  },
  {
    id: "cat-can-007",
    category: "貓咪主食罐",
    brand: "沙發馬鈴薯",
    name: "貓 POWER超能主食罐 (海陸雞魚)",
    image: "/images/products/sofapotato-power-cat-chickenfish.png",
    debugTags: ["無膠"],
    features: ["雞肉", "鮪魚"],
    dmbCarb: 4.44,
    detailedAnalysis: {
      ingredientsText:
        "鮪魚、雞肉、雞油、雞肝、蛋黃粉、魚油、酵母維生素B群、綜合維生素(A、D3、E)、綜合礦物質(鋅、鐵、銅、錳、鉀)、半乳寡糖、碳酸鈣磷酸鈣、水溶性纖維素、蒟蒻粉、松樹皮萃取物、酵母抽出物、牛磺酸。",
      originCountry: "台灣",
      moisture: 82,
      protein: 10.2,
      fat: 5.5,
      fiber: 0.5,
      ash: 1,
      phosphorus: 0.18,
      calcium: 0.19,
      caPhosRatio: "1.06",
      sodium: 0.1,
      kcalPer100g: 94,
      weightGrams: 80,
      listPrice: 49,
      salePrice: 49,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "80g（0.08±0.002公斤）",
          sourceType: "製造、加工",
          origin: "—",
          company: "唯寵股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
    ],
    review: {
      comment:
        "沙發馬鈴薯 POWER超能主食罐海陸雞魚口味，鮪魚+雞肉雙主料，DMB 碳水約 4.44%，符合 AAFCO 標準，本丸、海苔、麻糬都愛吃。鈣磷比約1.06，略低於理想範圍 1.1-1.4，建議留意。",
    },
    price: 49,
    affiliateUrl: "https://s.shopee.tw/80BUfmaLOk",
  },
  {
    id: "cat-can-008",
    category: "貓咪主食罐",
    brand: "沙發馬鈴薯",
    name: "貓 Pure純粹主食罐 (溫體純雞肉)",
    image: "/images/products/sofapotato-pure-cat-chicken.png",
    debugTags: ["無膠"],
    features: ["雞肉"],
    dmbCarb: 4.21,
    detailedAnalysis: {
      ingredientsText:
        "雞肉(台灣)、雞油、雞肝、魚油、磷酸鈣、離胺酸、蒟蒻粉、水溶性纖維素、酵母維生素B群、綜合維生素(A、D3、E)、綜合礦物質(鋅、鐵、銅、錳、鉀)、半乳寡糖、海藻鈣、酵母抽出物、牛磺酸。",
      originCountry: "台灣",
      moisture: 81,
      protein: 12,
      fat: 5,
      fiber: 0.2,
      ash: 1,
      phosphorus: 0.21,
      calcium: 0.26,
      caPhosRatio: "1.24",
      sodium: 0.06,
      kcalPer100g: 95,
      weightGrams: 80,
      listPrice: 55,
      salePrice: 55,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "80g（0.08±0.002公斤）",
          sourceType: "製造、加工",
          origin: "—",
          company: "唯寵股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "neutral" },
    ],
    review: {
      comment:
        "沙發馬鈴薯 Pure純粹主食罐溫體純雞肉口味，單一雞肉來源、成分乾淨，符合 AAFCO 標準，本丸、海苔都愛吃，麻糬看心情。賣場標示粗纖維0.5%，但官方申報實際為0.2%，DMB碳水以官方數據計算約4.21%。",
    },
    price: 55,
    affiliateUrl: "https://s.shopee.tw/5LAjXLajSy",
  },
  {
    id: "cat-can-009",
    category: "貓咪主食罐",
    brand: "凱力女神",
    name: "單一蛋白質主食罐 無膠罐 全肉主食罐 頂級貓罐 (有機好火雞)",
    image: "/images/products/kailigoddess-organic-turkey.png",
    debugTags: ["無膠"],
    features: ["火雞肉", "單一蛋白質"],
    dmbCarb: 6.81,
    detailedAnalysis: {
      ingredientsText:
        "98.50%火雞（火雞肉、身體、心、頸、肝，來自有機生態農場）、0.95%啤酒酵母、0.55%礦物質。每公斤額外添加維他命A 1000 IU、維他命D3 100 IU、鐵22mg、銅1.5mg、錳1.5mg、鋅25mg、硒0.10mg、牛磺酸1300mg。",
      originCountry: "德國",
      moisture: 78.86,
      protein: 9.27,
      fat: 7.49,
      fiber: 0.46,
      ash: 2.48,
      phosphorus: 0.34,
      calcium: 0.57,
      caPhosRatio: "1.69",
      kcalPer100g: 105.84,
      weightGrams: 200,
      listPrice: 72,
      salePrice: 72,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Canelis UG (haftungsbeschrankt)",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    ourCatsRating: [
      { cat: "三色蛋", verdict: "like" },
      { cat: "烏克", verdict: "like" },
    ],
    review: {
      comment:
        "凱力女神有機好火雞單一蛋白質主食罐，德國原裝進口，火雞肉來自有機生態農場，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。磷含量偏高（約321mg/100kcal），鈣磷比約1.69，略超出理想範圍，建議留意。",
    },
    price: 72,
    affiliateUrl: "https://s.shopee.tw/4AymAAtmJ3",
  },
  {
    id: "cat-can-010",
    category: "貓咪主食罐",
    brand: "凱力女神",
    name: "單一蛋白質主食罐 無膠罐 全肉主食罐 頂級貓罐 (有機家禽)",
    image: "/images/products/kailigoddess-organic-poultry.png",
    debugTags: ["無膠"],
    features: ["單一蛋白質"],
    dmbCarb: 6.89,
    detailedAnalysis: {
      ingredientsText:
        "98.50%家禽（家禽肉、身體、心、頸、肝，來自有機生態農場）、0.95%啤酒酵母、0.55%礦物質。每公斤額外添加維他命A 1000 IU、維他命D3 100 IU、鐵22mg、銅1.5mg、錳1.5mg、鋅25mg、硒0.10mg、牛磺酸1300mg。",
      originCountry: "德國",
      moisture: 79.09,
      protein: 9.27,
      fat: 7.32,
      fiber: 0.45,
      ash: 2.43,
      phosphorus: 0.33,
      calcium: 0.54,
      caPhosRatio: "1.64",
      kcalPer100g: 104.28,
      weightGrams: 200,
      listPrice: 69,
      salePrice: 69,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Canelis UG (haftungsbeschrankt)",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    review: {
      comment:
        "凱力女神有機家禽單一蛋白質主食罐，德國原裝進口，家禽肉來自有機生態農場，成分乾淨無爭議性膠類，符合 FEDIAF 標準。磷含量偏高（約317mg/100kcal），鈣磷比約1.64，略超出理想範圍，建議留意。",
    },
    price: 69,
    affiliateUrl: "https://s.shopee.tw/4AymAAtmJ3",
  },
  {
    id: "cat-can-011",
    category: "貓咪主食罐",
    brand: "凱力女神",
    name: "單一蛋白質主食罐 無膠罐 全肉主食罐 頂級貓罐 (有機雞肉)",
    image: "/images/products/kailigoddess-organic-chicken.png",
    debugTags: ["無膠"],
    features: ["雞肉", "單一蛋白質"],
    dmbCarb: 6.14,
    detailedAnalysis: {
      ingredientsText:
        "98.50%雞（雞肉、身體、心、頸、肝，來自有機生態農場）、0.95%啤酒酵母、0.55%礦物質。每公斤額外添加維他命A 1000 IU、維他命D3 100 IU、鐵22mg、銅1.5mg、錳1.5mg、鋅25mg、硒0.10mg、牛磺酸1300mg。",
      originCountry: "德國",
      moisture: 79.16,
      protein: 9.13,
      fat: 7.31,
      fiber: 0.45,
      ash: 2.67,
      phosphorus: 0.4,
      calcium: 0.54,
      caPhosRatio: "1.33",
      kcalPer100g: 103.62,
      weightGrams: 200,
      listPrice: 72,
      salePrice: 72,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Canelis UG (haftungsbeschrankt)",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    review: {
      comment:
        "凱力女神有機雞肉單一蛋白質主食罐，德國原裝進口，雞肉來自有機生態農場，成分乾淨無爭議性膠類，符合 FEDIAF 標準。磷含量偏高（約386mg/100kcal，接近上限），鈣磷比約1.33落在理想範圍內。",
    },
    price: 72,
    affiliateUrl: "https://s.shopee.tw/4AymAAtmJ3",
  },
  {
    id: "cat-can-012",
    category: "貓咪主食罐",
    brand: "凱力女神",
    name: "單一蛋白質主食罐 無膠罐 全肉主食罐 頂級貓罐 (雞 x 雞心)",
    image: "/images/products/kailigoddess-chicken-heart.png",
    debugTags: ["無膠"],
    features: ["雞肉", "雞心", "單一蛋白質"],
    dmbCarb: 5.72,
    detailedAnalysis: {
      ingredientsText:
        "98.50%雞（雞肉、身體、10%心、頸、肝）、0.95%啤酒酵母、0.55%礦物質。每公斤額外添加維他命A 1000 IU、維他命D3 100 IU、鐵22mg、銅1.5mg、錳1.5mg、鋅25mg、硒0.10mg、牛磺酸1300mg。",
      originCountry: "德國",
      moisture: 79.9,
      protein: 9.9,
      fat: 6.44,
      fiber: 0.46,
      ash: 2.15,
      phosphorus: 0.28,
      calcium: 0.44,
      caPhosRatio: "1.53",
      kcalPer100g: 95.12,
      weightGrams: 200,
      listPrice: 72,
      salePrice: 72,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Canelis UG (haftungsbeschrankt)",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    review: {
      comment:
        "凱力女神雞x雞心單一蛋白質主食罐，德國原裝進口，10%雞心提升適口性，成分乾淨無爭議性膠類，符合 FEDIAF 標準。磷含量約294mg/100kcal，鈣磷比約1.53，略超出理想範圍，建議留意。",
    },
    price: 72,
    affiliateUrl: "https://s.shopee.tw/4AymAAtmJ3",
  },
  {
    id: "cat-can-013",
    category: "貓咪主食罐",
    brand: "凱力女神",
    name: "單一蛋白質主食罐 無膠罐 全肉主食罐 頂級貓罐 (純野兔)",
    image: "/images/products/kailigoddess-rabbit.png",
    debugTags: ["無膠"],
    features: ["兔肉", "單一蛋白質"],
    dmbCarb: 10.17,
    detailedAnalysis: {
      ingredientsText:
        "98.5%兔子（兔肉、心、肺、肝）。每公斤額外添加維他命A 1000 IU、維他命D3 100 IU、鐵22mg、銅1.5mg、錳1.5mg、鋅25mg、硒0.10mg、牛磺酸1300mg。",
      originCountry: "德國",
      moisture: 82,
      protein: 10.8,
      fat: 3,
      fiber: 0.7,
      ash: 1.67,
      phosphorus: 0.17,
      calcium: 0.25,
      caPhosRatio: "1.47",
      kcalPer100g: 49.93,
      weightGrams: 200,
      listPrice: 72,
      salePrice: 72,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Canelis UG (haftungsbeschrankt)",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    review: {
      comment:
        "凱力女神純野兔單一蛋白質主食罐，德國原裝進口，低脂配方（脂肪僅3%），成分乾淨無爭議性膠類，符合 FEDIAF 標準。鈣磷比約1.47，略超出理想範圍，建議留意。",
    },
    price: 72,
    affiliateUrl: "https://s.shopee.tw/4AymAAtmJ3",
  },
  {
    id: "cat-can-014",
    category: "貓咪主食罐",
    brand: "凱力女神",
    name: "單一蛋白質主食罐 無膠罐 全肉主食罐 頂級貓罐 (純袋鼠肉)",
    image: "/images/products/kailigoddess-kangaroo.png",
    debugTags: ["無膠"],
    features: ["袋鼠肉", "單一蛋白質"],
    dmbCarb: 15.06,
    detailedAnalysis: {
      ingredientsText:
        "98.5%袋鼠（袋鼠肉、心、頸、肝）。每公斤額外添加維他命A 1000 IU、維他命D3 100 IU、鐵22mg、銅1.5mg、錳1.5mg、鋅25mg、硒0.10mg、牛磺酸1300mg。",
      originCountry: "德國",
      moisture: 79.95,
      protein: 10.5,
      fat: 4.52,
      fiber: 0.47,
      ash: 1.54,
      phosphorus: 0.16,
      calcium: 0.21,
      caPhosRatio: "1.37",
      kcalPer100g: 78.84,
      weightGrams: 200,
      listPrice: 72,
      salePrice: 72,
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    review: {
      comment:
        "凱力女神純袋鼠肉單一蛋白質主食罐，德國原裝進口，成分乾淨無爭議性膠類，符合 FEDIAF 標準。磷含量約203mg/100kcal、鈣磷比約1.37，皆在理想範圍內。（官方申報網此品項資料與野兔款重複，疑似廠商申報時誤植，此處採用賣場提供的保證分析數據，暫不附官方申報資訊）",
    },
    price: 72,
    affiliateUrl: "https://s.shopee.tw/4AymAAtmJ3",
  },
  {
    id: "cat-can-015",
    category: "貓咪主食罐",
    brand: "凱力女神",
    name: "單一蛋白質主食罐 無膠罐 全肉主食罐 頂級貓罐 (有機純鴨)",
    image: "/images/products/kailigoddess-organic-duck.png",
    debugTags: ["無膠"],
    features: ["鴨肉", "單一蛋白質"],
    dmbCarb: 3.7,
    detailedAnalysis: {
      ingredientsText:
        "98.5%有機鴨（鴨肉、身體、心、頸、肝，來自有機生態農場）。每公斤額外添加維他命A 1000 IU、維他命D3 100 IU、鐵22mg、銅1.5mg、錳1.5mg、鋅25mg、硒0.10mg、牛磺酸1300mg。",
      originCountry: "德國",
      moisture: 79.71,
      protein: 10,
      fat: 6.76,
      fiber: 0.51,
      ash: 2.27,
      phosphorus: 0.31,
      calcium: 0.49,
      caPhosRatio: "1.57",
      kcalPer100g: 98.98,
      weightGrams: 200,
      listPrice: 72,
      salePrice: 72,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Canelis UG (haftungsbeschrankt)",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    review: {
      comment:
        "凱力女神有機純鴨單一蛋白質主食罐，德國原裝進口，鴨肉來自有機生態農場，成分乾淨無爭議性膠類，符合 FEDIAF 標準。磷含量約313mg/100kcal、鈣磷比約1.57，略超出理想範圍，建議留意。",
    },
    price: 72,
    affiliateUrl: "https://s.shopee.tw/4AymAAtmJ3",
  },
  {
    id: "cat-can-016",
    category: "貓咪主食罐",
    brand: "凱力女神",
    name: "單一蛋白質主食罐 無膠罐 全肉主食罐 頂級貓罐 (有機雞 x 鴨)",
    image: "/images/products/kailigoddess-organic-chicken-duck.png",
    debugTags: ["無膠"],
    features: ["雞肉", "鴨肉"],
    dmbCarb: 6.98,
    detailedAnalysis: {
      ingredientsText:
        "49.25%雞（雞肉、身體、心、頸、肝，來自有機生態農場）、49.25%鴨（鴨肉、身體、心、頸、肝，來自有機生態農場）、0.95%啤酒酵母、0.55%礦物質。每公斤額外添加維他命A 1000 IU、維他命D3 100 IU、鐵22mg、銅1.5mg、錳1.5mg、鋅25mg、硒0.10mg、牛磺酸1300mg。",
      originCountry: "德國",
      moisture: 79.22,
      protein: 9.31,
      fat: 7.17,
      fiber: 0.48,
      ash: 2.37,
      phosphorus: 0.32,
      calcium: 0.53,
      caPhosRatio: "1.62",
      kcalPer100g: 103.16,
      weightGrams: 200,
      listPrice: 72,
      salePrice: 72,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Canelis UG (haftungsbeschrankt)",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    review: {
      comment:
        "凱力女神有機雞x鴨單一蛋白質主食罐，德國原裝進口，雞鴨各半、來自有機生態農場，成分乾淨無爭議性膠類，符合 FEDIAF 標準。磷含量約310mg/100kcal、鈣磷比約1.62，略超出理想範圍，建議留意。（官方申報網未列鈣磷與熱量資訊，此處採用賣場提供數據補齊）",
    },
    price: 72,
    affiliateUrl: "https://s.shopee.tw/4AymAAtmJ3",
  },
  {
    id: "cat-can-017",
    category: "貓咪主食罐",
    brand: "凱力女神",
    name: "單一蛋白質主食罐 無膠罐 全肉主食罐 頂級貓罐 (火雞 x 羊肉)",
    image: "/images/products/kailigoddess-turkey-lamb.png",
    debugTags: ["無膠"],
    features: ["火雞肉", "羊肉"],
    dmbCarb: 10.45,
    detailedAnalysis: {
      ingredientsText:
        "49.25%有機火雞（火雞肉、身體、心、頸、肝，來自有機生態農場）、49.25%羊肉（羊肌肉、肺、心、肝）、0.95%啤酒酵母、0.55%礦物質。每公斤額外添加維他命A 1000 IU、維他命D3 100 IU、鐵22mg、銅1.5mg、錳1.5mg、鋅25mg、硒0.10mg、牛磺酸1300mg。",
      originCountry: "德國",
      moisture: 79.8,
      protein: 10,
      fat: 5.55,
      fiber: 0.53,
      ash: 2.01,
      phosphorus: 0.29,
      calcium: 0.44,
      caPhosRatio: "1.54",
      kcalPer100g: 87.45,
      weightGrams: 200,
      listPrice: 72,
      salePrice: 72,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Canelis UG (haftungsbeschrankt)",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    review: {
      comment:
        "凱力女神火雞x羊肉單一蛋白質主食罐，德國原裝進口，火雞羊肉各半、火雞來自有機生態農場，成分乾淨無爭議性膠類，符合 FEDIAF 標準。磷含量約332mg/100kcal、鈣磷比約1.54，略超出理想範圍，建議留意。（官方申報網未列鈣磷與熱量資訊，此處採用賣場提供數據補齊）",
    },
    price: 72,
    affiliateUrl: "https://s.shopee.tw/4AymAAtmJ3",
  },
  {
    id: "cat-can-018",
    category: "貓咪主食罐",
    brand: "魔力喵 迷幻喵 MjAMjAM",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (多汁雞肉 x 胡蘿蔔 x 貓草)",
    image: "/images/products/mjamjam-juicychicken-carrot-catgrass.png",
    debugTags: ["無膠"],
    features: ["雞肉", "胡蘿蔔", "貓草"],
    dmbCarb: 8.18,
    detailedAnalysis: {
      ingredientsText:
        "93.9%肉類和內臟（雞肉、肝、心）、5%胡蘿蔔、1%礦物質營養素、0.1%貓草。",
      originCountry: "德國",
      moisture: 78,
      protein: 12,
      fat: 6,
      fiber: 0.4,
      ash: 1.8,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      sodium: 0.12,
      kcalPer100g: 99.3,
      weightGrams: 400,
      listPrice: 145,
      salePrice: 145,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）／400g（0.4公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Mjamjam Petfood",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    ourCatsRating: [
      { cat: "三色蛋", verdict: "like" },
      { cat: "烏克", verdict: "like" },
    ],
    review: {
      comment:
        "MjAMjAM 德國魔力喵鮮肉主食罐多汁雞肉x胡蘿蔔x貓草口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。官方申報未標示熱量，此處熱量（約99.3kcal/100g）為依蛋白質/脂肪/碳水回推的估算值，非官方標示數字，磷含量與評分結果僅供參考。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 145,
    affiliateUrl: "https://s.shopee.tw/9zwZGcffVF",
  },
  {
    id: "cat-can-019",
    category: "貓咪主食罐",
    brand: "魔力喵 迷幻喵 MjAMjAM",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (鹿肉 x 兔肉 x 藍莓)",
    image: "/images/products/mjamjam-venison-rabbit-blueberry.png",
    debugTags: ["無膠"],
    features: ["鹿肉", "兔肉", "藍莓"],
    dmbCarb: 5.24,
    detailedAnalysis: {
      ingredientsText:
        "96%肉和內臟（48%鹿肉、48%兔肉、兔心、肝、肺、腰子）、3%藍莓、1%礦物質營養素。",
      originCountry: "德國",
      moisture: 79,
      protein: 10.5,
      fat: 7,
      fiber: 0.4,
      ash: 2,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      sodium: 0.12,
      kcalPer100g: 100.1,
      weightGrams: 400,
      listPrice: 145,
      salePrice: 145,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）／400g（0.4公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Mjamjam Petfood",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    ourCatsRating: [
      { cat: "三色蛋", verdict: "like" },
      { cat: "烏克", verdict: "like" },
    ],
    review: {
      comment:
        "MjAMjAM 德國魔力喵鮮肉主食罐鹿肉x兔肉x藍莓口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。官方申報未標示熱量，此處熱量（約100.1kcal/100g）為依蛋白質/脂肪/碳水回推的估算值，非官方標示數字，磷含量與評分結果僅供參考。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 145,
    affiliateUrl: "https://s.shopee.tw/9zwZGcffVF",
  },
  {
    id: "cat-can-020",
    category: "貓咪主食罐",
    brand: "魔力喵 迷幻喵 MjAMjAM",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (嫩鴨 x 胡蘿蔔)",
    image: "/images/products/mjamjam-duck-carrot.png",
    debugTags: ["無膠"],
    features: ["鴨肉", "雞肉", "火雞肉", "胡蘿蔔"],
    dmbCarb: 5.24,
    detailedAnalysis: {
      ingredientsText:
        "96%肉和內臟（38%鴨肉、鴨心、31%雞肝、雞胗、27%火雞肉、心臟、肝臟）、3%胡蘿蔔、1%礦物質營養素。",
      originCountry: "德國",
      moisture: 79,
      protein: 11.5,
      fat: 6,
      fiber: 0.4,
      ash: 2,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      sodium: 0.12,
      kcalPer100g: 95.1,
      weightGrams: 400,
      listPrice: 145,
      salePrice: 145,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）／400g（0.4公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Mjamjam Petfood",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    ourCatsRating: [
      { cat: "三色蛋", verdict: "like" },
      { cat: "烏克", verdict: "like" },
    ],
    review: {
      comment:
        "MjAMjAM 德國魔力喵鮮肉主食罐嫩鴨x胡蘿蔔口味，符合 FEDIAF 標準，三色蛋、烏克都愛吃。官方申報顯示此款實際為鴨肉+雞肉+火雞肉三種肉+胡蘿蔔的組合（非單一鴨肉），成分乾淨無爭議性膠類。官方申報未標示熱量，此處熱量（約95.1kcal/100g）為依蛋白質/脂肪/碳水回推的估算值，非官方標示數字。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 145,
    affiliateUrl: "https://s.shopee.tw/9zwZGcffVF",
  },
  {
    id: "cat-can-021",
    category: "貓咪主食罐",
    brand: "魔力喵 迷幻喵 MjAMjAM",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (火雞 x 蒸南瓜 x 貓草)",
    image: "/images/products/mjamjam-turkey-pumpkin-catgrass.png",
    debugTags: ["無膠"],
    features: ["火雞肉", "南瓜", "貓草"],
    dmbCarb: 10.45,
    detailedAnalysis: {
      ingredientsText:
        "96%肉類和內臟（96%火雞肉、心臟、肝臟、胃）、2.9%南瓜、1%礦物質營養素、0.1%貓草。",
      originCountry: "德國",
      moisture: 78,
      protein: 10.5,
      fat: 6.5,
      fiber: 0.4,
      ash: 2.3,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      sodium: 0.12,
      kcalPer100g: 100.1,
      weightGrams: 400,
      listPrice: 145,
      salePrice: 145,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）／400g（0.4公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Mjamjam Petfood",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    ourCatsRating: [
      { cat: "三色蛋", verdict: "like" },
      { cat: "烏克", verdict: "like" },
    ],
    review: {
      comment:
        "MjAMjAM 德國魔力喵鮮肉主食罐火雞x蒸南瓜x貓草口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。官方申報未標示熱量，此處熱量（約100.1kcal/100g）為依蛋白質/脂肪/碳水回推的估算值，非官方標示數字，磷含量與評分結果僅供參考。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 145,
    affiliateUrl: "https://s.shopee.tw/9zwZGcffVF",
  },
  {
    id: "cat-can-022",
    category: "貓咪主食罐",
    brand: "魔力喵 迷幻喵 MjAMjAM",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (馬肉 x 蒸南瓜)",
    image: "/images/products/mjamjam-horse-pumpkin.png",
    debugTags: ["無膠"],
    features: ["馬肉", "南瓜"],
    dmbCarb: 5.5,
    detailedAnalysis: {
      ingredientsText:
        "62.5%馬肉（馬肉、心、肝、肺、胃）、28%鮮肉汁、8.5%南瓜、1%礦物質營養素。",
      originCountry: "德國",
      moisture: 80,
      protein: 11,
      fat: 5.5,
      fiber: 0.4,
      ash: 2,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      sodium: 0.12,
      kcalPer100g: 89.1,
      weightGrams: 400,
      listPrice: 145,
      salePrice: 145,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "壹士達寵物有限公司",
          subcontractor: "Mjamjam",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    ourCatsRating: [
      { cat: "三色蛋", verdict: "like" },
      { cat: "烏克", verdict: "like" },
    ],
    review: {
      comment:
        "MjAMjAM 德國魔力喵鮮肉主食罐馬肉x蒸南瓜口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。此款由壹士達寵物有限公司進口申報（代工廠同為 Mjamjam），官方申報未標示熱量，此處熱量（約89.1kcal/100g）為依蛋白質/脂肪/碳水回推的估算值，非官方標示數字。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 145,
    affiliateUrl: "https://s.shopee.tw/9zwZGcffVF",
  },
  {
    id: "cat-can-023",
    category: "貓咪主食罐",
    brand: "魔力喵 迷幻喵 MjAMjAM",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (多汁雞肉 x 野生鮭魚)",
    image: "/images/products/mjamjam-chicken-salmon.png",
    debugTags: ["無膠"],
    features: ["雞肉", "鮭魚"],
    dmbCarb: 4.76,
    detailedAnalysis: {
      ingredientsText:
        "62.5%肉類和內臟（62.5%雞肉、心、肝、胃）、35.5%鮭魚、1%礦物質營養素、1%乾燥蛋殼（鈣質來源）。",
      originCountry: "德國",
      moisture: 79,
      protein: 11,
      fat: 6.5,
      fiber: 0.4,
      ash: 2.1,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      sodium: 0.12,
      kcalPer100g: 97.3,
      weightGrams: 400,
      listPrice: 145,
      salePrice: 145,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）／400g（0.4公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "達飛國際有限公司",
          subcontractor: "Mjamjam Petfood",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    ourCatsRating: [
      { cat: "三色蛋", verdict: "like" },
      { cat: "烏克", verdict: "like" },
    ],
    review: {
      comment:
        "MjAMjAM 德國魔力喵鮮肉主食罐多汁雞肉x野生鮭魚口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。官方申報未標示熱量，此處熱量（約97.3kcal/100g）為依蛋白質/脂肪/碳水回推的估算值，非官方標示數字，磷含量與評分結果僅供參考。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 145,
    affiliateUrl: "https://s.shopee.tw/9zwZGcffVF",
  },
  {
    id: "cat-can-024",
    category: "貓咪主食罐",
    brand: "魔力喵 迷幻喵 MjAMjAM",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (雞肉 x 鮭魚油)",
    image: "/images/products/mjamjam-chicken-salmonoil.png",
    debugTags: ["無膠"],
    features: ["雞肉", "鮭魚油"],
    dmbCarb: 1.5,
    detailedAnalysis: {
      ingredientsText:
        "70%雞肉（雞肉、心、肝、胗）、28.6%鮮肉汁、0.5%礦物質、0.5%乾燥蛋殼（鈣質來源）、0.4%鮭魚油。",
      originCountry: "德國",
      moisture: 80,
      protein: 11.5,
      fat: 5.7,
      fiber: 0.3,
      ash: 2.2,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      sodium: 0.12,
      kcalPer100g: 89.8,
      weightGrams: 400,
      listPrice: 145,
      salePrice: 145,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "壹士達寵物有限公司",
          subcontractor: "Mjamjam",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    ourCatsRating: [
      { cat: "三色蛋", verdict: "like" },
      { cat: "烏克", verdict: "like" },
    ],
    review: {
      comment:
        "MjAMjAM 德國魔力喵鮮肉主食罐雞肉x鮭魚油口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。此款由壹士達寵物有限公司進口申報（代工廠同為 Mjamjam），官方申報未標示熱量，此處熱量（約89.8kcal/100g）為依蛋白質/脂肪/碳水回推的估算值，非官方標示數字。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 145,
    affiliateUrl: "https://s.shopee.tw/9zwZGcffVF",
  },
  {
    id: "cat-can-025",
    category: "貓咪主食罐",
    brand: "魔力喵 迷幻喵 MjAMjAM",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (火雞 x 胡蘿蔔)",
    image: "/images/products/mjamjam-turkey-carrot.png",
    debugTags: ["無膠"],
    features: ["火雞肉", "胡蘿蔔"],
    dmbCarb: 7.14,
    detailedAnalysis: {
      ingredientsText:
        "火雞肉、心臟、肝臟和胃（64.5%）、肉湯（29.5%）、胡蘿蔔（5%）、礦物質（0.5%）、蛋殼（0.5%）。",
      originCountry: "德國",
      moisture: 79,
      protein: 11,
      fat: 6,
      fiber: 0.4,
      ash: 2.1,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      sodium: 0.12,
      kcalPer100g: 94.8,
      weightGrams: 400,
      listPrice: 145,
      salePrice: 145,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "200g（0.2公斤）／400g（0.4公斤）",
          sourceType: "輸入",
          origin: "—",
          company: "成裕國際有限公司",
          subcontractor: "Mjamjam Petfood",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "FEDIAF",
    ourCatsRating: [
      { cat: "三色蛋", verdict: "like" },
      { cat: "烏克", verdict: "like" },
    ],
    review: {
      comment:
        "MjAMjAM 德國魔力喵鮮肉主食罐火雞x胡蘿蔔口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。此款由成裕國際有限公司以「奇幻妙喵」名義進口申報（官方申報副標題確認為 MjAMjAM 品牌），官方申報未標示熱量，此處熱量（約94.8kcal/100g）為依蛋白質/脂肪/碳水回推的估算值，非官方標示數字。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 145,
    affiliateUrl: "https://s.shopee.tw/9zwZGcffVF",
  },
  {
    id: "dog-can-000",
    category: "狗狗主食罐",
    brand: "Cesar 西莎",
    name: "精緻風味餐盒 (牛肉) 24入",
    image: "/images/products/cesar-gourmet-tray-beef.png",
    debugTags: ["含膠類"],
    features: ["肉餅"],
    partialNutrition: {
      ingredientsText:
        "肉類及其副產品(雞，牛)，水，黏稠劑(關華豆膠，決明子膠，鹿角菜膠，三聚磷酸鈉)，礦物質，維生素，香料，乙烯二胺四醋酸二鈉鈣，亞硝酸鈉。",
      items: [
        { label: "粗蛋白質(min)", value: "5%" },
        { label: "粗脂肪(min)", value: "2%" },
        { label: "粗纖維(max)", value: "1%" },
        { label: "水分(max)", value: "89%" },
      ],
      note: "官方保證成分分析未列出灰分、磷、熱量等數值，故無法提供完整乾物比／熱量佔對照表。（此數值已依農業部寵物食品申報網官方申報資料校正，與蝦皮賣場的 AI 摘要落差較大，以官方申報為準）",
      estimateInputs: { protein: 5, fat: 2, fiber: 1, moisture: 89 },
    },
    officialFiling: {
      queryDate: "2026-07-30",
      records: [
        {
          spec: "0.6 公斤（100g x 6入）",
          sourceType: "輸入",
          origin: "—",
          company: "台灣瑪氏股份有限公司",
          subcontractor: "Mars Petcare Australia (WOD)",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [{ cat: "露比", verdict: "like" }],
    review: {
      comment:
        "西莎精緻風味餐盒牛肉口味，24入分裝方便，符合 AAFCO 標準，露比很捧場。官方申報顯示含關華豆膠等多種黏稠劑與亞硝酸鈉，保證分析（蛋白質5%、脂肪2%）也明顯低於賣場文案描述，選購前建議留意。",
    },
    price: 759,
    affiliateUrl: "https://s.shopee.tw/8V7ipIsIIM",
  },
  {
    id: "dog-dry-000",
    category: "狗狗乾糧",
    brand: "Hill's 希爾思",
    name: "雞肉 1-6歲小型及迷你成犬 (1.5公斤)",
    image: "/images/products/hills-chicken-adult-small-mini-1-6y.png",
    debugTags: [],
    features: ["小型犬", "迷你犬", "雞肉", "小顆粒"],
    dmbCarb: 52.8,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "雞肉、糙米、全穀粒小麥、全穀粒玉米、釀造米、雞肉粉、全穀粒高粱、雞脂肪、黃豆粉、雞肝香料、玉米蛋白粉、豬肝香料、亞麻仁籽、乳酸、黃豆油、氯化鉀、左旋離胺酸、全穀粒燕麥、碘鹽、果寡糖(FOS)、維生素（維生素E添加劑、抗壞血酸多聚磷酸酯(維生素C來源)、菸鹼酸添加劑、硝酸硫胺(維生素B1)、維生素A添加劑、泛酸鈣、核黃素添加劑、生物素、維生素B12添加劑、維生素B6、葉酸、維生素D3添加劑）、南瓜、氯化膽鹼、DL-蛋胺酸、碳酸鈣、牛磺酸、礦物質（硫酸亞鐵、氧化鋅、硫酸銅、氧化錳、碘酸鈣、亞硒酸鈉）、添加綜合維生素E類以保鮮、天然香料、左旋肉鹼、β-胡蘿蔔素。",
      originCountry: "美國",
      moisture: 10,
      protein: 22.5,
      fat: 13.77,
      fiber: 1.35,
      ash: 4.86,
      phosphorus: 0.68,
      calcium: 0.76,
      kcalPer100g: 369.9,
      weightGrams: 1500,
      listPrice: 791,
      salePrice: 791,
    },
    officialFiling: {
      queryDate: "2026-07-30",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "台灣希爾思寵物營養品有限公司",
          subcontractor: "Hills Pet Nutrition Inc",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [{ cat: "露比", verdict: "like" }],
    review: {
      comment:
        "希爾思雞肉配方，專為小型及迷你成犬設計，符合 AAFCO 標準，露比很喜歡。完整保證分析取自希爾思美國官網公開資料，換算後鈣磷比約 1.11:1，磷含量約 185mg/100kcal。",
    },
    price: 791,
    affiliateUrl: "https://s.shopee.tw/3LPcgvJllu",
  },
  {
    id: "dog-dry-001",
    category: "狗狗乾糧",
    brand: "科克蘭",
    name: "雞肉&米&蔬菜配方 幼犬乾狗糧",
    image: "/images/products/kirkland-chicken-rice-vegetable-puppy.png",
    debugTags: [],
    features: ["幼犬", "雞肉"],
    dmbCarb: 38.89,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "雞肉、雞肉粉、糙米、大麥、雞蛋、雞脂、乾菜渣、馬鈴薯、魚粉、亞麻籽、天然香料、乾酵母、鮭魚油（DHA來源）、小米、氯化鉀、食鹽、氯化膽鹼、胡蘿蔔、豌豆、乾海帶、蘋果、蔓越莓、迷迭香抽取物、香芹、菊苣根、益生菌群、維生素E、蛋白鐵、蛋白鋅、蛋白銅、硫酸亞鐵、硫酸鋅、硫酸銅、碘化鉀、維生素B1、蛋白錳、氧化錳、維生素A、生物素、菸鹼酸、活酵母、硫酸鈷、亞硒酸鈉、維生素B6、維生素B12、維生素B2、維生素D、葉酸。",
      originCountry: "美國",
      moisture: 10,
      protein: 28,
      fat: 17,
      fiber: 3,
      ash: 7,
      phosphorus: 1,
      calcium: 1.2,
      kcalPer100g: 376.1,
      weightGrams: 9070,
      listPrice: 911,
      salePrice: 911,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "9.07 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "好市多股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [{ cat: "吉米", verdict: "like" }],
    review: {
      comment:
        "科克蘭雞肉&米&蔬菜配方幼犬乾狗糧，符合 AAFCO 標準，吉米很喜歡。保證分析（蛋白質最少28%、脂肪最少17%、纖維最多3%、水分最多10%、鈣最少1.2%、磷最少1.0%）取自農業部申報網公開資料。官方未公布灰分與熱量，灰分依乾飼料典型值估算約7%，熱量參考網路資料約376kcal/100g（3761kcal/kg，非官方確認數字），僅供參考。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 911,
    affiliateUrl: "https://s.shopee.tw/8KoLPwVY36",
  },
  {
    id: "dog-dry-002",
    category: "狗狗乾糧",
    brand: "福壽",
    name: "機能乾狗糧-皮毛保健配方",
    image: "/images/products/kirkland-fushou-skin-coat.png",
    debugTags: [],
    features: ["皮毛保健", "成犬", "羊肉", "雞肉"],
    dmbCarb: 45.56,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "雞肉粉、黃玉米、羊肉粉、全麥、發酵大豆蛋白、家禽脂肪（以維生素E保存）、樹薯、深海魚油、乳酪粉、乾燥酵母、乾甜菜、椰子油、乾燥海藻、膠原蛋白、卵磷脂、絲蘭萃取物、綜合維生素（維生素A、維生素D、維生素E、維生素B1、核黃素、維生素B6、維生素B12、菸鹼酸、氯化膽鹼、泛酸鈣、葉酸、生物素）、綜合礦物質（鈣、磷、鉀、鐵、銅、錳、鋅、硒、碘）。",
      originCountry: "台灣",
      moisture: 10,
      protein: 24,
      fat: 13,
      fiber: 4,
      ash: 8,
      phosphorus: 0.8,
      calcium: 1.3,
      kcalPer100g: 361.5,
      weightGrams: 13500,
      listPrice: 1200,
      salePrice: 1200,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "13.5 公斤",
          sourceType: "製造、加工",
          origin: "—",
          company: "福壽實業股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [{ cat: "吉米", verdict: "like" }],
    review: {
      comment:
        "福壽機能乾狗糧皮毛保健配方，台灣製造、專為成犬設計，符合 AAFCO 標準，吉米很喜歡。保證分析與熱量（代謝能3615kcal/kg）皆取自農業部申報網公開資料。鈣磷比約1.63，略超出理想範圍，建議留意。",
    },
    price: 1200,
    affiliateUrl: "https://s.shopee.tw/1Vy1JAU31c",
  },
  {
    id: "cat-dry-000",
    category: "貓咪乾糧",
    brand: "Hill's 希爾思",
    name: "完美體重 雞肉 1-6歲成貓 (1.36公斤)",
    image: "/images/products/hills-perfect-weight-chicken-adult-cat.png",
    debugTags: [],
    features: ["體重控制", "減重配方", "雞肉"],
    dmbCarb: 35.39,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "雞肉、釀造米、玉米蛋白粉、小麥筋質、燕麥纖維、雞肉粉、脫水番茄粕、脫水甜菜漿、亞麻仁籽、雞脂肪、雞肝香料、椰子油、乳酸、硫酸鈣、氯化鉀、左旋離胺酸、氯化膽鹼、胡蘿蔔、DL-蛋胺酸、牛磺酸、碘鹽、維生素(維生素E添加劑、抗壞血酸多聚磷酸酯(維生素C來源)、菸鹼酸添加劑、硝酸硫胺(維生素B1)、維生素A添加劑、泛酸鈣、核黃素添加劑、生物素、維生素B12添加劑、維生素B6、葉酸、維生素D3添加劑)、磷酸二鈣、礦物質(硫酸錳、硫酸亞鐵、氧化鋅、硫酸銅、碘酸鈣、亞硒酸鈉)、左旋肉鹼、添加綜合維生素E類以保鮮、天然香料、β-胡蘿蔔素。",
      originCountry: "美國",
      moisture: 8,
      protein: 36.25,
      fat: 10.95,
      fiber: 5.52,
      ash: 6.72,
      phosphorus: 0.71,
      calcium: 0.97,
      kcalPer100g: 341.2,
      weightGrams: 1360,
      listPrice: 961,
      salePrice: 961,
    },
    officialFiling: {
      queryDate: "2026-07-30",
      records: [
        {
          spec: "1.36 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "台灣希爾思寵物營養品有限公司",
          subcontractor: "Hills Pet Nutrition Inc",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
    ],
    review: {
      comment:
        "希爾思完美體重雞肉配方，專為 1-6 歲成貓體重控制設計，高纖配方增加飽足感，符合 AAFCO 標準，本丸、海苔、麻糬都愛吃。完整保證分析取自希爾思美國官網公開資料，換算後鈣磷比約 1.37:1，磷含量約 208mg/100kcal，數值健康。",
    },
    price: 961,
    affiliateUrl: "https://s.shopee.tw/3Vj2uUQww5",
  },
  {
    id: "cat-dry-001",
    category: "貓咪乾糧",
    brand: "ParkCat 無敵貓糧",
    name: "無敵貓糧 鮮雞蜂王乳",
    image: "/images/products/parkcat-chicken-royaljelly.png",
    debugTags: [],
    features: ["蜂王乳", "雞肉"],
    dmbCarb: 20.88,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "去骨雞肉及雞肉、樹薯澱粉、碗豆蛋白、雞油、水解雞肉小肽蛋白、碗豆、酵母粉、乳酪粉、甜菜、苜蓿、黑豆、紅藜麥、植物纖維、低溫烘焙黃金亞麻籽、深海魚油(Omega-3來源)、氯化鈉、膽鹼、磷酸氫二鉀、蛋黃、大麥若葉、離胺酸、葡聚糖、甘露寡糖、牛磺酸、蜂王乳、綜合維生素(維生素A、維生素D3、維生素C、維生素E、維生素B1、維生素B2、維生素B6、維生素B12、菸鹼酸、泛酸鈣、葉酸、生物素)、綜合礦物質(銅、鐵、錳、鋅)、絲蘭、益生菌(Lactobacillus plantarum, Lactobacillus acidophilus, Lactobacillus paracasei, Lactobacillus rhamnosus, Bifidobacterium longum, Bacillus subtilis, Bacillus licheniformis)、酵母硒、乾燥雞肝粉、酵母水解物、蔓越莓萃取物。",
      originCountry: "台灣",
      moisture: 9,
      protein: 42,
      fat: 17,
      fiber: 4,
      ash: 9,
      phosphorus: 0.8,
      calcium: 1.5,
      kcalPer100g: 358,
      weightGrams: 300,
      listPrice: 280,
      salePrice: 280,
    },
    officialFiling: {
      queryDate: "2026-07-30",
      records: [
        {
          spec: "0.3 公斤",
          sourceType: "委託代工廠製造",
          origin: "—",
          company: "麗斯居股份有限公司",
          subcontractor: "富崴飼料有限公司",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
    ],
    review: {
      comment:
        "ParkCat 無敵貓糧鮮雞蜂王乳口味，蛋白質 42% 偏高，本丸、海苔、麻糬都愛吃，符合 AAFCO 標準。磷含量約224mg/100kcal、鈣磷比約1.88:1，鈣磷比略超出理想範圍 1.1-1.4。",
    },
    price: 280,
    affiliateUrl: "https://s.shopee.tw/7fYcqer6bZ",
  },
  {
    id: "cat-dry-002",
    category: "貓咪乾糧",
    brand: "ParkCat 無敵貓糧",
    name: "無敵貓糧 大洋鮮極魚",
    image: "/images/products/parkcat-ocean-fish.png",
    debugTags: [],
    features: ["魚"],
    dmbCarb: 20.88,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "去骨雞肉、魚肉(鱈魚、鯖魚、鯡魚、鮭魚)、樹薯澱粉、雞油脂、碗豆蛋白、水解雞肉蛋白、酵母粉、完整碗豆、完整黑豆、植物纖維、鮭魚油(天然omega-3來源)、水解雞肝蛋白、卵磷脂、酵母水解物、牛磺酸、膽鹼、綜合維生素(維生素A、維生素D3、維生素E、維生素B1、維生素B2、維生素B6、維生素B12、菸鹼酸、泛酸鈣、葉酸、生物素)、離胺酸、蛋胺酸、南瓜、海藻、氯化鉀、綜合礦物質(銅、鐵、錳、鋅、碘、硒)、完整蘋果果肉、枸杞、番茄、乳鐵蛋白、雞蛋粉、甘露寡醣、β-葡聚醣、絲蘭、葡萄糖胺、軟骨素、酵母硒、益生菌(Lactobacillus plantarum, Lactobacillus acidophilus, Lactobacillus paracasei, Lactobacillus rhamnosus, Bifidobacterium longum, Bacillus subtilis, Bacillus licheniformis)、輔酶Q10。",
      originCountry: "台灣",
      moisture: 9,
      protein: 42,
      fat: 16,
      fiber: 5,
      ash: 9,
      phosphorus: 0.9,
      calcium: 1.4,
      kcalPer100g: 349.5,
      weightGrams: 300,
      listPrice: 340,
      salePrice: 340,
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
    ],
    review: {
      comment:
        "ParkCat 無敵貓糧大洋鮮極魚口味，多種魚肉來源、蛋白質 42% 偏高，本丸、海苔、麻糬都愛吃，符合 AAFCO 標準。磷含量約258mg/100kcal、鈣磷比約1.56:1，鈣磷比略超出理想範圍 1.1-1.4。",
    },
    price: 340,
    affiliateUrl: "https://s.shopee.tw/111j5y0WyS",
  },
  {
    id: "cat-dry-003",
    category: "貓咪乾糧",
    brand: "TAPAZO特百滋",
    name: "貓用凍乾填心糧-成幼貓低敏配方（有穀低敏鮮雞配方泌尿保健）",
    image: "/images/products/tapazo-freeze-dried-hypoallergenic-cat.png",
    debugTags: [],
    features: ["低敏", "鮮雞"],
    dmbCarb: 29.44,
    detailedAnalysis: {
      productType: "凍乾填心糧",
      ingredientsText:
        "乾燥肉（澳洲雞肉、南洋鮪魚、澳洲牛肉）、玉米、水解植物蛋白、凍乾雞肉粉、動物油脂（台灣豬油）、冷壓椰子粉、黃金亞麻籽、深海魚油、水解動物蛋白、糖蜜酵母粉、益生纖維質、燕麥、虱目魚萃取（HAP）、膠原蛋白、蒜蘭萃取物、綜合酵素、氧化牛磺酸、離胺酸、蛋胺酸、研磨綠茶、苜蓿、甜菜、蔓越莓、蕃茄、甘薯、南瓜、胡蘿蔔、蘋果、綜合維生素（A、D、E、B1、B2、B6、B12、葉酸、泛酸、菸鹼酸、生物素）、綜合礦物質（硫酸鋅、硫酸銅、硫酸錳、硫酸鐵、碳酸鈷、碘化鉀）。",
      originCountry: "台灣",
      moisture: 10,
      protein: 32.5,
      fat: 16,
      fiber: 5,
      ash: 10,
      phosphorus: 1,
      calcium: 1.8,
      kcalPer100g: 364,
      weightGrams: 907,
      listPrice: 360,
      salePrice: 360,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "0.907 公斤",
          sourceType: "委託代工廠製造",
          origin: "—",
          company: "艾澌克企業股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "志龍", verdict: "like" },
      { cat: "豆豆龍", verdict: "like" },
      { cat: "烏龍", verdict: "like" },
    ],
    review: {
      comment:
        "TAPAZO特百滋貓用凍乾填心糧成幼貓低敏鮮雞配方，符合 AAFCO 標準，志龍、豆豆龍、烏龍都愛吃。保證分析與熱量（代謝能3640kcal/kg）皆取自農業部申報網公開資料。鈣磷比約1.8，超出理想範圍 1.1-1.4，建議留意。",
    },
    price: 360,
    affiliateUrl: "https://s.shopee.tw/20uHvCumTi",
  },
  {
    id: "cat-dry-004",
    category: "貓咪乾糧",
    brand: "TAPAZO特百滋",
    name: "貓用凍乾填心糧-成幼貓低敏配方（無穀低敏海魚配方低碳水高蛋白）",
    image: "/images/products/tapazo-freeze-dried-grainfree-fish-cat.png",
    debugTags: [],
    features: ["低敏", "海魚", "雞肉", "無穀"],
    dmbCarb: 34.89,
    detailedAnalysis: {
      productType: "凍乾雙饗宴",
      ingredientsText:
        "佐餐成份：雞肉凍乾粒、鮮蛋凍乾粒。乾糧成份：乾燥鮭魚、乾鷹嘴豆、乾燥豌豆、豌豆粉、雞脂（以混合生育酚保存）、乾燥雞肉、乳化鱒魚、乾燥甜菜根、豌豆蛋白質、馬鈴薯蛋白質、纖維素粉、天然調味料、乾燥番茄粕、乾燥油鯡魚、乾燥白魚、乾燥鯡魚、食鹽、碳酸鈣、乾燥雞蛋、研磨亞麻籽、啤酒酵母萃取物、鮭魚油（以混合生育酚保存）、氯化膽鹼、乾燥菊苣根、綜合維生素（E、A、D3、B12、C、B2、B1、葉酸、B7、B6、B3、K、泛酸鈣）、綜合礦物質（硫酸銅、碘酸鈣、硫酸鐵、氧化錳、氧化鋅、亞硒酸鈉）、牛磺酸、益生菌（嗜酸乳桿菌、乾酪乳桿菌、比菲德氏菌、腸球菌）。",
      originCountry: "台灣",
      moisture: 10,
      protein: 34,
      fat: 12,
      fiber: 6.2,
      ash: 6.4,
      phosphorus: 0.72,
      calcium: 0.9,
      kcalPer100g: 348.3,
      weightGrams: 907,
      listPrice: 399,
      salePrice: 399,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "0.907 公斤",
          sourceType: "委託代工廠製造",
          origin: "—",
          company: "艾澌克企業股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "志龍", verdict: "like" },
      { cat: "豆豆龍", verdict: "like" },
      { cat: "烏龍", verdict: "like" },
    ],
    review: {
      comment:
        "TAPAZO特百滋成幼貓低敏配方，符合 AAFCO 標準，志龍、豆豆龍、烏龍都愛吃。官方申報顯示此款正式名稱為「凍乾雙饗宴 低敏海魚＋雞肉配方」（海魚與雞肉雙拼，非單一海魚），保證分析與熱量（3483kcal/kg）皆取自農業部申報網公開資料。鈣磷比約1.25，落在理想範圍內。",
    },
    price: 399,
    affiliateUrl: "https://s.shopee.tw/20uHvCumTi",
  },
];
