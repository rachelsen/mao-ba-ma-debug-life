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
];
