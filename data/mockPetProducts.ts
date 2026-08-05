export type PetProductCategory =
  | "貓咪主食罐"
  | "貓咪乾糧"
  | "貓咪零食"
  | "貓砂/用品"
  | "狗狗主食罐"
  | "狗狗乾糧"
  | "毛孩保健品"
  | "貓咪處方乾糧";

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
    /** 官方公布的熱量（kcal/100g），非估算值，有提供才能換算磷／100kcal評分 */
    kcalPer100g?: number;
    /** 非官方推估的磷（%，以現狀為準），僅在有可信參考來源時填寫，需在 note 註明推估依據與不確定性 */
    phosphorus?: number;
    /** 非官方推估的鈣（%，以現狀為準），需在 note 註明推估依據與不確定性 */
    calcium?: number;
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

/**
 * 「貓咪處方乾糧」專用資訊。貓咪處方乾糧是為特定病理狀況設計（例如腎臟病刻意降蛋白、
 * 泌尿道刻意調整礦物質與誘導尿液 pH），套用一般保健飼料的評分邏輯會誤導，
 * 故貓咪處方乾糧一律不計分，改用這裡的臨床向欄位做同分類內的比較。
 */
export interface PetProductPrescriptionInfo {
  /** 適應症／設計目標，例如 "貓下泌尿道疾病（FLUTD）／結石溶解與預防" */
  indication: string;
  /** 是否需憑獸醫處方或指示才能購買、餵食 */
  requiresVetPrescription: boolean;
  /** 目標尿液 pH 誘導範圍，官方未標示則留空 */
  targetUrinePh?: string;
  /** 關鍵機制說明，例如控制礦物質、降低結石形成風險的方式 */
  keyMechanism?: string;
  /** 使用提醒，例如需定期回診、不可自行長期使用、不可與一般飼料混餵等 */
  note?: string;
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
  /** 「貓咪處方乾糧」分類專用，有值時商品卡片不計分、改顯示處方資訊 */
  prescriptionInfo?: PetProductPrescriptionInfo;
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
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (1號 多汁雞肉 x 胡蘿蔔 x 貓草)",
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
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (2號 鹿肉 x 兔肉 x 藍莓)",
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
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (3號 嫩鴨 x 胡蘿蔔)",
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
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (4號 火雞 x 蒸南瓜 x 貓草)",
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
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (5號 馬肉 x 蒸南瓜)",
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
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (6號 多汁雞肉 x 野生鮭魚)",
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
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (7號 雞肉 x 鮭魚油)",
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
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (8號 火雞 x 胡蘿蔔)",
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
    id: "cat-can-026",
    category: "貓咪主食罐",
    brand: "TAPAZO特百滋",
    name: "貓用主廚鮮肉派 (鵪鶉燉雞)",
    image: "/images/products/tapazo-chef-pie-quail-chicken.png",
    debugTags: ["無膠"],
    features: ["雞肉", "鵪鶉"],
    dmbCarb: 0.48,
    detailedAnalysis: {
      ingredientsText:
        "雞肉、鵪鶉肉、雞心、雞肝、寒天、乾燥酵母、綜合胺基酸、複合維生素（A、B1、B2、菸鹼酸、泛酸、B6、葉酸、B12、C、D、E）、複合礦物質（鈣、磷、鎂、銅、鐵、鋅、鉻、錳、碘）、牛磺酸、甘露寡糖。",
      originCountry: "台灣",
      moisture: 79,
      protein: 13,
      fat: 6,
      fiber: 0.2,
      ash: 1.7,
      phosphorus: 0.17,
      calcium: 0.21,
      caPhosRatio: "1.24",
      kcalPer100g: 110,
      weightGrams: 80,
      listPrice: 38,
      salePrice: 38,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "80g（0.08公斤）",
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
        "TAPAZO特百滋貓用主廚鮮肉派鵪鶉燉雞口味，全肉配方成分乾淨無爭議性膠類，符合 AAFCO 標準，志龍、豆豆龍、烏龍都愛吃。保證分析與熱量（110kcal/100g）皆取自農業部申報網公開資料；官方數值為邊界保證值（水分80%以下、蛋白質13%以上等）加總逼近100%，DMB碳水以接近邊界的合理值估算約0.48%，實際應更接近0%。鈣磷比約1.24，落在理想範圍內。",
    },
    price: 38,
    affiliateUrl: "https://s.shopee.tw/6L3LdD8AMZ",
  },
  {
    id: "cat-can-027",
    category: "貓咪主食罐",
    brand: "TAPAZO特百滋",
    name: "貓用主廚鮮肉派 (鮮牛烤雞)",
    image: "/images/products/tapazo-chef-pie-beef-chicken.png",
    debugTags: ["無膠"],
    features: ["雞肉", "牛肉"],
    dmbCarb: 0.48,
    detailedAnalysis: {
      ingredientsText:
        "雞肉、牛肉、雞心、雞肝、寒天、乾燥酵母、綜合胺基酸、複合維生素（A、B1、B2、菸鹼酸、泛酸、B6、葉酸、B12、C、D、E）、複合礦物質（鈣、磷、鎂、銅、鐵、鋅、鉻、錳、碘）、牛磺酸、蔓越莓。",
      originCountry: "台灣",
      moisture: 79,
      protein: 13,
      fat: 6,
      fiber: 0.2,
      ash: 1.7,
      phosphorus: 0.17,
      calcium: 0.21,
      caPhosRatio: "1.24",
      kcalPer100g: 110,
      weightGrams: 80,
      listPrice: 38,
      salePrice: 38,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "80g（0.08公斤）",
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
        "TAPAZO特百滋貓用主廚鮮肉派鮮牛烤雞口味，全肉配方成分乾淨無爭議性膠類，符合 AAFCO 標準，志龍、豆豆龍、烏龍都愛吃。保證分析與熱量（110kcal/100g）皆取自農業部申報網公開資料；官方數值為邊界保證值（水分80%以下、蛋白質13%以上等）加總逼近100%，DMB碳水以接近邊界的合理值估算約0.48%，實際應更接近0%。鈣磷比約1.24，落在理想範圍內。",
    },
    price: 38,
    affiliateUrl: "https://s.shopee.tw/6L3LdD8AMZ",
  },
  {
    id: "cat-can-028",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (9號 麵包蟲 x 多汁雞肉)",
    image: "/images/products/mjamjam-mealworm-chicken.png",
    debugTags: ["無膠"],
    features: ["麵包蟲", "雞肉"],
    dmbCarb: 1.67,
    detailedAnalysis: {
      ingredientsText:
        "36.5%雞肉、32%麵包蟲、30.5%鮮肉汁、0.5%礦物質營養素、0.5%乾燥蛋殼（鈣質來源）。",
      originCountry: "德國",
      moisture: 82,
      protein: 10,
      fat: 5.5,
      fiber: 0.4,
      ash: 1.8,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      kcalPer100g: 82.8,
      weightGrams: 400,
      listPrice: 160,
      salePrice: 160,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "400g（0.4公斤）",
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
        "MjAMjAM 德國魔力喵鮮肉主食罐麵包蟲x多汁雞肉口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。官方申報未標示鈣、磷與熱量，此處鈣、磷依同系列產品典型值估算（鈣0.3%、磷0.25%），熱量（約82.8kcal/100g）依蛋白質/脂肪/碳水回推估算，皆非官方數字，相關評分結果僅供參考。",
    },
    price: 160,
    affiliateUrl: "https://s.shopee.tw/111pJ4CVNr",
  },
  {
    id: "cat-can-029",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (10號 野鹿 x 火雞 x 蔓越莓)",
    image: "/images/products/mjamjam-venison-turkey-cranberry.png",
    debugTags: ["無膠"],
    features: ["鹿肉", "火雞肉", "蔓越莓"],
    dmbCarb: 15.24,
    detailedAnalysis: {
      ingredientsText:
        "33.5%鹿肉、33.5%火雞（火雞肉、心、肝）、30%鮮肉汁、2%蔓越莓、0.5%礦物質營養素、0.5%乾燥蛋殼（鈣質來源）。",
      originCountry: "德國",
      moisture: 79,
      protein: 10.5,
      fat: 5,
      fiber: 0.3,
      ash: 2,
      phosphorus: 0.18,
      calcium: 0.26,
      caPhosRatio: "1.44",
      sodium: 0.12,
      kcalPer100g: 90.5,
      weightGrams: 400,
      listPrice: 160,
      salePrice: 160,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "400g（0.4公斤）",
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
        "MjAMjAM 德國魔力喵鮮肉主食罐野鹿x火雞x蔓越莓口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。保證分析（含鈣磷）取自農業部申報網公開資料；官方申報未標示熱量，此處熱量（約90.5kcal/100g）依蛋白質/脂肪/碳水回推估算，非官方數字。鈣磷比約1.44，略超出理想範圍 1.1-1.4，建議留意。",
    },
    price: 160,
    affiliateUrl: "https://s.shopee.tw/111pJ4CVNr",
  },
  {
    id: "cat-can-030",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (11號 馴鹿 x 雞肉 x 胡蘿蔔)",
    image: "/images/products/mjamjam-reindeer-chicken-carrot.png",
    debugTags: ["無膠"],
    features: ["馴鹿", "雞肉", "胡蘿蔔"],
    dmbCarb: 15.24,
    detailedAnalysis: {
      ingredientsText:
        "42%雞肉（雞肉、心、肝、胗）、31.5%鮮肉汁、20.5%馴鹿肉、5%紅蘿蔔、0.5%礦物質營養素、0.5%乾燥蛋殼（鈣質來源）。",
      originCountry: "德國",
      moisture: 79,
      protein: 10.5,
      fat: 5,
      fiber: 0.4,
      ash: 1.9,
      phosphorus: 0.18,
      calcium: 0.26,
      caPhosRatio: "1.44",
      sodium: 0.12,
      kcalPer100g: 90.5,
      weightGrams: 400,
      listPrice: 160,
      salePrice: 160,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "400g（0.4公斤）",
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
        "MjAMjAM 德國魔力喵鮮肉主食罐馴鹿x雞肉x胡蘿蔔口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。保證分析（含鈣磷）取自農業部申報網公開資料；官方申報未標示熱量，此處熱量（約90.5kcal/100g）依蛋白質/脂肪/碳水回推估算，非官方數字。鈣磷比約1.44，略超出理想範圍 1.1-1.4，建議留意。",
    },
    price: 160,
    affiliateUrl: "https://s.shopee.tw/111pJ4CVNr",
  },
  {
    id: "cat-can-031",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (12號 嫩羊 x 胡蘿蔔)",
    image: "/images/products/mjamjam-lamb-carrot.png",
    debugTags: ["無膠"],
    features: ["羊肉", "胡蘿蔔"],
    dmbCarb: 12.38,
    detailedAnalysis: {
      ingredientsText: "65%山羊肉、29%鮮肉汁、5%紅蘿蔔、1%礦物質營養素。",
      originCountry: "德國",
      moisture: 79,
      protein: 10.5,
      fat: 5.5,
      fiber: 0.4,
      ash: 2,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      sodium: 0.12,
      kcalPer100g: 92.6,
      weightGrams: 400,
      listPrice: 160,
      salePrice: 160,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "400g（0.4公斤）",
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
        "MjAMjAM 德國魔力喵鮮肉主食罐嫩羊x胡蘿蔔口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。官方申報實際品名為「山羊肉」而非綿羊/羔羊肉，成分與保證分析（含鈣磷）取自農業部申報網公開資料；官方未標示熱量，此處熱量（約92.6kcal/100g）依蛋白質/脂肪/碳水回推估算，非官方數字。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 160,
    affiliateUrl: "https://s.shopee.tw/111pJ4CVNr",
  },
  {
    id: "cat-can-032",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (13號 多汁雞肉 x 明蝦)",
    image: "/images/products/mjamjam-chicken-shrimp.png",
    debugTags: ["無膠"],
    features: ["雞肉", "明蝦"],
    dmbCarb: 6.5,
    detailedAnalysis: {
      ingredientsText: "56%雞肉（雞肉、心、肝、胗）、28.5%鮮肉汁、14.5%明蝦、1%礦物質營養素。",
      originCountry: "德國",
      moisture: 80,
      protein: 11,
      fat: 5,
      fiber: 0.3,
      ash: 2.4,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      kcalPer100g: 85.6,
      weightGrams: 400,
      listPrice: 170,
      salePrice: 170,
    },
    officialFiling: {
      queryDate: "2026-08-03",
      records: [
        {
          spec: "400g（0.4公斤）",
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
        "MjAMjAM 德國魔力喵鮮肉主食罐多汁雞肉x明蝦口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。官方申報未標示鈣、磷與熱量，此處鈣、磷依同系列產品典型值估算（鈣0.3%、磷0.25%），熱量（約85.6kcal/100g）依蛋白質/脂肪/碳水回推估算，皆非官方數字，相關評分結果僅供參考。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 170,
    affiliateUrl: "https://s.shopee.tw/111pJ4CVNr",
  },
  {
    id: "cat-can-033",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (21號 多汁雞肉 x 花椰菜)",
    image: "/images/products/mjamjam-chicken-cauliflower.png",
    debugTags: ["無膠"],
    features: ["雞肉", "花椰菜"],
    dmbCarb: 9.09,
    detailedAnalysis: {
      ingredientsText: "70%雞肉（雞肉、胃、肝、脖子）、鮮肉汁、4%花椰菜、礦物質營養素、亞麻仁油、海藻。",
      originCountry: "德國",
      moisture: 78,
      protein: 11,
      fat: 6.5,
      fiber: 0.5,
      ash: 2,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      kcalPer100g: 100.8,
      weightGrams: 400,
      listPrice: 160,
      salePrice: 160,
    },
    officialFiling: {
      queryDate: "2026-08-03",
      records: [
        {
          spec: "100g（0.1公斤）",
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
        "MjAMjAM 德國魔力喵鮮肉主食罐多汁雞肉口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。官方申報顯示此款實際為多汁雞肉+花椰菜的組合（非純雞肉單一口味），保證分析（含鈣磷）取自農業部申報網公開資料（申報規格為100g，本品為400g包裝，比例數值相同）；官方未標示熱量，此處熱量（約100.8kcal/100g）依蛋白質/脂肪/碳水回推估算，非官方數字。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 160,
    affiliateUrl: "https://s.shopee.tw/111pJ4CVNr",
  },
  {
    id: "cat-can-034",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (15號 純火雞)",
    image: "/images/products/mjamjam-turkey.png",
    debugTags: ["無膠"],
    features: ["火雞肉"],
    dmbCarb: 6.67,
    detailedAnalysis: {
      ingredientsText: "71%火雞（火雞肉、心、肝、胃）、28%鮮肉汁、0.5%礦物質營養素、0.5%乾燥蛋殼（鈣質來源）。",
      originCountry: "德國",
      moisture: 79,
      protein: 11,
      fat: 6,
      fiber: 0.4,
      ash: 2.2,
      phosphorus: 0.2,
      calcium: 0.25,
      caPhosRatio: "1.25",
      kcalPer100g: 94.4,
      weightGrams: 400,
      listPrice: 160,
      salePrice: 160,
    },
    officialFiling: {
      queryDate: "2026-08-03",
      records: [
        {
          spec: "125g（0.125公斤）",
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
        "MjAMjAM 德國魔力喵鮮肉主食罐純火雞口味，單一火雞肉來源、成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。保證分析（含鈣磷）取自農業部申報網公開資料（申報規格為125g，本品為400g包裝，比例數值相同）；官方未標示熱量，此處熱量（約94.4kcal/100g）依蛋白質/脂肪/碳水回推估算，非官方數字。鈣磷比約1.25，落在理想範圍內。",
    },
    price: 160,
    affiliateUrl: "https://s.shopee.tw/111pJ4CVNr",
  },
  {
    id: "cat-can-035",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (16號 營養羊肉)",
    image: "/images/products/mjamjam-lamb.png",
    debugTags: ["無膠"],
    features: ["羊肉"],
    dmbCarb: 7.62,
    detailedAnalysis: {
      ingredientsText: "71%新鮮羊肉（羊肉、心、肺、肝、腎、羊肚）、28%鮮肉汁、0.5%礦物質營養素、0.5%乾燥蛋殼。",
      originCountry: "德國",
      moisture: 79,
      protein: 11,
      fat: 6,
      fiber: 0.4,
      ash: 2,
      phosphorus: 0.2,
      calcium: 0.25,
      caPhosRatio: "1.25",
      kcalPer100g: 95.1,
      weightGrams: 400,
      listPrice: 160,
      salePrice: 160,
    },
    officialFiling: {
      queryDate: "2026-08-03",
      records: [
        {
          spec: "400g（0.4公斤）",
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
        "MjAMjAM 德國魔力喵鮮肉主食罐營養羊肉口味，單一羊肉來源（非山羊肉）、成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。保證分析（含鈣磷）取自農業部申報網公開資料，申報規格與本品同為400g；官方未標示熱量，此處熱量（約95.1kcal/100g）依蛋白質/脂肪/碳水回推估算，非官方數字。鈣磷比約1.25，落在理想範圍內。",
    },
    price: 160,
    affiliateUrl: "https://s.shopee.tw/111pJ4CVNr",
  },
  {
    id: "cat-can-036",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (17號 低脂袋鼠肉)",
    image: "/images/products/mjamjam-kangaroo.png",
    debugTags: ["無膠"],
    features: ["袋鼠肉"],
    dmbCarb: 12.38,
    detailedAnalysis: {
      ingredientsText: "71%新鮮袋鼠肉（袋鼠肉、心、肺、肝、腎）、28%鮮肉汁、0.5%礦物質營養素、0.5%乾燥蛋殼。",
      originCountry: "德國",
      moisture: 79,
      protein: 11.5,
      fat: 4.5,
      fiber: 0.4,
      ash: 2,
      phosphorus: 0.2,
      calcium: 0.25,
      caPhosRatio: "1.25",
      kcalPer100g: 87.6,
      weightGrams: 400,
      listPrice: 160,
      salePrice: 160,
    },
    officialFiling: {
      queryDate: "2026-08-03",
      records: [
        {
          spec: "400g（0.4公斤）",
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
        "MjAMjAM 德國魔力喵鮮肉主食罐低脂袋鼠肉口味，脂肪僅4.5%明顯偏低、成分乾淨無爭議性膠類，符合 FEDIAF 標準，三色蛋、烏克都愛吃。保證分析（含鈣磷）取自農業部申報網公開資料，申報規格與本品同為400g（此次資料正常，未與其他款重複）；官方未標示熱量，此處熱量（約87.6kcal/100g）依蛋白質/脂肪/碳水回推估算，非官方數字。鈣磷比約1.25，落在理想範圍內。",
    },
    price: 160,
    affiliateUrl: "https://s.shopee.tw/111pJ4CVNr",
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
    id: "dog-dry-003",
    category: "狗狗乾糧",
    brand: "HeroMama 英雄媽媽",
    name: "天然蔬果肉鬆糧－雞魚拌肉鬆餐 (0.9kg)",
    image: "/images/products/heromama-meatfloss-chickenfish.png",
    debugTags: [],
    features: ["雞肉", "魚肉", "全齡犬", "肉鬆"],
    dmbCarb: 37.82,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "乾燥雞肉、乾燥魚肉、雞脂肪、豌豆、無調味豬肉鬆、蘋果、覆盆莓、樹薯澱粉、紅藜麥、小肽蛋白、水解酵母、乳酪粉、脫水雞肝、鮭魚油、蔓越莓、綠花椰菜、膳食纖維、甘露寡糖、牛磺酸、離胺酸、蛋胺酸、氯化鉀、氯化鈉、礦物質（鐵、鋅、銅、錳）、卵磷脂、葡萄糖胺、軟骨素、鱉蛋粉、蝦紅素、綜合維生素（維生素A、維生素D3、維生素C、維生素E、維生素K3、維生素B1、維生素B2、維生素B6、維生素B12、菸鹼酸、泛酸鈣、葉酸、生物素）、絲蘭、酵母硒、益生菌、天然抗氧化劑。",
      originCountry: "台灣",
      moisture: 7.7,
      protein: 30,
      fat: 15.8,
      fiber: 3.8,
      ash: 7.8,
      phosphorus: 1.0,
      calcium: 1.3,
      caPhosRatio: "1.30",
      kcalPer100g: 360.8,
      weightGrams: 900,
      listPrice: 360,
      salePrice: 360,
    },
    officialFiling: {
      queryDate: "2026-08-05",
      records: [
        {
          spec: "0.9 公斤",
          sourceType: "委託代工廠製造",
          origin: "—",
          company: "飛輪寵物有限公司",
          subcontractor: "自力耕生股份有限公司",
        },
      ],
    },
    review: {
      comment:
        "HeroMama天然蔬果肉鬆糧－雞魚拌肉鬆餐，飼料顆粒外層包裹0調味純豬肉鬆，搭配蘋果、覆盆莓、蔓越莓、綠花椰菜等天然蔬果凍乾，訴求不用另外拌鮮食就香。保證分析（蛋白質30%、脂肪15.8%、纖維3.8%、灰分7.8%、水分7.7%、鈣1.3%、總磷1.0%、碳水化合物34.9%、熱量360.8kcal/100g）皆取自農業部申報網公開資料，與品牌官網商品資訊數值一致。鈣磷比約1.30，落在理想範圍內。碳水化合物偏高（DMB約37.82%），主要來自樹薯澱粉、紅藜麥與豌豆。品牌官網頁面並未提及 AAFCO、NRC 或 FEDIAF 標準相關聲明。毛孩評價待更新。",
    },
    price: 360,
    affiliateUrl: "https://s.shopee.tw/4LIKQZzIJV",
  },
  {
    id: "cat-dry-000",
    category: "貓咪乾糧",
    brand: "Hill's 希爾思",
    name: "完美體重 雞肉 1-6歲成貓 (1.36公斤)",
    image: "/images/products/hills-perfect-weight-chicken-adult-cat.png",
    debugTags: [],
    features: ["體重控制", "減重配方", "雞肉", "含穀"],
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
    features: ["蜂王乳", "雞肉", "無穀"],
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
    features: ["魚", "無穀"],
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
    features: ["低敏", "鮮雞", "含穀"],
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
  {
    id: "cat-dry-005",
    category: "貓咪乾糧",
    brand: "Acana 愛肯拿",
    name: "低GI 室內開胃貓飼料（雞 x 鯡魚 x 蔓越莓）",
    image: "/images/products/acana-indoor-chicken-herring-cranberry.png",
    debugTags: ["名稱與成分不符：含燕麥非無穀"],
    features: ["室內貓", "雞肉", "鯡魚", "含穀"],
    dmbCarb: 26.67,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "新鮮雞肉（16%）、脫水雞肉（16%）、脫水鯡魚（16%）、完整燕麥、完整豌豆、雞脂肪（5%）、芒草粉、完整綠扁豆、新鮮火雞肉（4%）、生鮮完整鯡魚（4%）、完整鷹嘴豆、完整紅扁豆、扁豆纖維、生鮮完整兔肉（1%）、新鮮雞內臟（肝、心）（1%）、新鮮火雞內臟（肝、心）（1%）、雞軟骨（1%）、乾燥海帶、新鮮完整冬南瓜、新鮮完整南瓜、新鮮完整蔓越莓、新鮮完整藍莓。",
      originCountry: "加拿大",
      moisture: 10,
      protein: 37,
      fat: 14,
      fiber: 6,
      ash: 9,
      phosphorus: 1,
      calcium: 1.4,
      caPhosRatio: "1.4",
      kcalPer100g: 363,
      weightGrams: 1800,
      listPrice: 1060,
      salePrice: 1060,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "0.9 公斤（分裝包）",
          sourceType: "分裝",
          origin: "—",
          company: "健康便國際行銷有限公司",
          subcontractor: "—",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [{ cat: "烏克", verdict: "like" }],
    review: {
      comment:
        "Acana 愛肯拿低GI室內開胃貓飼料雞x鯡魚x蔓越莓口味，符合 AAFCO 標準，烏克很喜歡。⚠️ 更正：本款先前誤標「無穀」，官方申報成分表明確列出「完整燕麥」，並非無穀配方；Acana 的「Indoor」系列本來就不屬於該品牌真正無穀的「Regionals」系列，此處已更正為含穀。成分與基本保證分析取自農業部申報網（900g分裝包，與本品1.8kg規格保證分析相同），官方申報未列鈣磷與熱量，此處鈣、磷、熱量（3630kcal/kg）取自 Acana 加拿大原廠官網公開資料，確認與申報成分完全吻合。鈣磷比約1.4，落在理想範圍內。",
    },
    price: 1060,
    affiliateUrl: "https://s.shopee.tw/2LX8MpPxrT",
  },
  {
    id: "cat-dry-006",
    category: "貓咪乾糧",
    brand: "GO!",
    name: "成貓配方 無穀貓糧（黑水虻）",
    image: "/images/products/go-adult-grainfree-blacksoldierfly-cat.png",
    debugTags: [],
    features: ["黑水虻", "無穀", "低敏"],
    dmbCarb: 35,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "乾燥黑水虻幼蟲、豌豆、扁豆、乾燥全蛋、木薯粉、豌豆粉、鷹嘴豆、加拿大芥花油（由天然混合生育酚混合保存）、亞麻籽、天然香料、碳酸鈣、椰子油（由天然混合生育酚混合保存）、磷酸二氫鈣、鹽、乾燥菊苣根、磷酸、DL蛋胺酸、氯化膽鹼、綜合維生素（E、菸鹼酸、維生素C來源、B1、生物素、A、D-泛酸鈣、β-胡蘿蔔素、B2、B6、B12、D3、葉酸）、綜合礦物質（鋅蛋白、硫酸亞鐵、氧化鋅、鐵蛋白、硫酸銅、亞硒酸鈉、銅蛋白、錳蛋白、氧化錳、碘酸鈣）、牛磺酸、乾燥迷迭香。",
      originCountry: "加拿大",
      moisture: 10,
      protein: 30,
      fat: 15,
      fiber: 4.5,
      ash: 9,
      phosphorus: 0.8,
      calcium: 1,
      caPhosRatio: "1.25",
      kcalPer100g: 414,
      weightGrams: 1360,
      listPrice: 1350,
      salePrice: 1350,
    },
    officialFiling: {
      queryDate: "2026-07-31",
      records: [
        {
          spec: "1.36 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "古迪寵物食品有限公司",
          subcontractor: "PETCUREAN PET NUTRITION",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [{ cat: "三色蛋", verdict: "like" }],
    review: {
      comment:
        "GO! 成貓配方無穀貓糧黑水虻口味，符合 AAFCO 標準，三色蛋很喜歡。保證分析與熱量（4140kcal/kg）皆取自農業部申報網公開資料，代工廠為加拿大原廠 PETCUREAN PET NUTRITION。官方（含原廠官網）皆未公布磷含量，此處磷含量依無穀貓糧典型值估算約0.8%，非官方數字，磷含量與鈣磷比評分結果僅供參考。",
    },
    price: 1350,
    affiliateUrl: "https://s.shopee.tw/80BV8ZmfxY",
  },
  {
    id: "cat-dry-007",
    category: "貓咪乾糧",
    brand: "TAPAZO特百滋",
    name: "貓用凍乾雙饗宴 2磅 (成幼貓低敏海魚 x 雞肉)",
    image: "/images/products/tapazo-freeze-dried-duo-fish-chicken-2lb.png",
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
      listPrice: 451,
      salePrice: 451,
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
        "TAPAZO特百滋貓用凍乾雙饗宴 2磅低敏海魚x雞肉配方，符合 AAFCO 標準，志龍、豆豆龍、烏龍都愛吃。保證分析與熱量（3483kcal/kg）取自農業部申報網公開資料；官方申報僅有台灣代工版記錄，未查到加拿大進口版申報，產地以申報資料為準標示為台灣。鈣磷比約1.25，落在理想範圍內。",
    },
    price: 451,
    affiliateUrl: "https://s.shopee.tw/qiKcDbcZU",
  },
  {
    id: "cat-dry-008",
    category: "貓咪乾糧",
    brand: "TAPAZO特百滋",
    name: "貓用凍乾雙饗宴 2磅 (成幼貓低敏鮭魚)",
    image: "/images/products/tapazo-freeze-dried-duo-salmon-2lb.png",
    debugTags: [],
    features: ["低敏", "鮭魚", "無穀"],
    dmbCarb: 35,
    detailedAnalysis: {
      productType: "凍乾雙饗宴",
      ingredientsText:
        "佐餐成份：雞肉凍乾粒、鮮蛋凍乾粒。乾糧成份：乾燥鮭魚、乾鷹嘴豆、乾豌豆、豌豆粉、乾燥雞肉、馬鈴薯粉、雞脂（以混合生育酚保存）、豌豆蛋白質、馬鈴薯蛋白質、天然調味料、乾燥甜菜根、乾燥蕃茄粕、乾燥菊苣根、纖維素粉、食鹽、磷酸氫鈣、碳酸鈣、研磨亞麻籽、乾燥雞蛋、啤酒酵母萃取物、氯化膽鹼、綜合維生素（E、A、D3、B12、C、B2、B1、葉酸、B7、B6、B3、K、泛酸鈣）、綜合礦物質（硫酸銅、碘酸鈣、硫酸鐵、氧化錳、氧化鋅、亞硒酸鈉）、牛磺酸、益生菌（嗜酸乳酸桿菌、乾酪乳酸桿菌、比菲德氏菌、腸球菌）。",
      originCountry: "台灣",
      moisture: 10,
      protein: 34,
      fat: 13,
      fiber: 4,
      ash: 7.5,
      phosphorus: 0.72,
      calcium: 0.88,
      kcalPer100g: 420.4,
      weightGrams: 907,
      listPrice: 451,
      salePrice: 451,
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
        "TAPAZO特百滋貓用凍乾雙饗宴 2磅低敏鮭魚配方，符合 AAFCO 標準，志龍、豆豆龍、烏龍都愛吃。保證分析與熱量（代謝能4204kcal/kg）皆取自農業部申報網公開資料。鈣磷比約1.22，落在理想範圍內。",
    },
    price: 451,
    affiliateUrl: "https://s.shopee.tw/qiKcDbcZU",
  },
  {
    id: "cat-dry-009",
    category: "貓咪乾糧",
    brand: "TAPAZO特百滋",
    name: "貓用凍乾雙饗宴 2磅 (熟齡貓火雞)",
    image: "/images/products/tapazo-freeze-dried-duo-turkey-senior-2lb.png",
    debugTags: [],
    features: ["熟齡貓", "火雞", "關節保健", "無穀"],
    dmbCarb: 35.67,
    detailedAnalysis: {
      productType: "凍乾雙饗宴",
      ingredientsText:
        "佐餐成份：雞肉凍乾粒、鮮蛋凍乾粒。乾糧成份：乾燥火雞、鮮火雞肉、乾燥豌豆、豌豆粉、乾燥扁豆、乾燥紅薯、啤酒酵母、天然調味料、雞脂（以混合生育酚保存）、乾燥甜菜根、研磨亞麻籽、乾燥番茄粕、鮭魚油（以混合生育酚保存）、牛磺酸、綜合礦物質（硫酸鋅、硫酸亞鐵、硫酸銅、氧化錳、亞硒酸鈉、碘酸鈣）、綜合維生素（E、B3、B1、B5、A、B6、B2、D3、B12、葉酸、B7）、氯化膽鹼、乾燥菊苣根、DL-甲硫氨酸、綠唇貝、食鹽、乾燥海藻、乾燥蔓越莓、乾燥菠菜、乾燥胡蘿蔔、乾燥蘋果、乾燥藍莓、蕬蘭萃取精華、綠茶提取物、維生素C活性來源、鹽酸鹽葡萄糖胺、軟骨素。",
      originCountry: "台灣",
      moisture: 10,
      protein: 37,
      fat: 10,
      fiber: 3.3,
      ash: 7.6,
      phosphorus: 0.7,
      calcium: 0.9,
      kcalPer100g: 335.1,
      weightGrams: 907,
      listPrice: 451,
      salePrice: 451,
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
        "TAPAZO特百滋貓用凍乾雙饗宴 2磅熟齡貓火雞配方，添加葡萄糖胺、軟骨素照護關節，符合 AAFCO 標準，志龍、豆豆龍、烏龍都愛吃。保證分析與熱量（代謝能3351kcal/kg）取自農業部申報網公開資料；官方申報未列鈣磷數據，此處鈣、磷依熟齡貓糧典型值估算（鈣0.9%、磷0.7%），非官方數字，鈣磷相關評分結果僅供參考。",
    },
    price: 451,
    affiliateUrl: "https://s.shopee.tw/qiKcDbcZU",
  },
  {
    id: "cat-dry-010",
    category: "貓咪乾糧",
    brand: "TAPAZO特百滋",
    name: "貓用凍乾雙饗宴 2磅 (成貓低敏雞肉)",
    image: "/images/products/tapazo-freeze-dried-duo-chicken-2lb.png",
    debugTags: [],
    features: ["低敏", "雞肉", "無穀"],
    dmbCarb: 33.33,
    detailedAnalysis: {
      productType: "凍乾雙饗宴",
      ingredientsText:
        "佐餐成份：雞肉凍乾粒、鮮蛋凍乾粒。乾糧成份：乾燥雞肉、乾豌豆、乾鷹嘴豆、豌豆粉、雞脂（以混合生育酚保存）、纖維素粉、乾燥馬鈴薯、豌豆蛋白質、天然調味料、乾燥甜菜根、乾燥鮭魚、乾燥火雞肉、乾燥蕃茄粕、鮭魚油（以混合生育酚保存）、氯化膽鹼、食鹽、乾燥雞蛋、研磨亞麻籽、啤酒酵母萃取物、乾燥菊苣根、綜合維生素（A、D3、E、B3、B1、C、B5、B2、B6、葉酸、B7、B12、K、B8）、綜合礦物質（鋅蛋白、硫酸亞鐵、氧化鋅、鐵蛋白、硫酸銅、亞硒酸鈉、銅蛋白、錳蛋白、氧化錳、碘酸鈣）、牛磺酸、DL-甲硫氨酸、蕬蘭萃取精華、益生菌（嗜酸乳酸桿菌、乾酪乳酸桿菌、比菲德氏菌、腸球菌）。",
      originCountry: "台灣",
      moisture: 10,
      protein: 33,
      fat: 13,
      fiber: 7,
      ash: 7,
      phosphorus: 0.45,
      calcium: 0.54,
      kcalPer100g: 418.5,
      weightGrams: 907,
      listPrice: 451,
      salePrice: 451,
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
        "TAPAZO特百滋貓用凍乾雙饗宴 2磅成貓低敏雞肉配方，符合 AAFCO 標準，志龍、豆豆龍、烏龍都愛吃。保證分析與熱量（代謝能4185kcal/kg）皆取自農業部申報網公開資料。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 451,
    affiliateUrl: "https://s.shopee.tw/qiKcDbcZU",
  },
  {
    id: "cat-rx-001",
    category: "貓咪處方乾糧",
    brand: "ROYAL CANIN 法國皇家 處方",
    name: "貓 泌尿道低卡路里配方 UMC34 (1.5kg)",
    image: "/images/products/royalcanin-urinary-umc34.png",
    debugTags: ["貓咪處方乾糧"],
    features: ["泌尿道保健", "低卡"],
    partialNutrition: {
      ingredientsText:
        "主原料：米、脫水禽肉蛋白、小麥麩質、玉米粉、植物纖維、玉米質、水解動物蛋白、礦物質、動物脂肪、魚油、大豆油、果寡糖、金盞花、小麥粉。營養添加劑：維生素A、維生素D3等（詳見包裝背面）。",
      items: [
        { label: "蛋白質(min)", value: "34%" },
        { label: "脂肪(min)", value: "11%" },
        { label: "粗纖維(max)", value: "7.1%" },
        { label: "代謝能量", value: "351.6 kcal/100g（3516 kcal/kg）" },
        { label: "Omega-6", value: "2.46%" },
        { label: "Omega-3", value: "0.69%" },
        { label: "EPA+DHA", value: "0.32%" },
      ],
      note:
        "官方申報未列水分／灰分／鈣／磷數值。本品為貓咪處方乾糧，屬特定病理狀況設計配方，不適用本站一般保健飼料評分邏輯，故不計分。",
    },
    officialFiling: {
      queryDate: "2026-08-03",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "輸入",
          origin: "韓國",
          company: "台灣皇家寵物食品有限公司",
          subcontractor: "RGY, Royal Canin Gimje Factory",
        },
      ],
    },
    prescriptionInfo: {
      indication: "貓下泌尿道疾病（FLUTD）保健／泌尿道保健搭配體重管理（低卡路里配方）",
      requiresVetPrescription: true,
      keyMechanism:
        "官方申報標示「本產品為特殊配方，請務必遵照獸醫師指示」；配方特點為刻意降低熱量密度（僅351.6kcal/100g），搭配需要泌尿道保健又需控制體重的貓咪使用。",
      note:
        "官方未標示尿液pH誘導目標範圍與鎂/鈣/磷礦物質控制數值，如需精確臨床數據請洽獸醫或原廠。請務必經獸醫診斷評估後使用，不可自行長期餵食或替代一般飼料。",
    },
    review: {
      comment:
        "ROYAL CANIN 法國皇家處方貓泌尿道低卡路里配方（UMC34），為特定病理狀況設計的貓咪處方乾糧，非一般保健飼料，故不套用本站一般評分邏輯。官方申報標示為特殊配方、須遵照獸醫師指示使用，代謝能量僅351.6kcal/100g，明顯低於一般成貓飼料。官方僅揭露蛋白質／脂肪／纖維／熱量等基本數值，未列水分、灰分、鈣磷與尿液pH誘導範圍，完整臨床資訊建議洽詢獸醫。貓咪表示愛吃。",
    },
    price: 717,
    affiliateUrl: "https://s.shopee.tw/50XyITJl8R",
  },
  {
    id: "cat-rx-002",
    category: "貓咪處方乾糧",
    brand: "ROYAL CANIN 法國皇家 處方",
    name: "貓 泌尿道配方 LP34 (1.5kg)",
    image: "/images/products/royalcanin-urinary-lp34.png",
    debugTags: ["貓咪處方乾糧"],
    features: ["泌尿道保健"],
    partialNutrition: {
      ingredientsText:
        "主原料：米、脫水禽肉蛋白、小麥麩質、玉米粉、植物纖維、玉米質、水解動物蛋白、礦物質、動物脂肪、魚油、大豆油、果寡糖、金盞花、小麥粉。營養添加劑：維生素A、維生素D3等（詳見包裝背面）。",
      items: [
        { label: "蛋白質(min)", value: "34%" },
        { label: "脂肪(min)", value: "11%" },
        { label: "粗纖維(max)", value: "7.1%" },
        { label: "代謝能量", value: "351.6 kcal/100g（3516 kcal/kg）" },
        { label: "Omega-6", value: "2.46%" },
        { label: "Omega-3", value: "0.69%" },
        { label: "EPA+DHA", value: "0.32%" },
      ],
      note:
        "官方申報未列水分／灰分／鈣／磷數值。本品為貓咪處方乾糧，屬特定病理狀況設計配方，不適用本站一般保健飼料評分邏輯，故不計分。⚠️ 此份申報的保證分析數值與同系列UMC34（低卡版）完全相同，疑似廠商申報時援用同一份制式資料，未反映兩者實際熱量差異，請以包裝實際標示為準。",
    },
    officialFiling: {
      queryDate: "2026-08-03",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "輸入",
          origin: "韓國",
          company: "台灣皇家寵物食品有限公司",
          subcontractor: "RGY, Royal Canin Gimje Factory",
        },
      ],
    },
    prescriptionInfo: {
      indication: "貓下泌尿道疾病（FLUTD）保健／泌尿道保健一般配方",
      requiresVetPrescription: true,
      keyMechanism:
        "官方申報標示「本產品為特殊配方，請務必遵照獸醫師指示」。官方申報名稱為 VD URINARY S/O CAT，與UMC34（VD URINARY MOD CALOR CAT）為同系列不同配方代號。",
      note:
        "官方未標示尿液pH誘導目標範圍與鎂/鈣/磷礦物質控制數值，如需精確臨床數據請洽獸醫或原廠。請務必經獸醫診斷評估後使用，不可自行長期餵食或替代一般飼料。",
    },
    review: {
      comment:
        "ROYAL CANIN 法國皇家處方貓泌尿道配方（LP34，一般版），為特定病理狀況設計的貓咪處方乾糧，非一般保健飼料，故不套用本站一般評分邏輯。官方申報標示為特殊配方、須遵照獸醫師指示使用。留意：官方申報的保證分析數值（蛋白質34%、脂肪11%、代謝能量351.6kcal/100g等）與同系列UMC34低卡版完全相同，可能是廠商申報時援用同一份制式資料、未反映兩者實際熱量差異，建議以包裝實際標示為準。貓咪表示愛吃。",
    },
    price: 765,
    affiliateUrl: "https://s.shopee.tw/50XyITJl8R",
  },
  {
    id: "cat-snack-000",
    category: "貓咪零食",
    brand: "TAPAZO特百滋",
    name: "貓用老饕鮮味盤(霸王大草蝦)凍乾 (20g)",
    image: "/images/products/tapazo-perfect-cuts-grass-shrimp.png",
    debugTags: [],
    features: ["草蝦", "凍乾", "單一肉源", "無穀", "無防腐劑", "無誘食劑"],
    partialNutrition: {
      ingredientsText: "草蝦仁、殺菌液蛋、茶胺酸、木天蓼。",
      items: [
        { label: "粗蛋白質(min)", value: "79.5%" },
        { label: "粗脂肪(min)", value: "6.0%" },
        { label: "粗纖維(max)", value: "0.1%" },
        { label: "粗灰分(max)", value: "13.0%" },
        { label: "水分(max)", value: "5%" },
        { label: "熱量", value: "361 kcal/100g" },
      ],
      note:
        "官方保證分析未列出鈣、磷數值（連包裝實拍照片也沒有標示），廠商本身未公布。磷含量與鈣磷比這裡改用「草蝦仁」的 USDA 生蝦典型值（每100g生蝦：鈣64mg、磷214mg，水分78.45g）換算乾物比後、依本品5%水分還原推估（鈣約0.28%、磷約0.94%），⚠️ 非官方數據、非本品實測值，且成分表另含蛋液等其他原料，實際數值可能有落差，僅供參考。品牌定位：老饕鮮味盤系列採100%天然原肉製成、無添加穀物／防腐劑／誘食劑，屬單一原型食物零食，官方未把它當完整均衡主食檢驗，故不適用 AAFCO／NRC 完整營養規範（該品牌僅「主廚海鮮燉」等主食系列才符合 AAFCO／NRC）。建議作為日常獎勵或拌入主食增加風味，不建議完全取代主食。",
      estimateInputs: {
        protein: 79.5,
        fat: 6,
        fiber: 0.1,
        moisture: 5,
        kcalPer100g: 361,
        phosphorus: 0.94,
        calcium: 0.28,
      },
    },
    officialFiling: {
      queryDate: "2026-08-03",
      records: [
        {
          spec: "0.02 公斤",
          sourceType: "委託代工廠製造",
          origin: "台灣",
          company: "艾澌克企業股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
      { cat: "海苔", verdict: "like" },
    ],
    review: {
      comment:
        "TAPAZO特百滋貓用老饕鮮味盤霸王大草蝦凍乾，單一草蝦肉源、蛋白質高達79.5%，本丸、麻糬、海苔都超愛。保證分析與熱量（361kcal/100g）皆取自農業部申報網公開資料，官方未列出鈣磷數值（包裝也沒標），這裡另外用USDA生蝦典型值換算推估（非官方，僅供參考）：磷約0.94%、鈣約0.28%，換算下來鈣磷比只有約0.3:1，明顯偏低——這是純肉去殼零食常見的情況（沒有蝦殼或骨骼的鈣質），營養不均衡，加上官方申報明確定位為零食、未標示AAFCO／FEDIAF均衡標準，不建議取代正餐或長期大量餵食。",
    },
    price: 149,
    affiliateUrl: "https://s.shopee.tw/5ArOa2s95t",
  },
  {
    id: "cat-snack-001",
    category: "貓咪零食",
    brand: "TAPAZO特百滋",
    name: "貓用老饕鮮味盤(整粒鮮雞心)凍乾 (40g)",
    image: "/images/products/tapazo-perfect-cuts-chicken-heart.png",
    debugTags: [],
    features: ["雞心", "凍乾", "單一肉源", "無穀", "無防腐劑", "無誘食劑"],
    partialNutrition: {
      ingredientsText: "雞心、殺菌液蛋、茶胺酸、貓薄荷。",
      items: [
        { label: "粗蛋白質(min)", value: "58.9%" },
        { label: "粗脂肪(min)", value: "31.2%" },
        { label: "粗纖維(max)", value: "1.2%" },
        { label: "粗灰分(max)", value: "7.4%" },
        { label: "水分(max)", value: "3.5%" },
        { label: "熱量", value: "474 kcal/100g" },
      ],
      note:
        "官方保證分析未列出鈣、磷數值，廠商本身未公布。磷含量與鈣磷比這裡改用「雞心」的 USDA 生雞心典型值（每100g生雞心：鈣12mg、磷177mg，水分73.56g）換算乾物比後、依本品3.5%水分還原推估（鈣約0.04%、磷約0.65%），⚠️ 非官方數據、非本品實測值，且成分表另含蛋液等其他原料，實際數值可能有落差，僅供參考。品牌定位：老饕鮮味盤系列採100%天然原肉製成、無添加穀物／防腐劑／誘食劑，屬單一原型食物零食，官方未把它當完整均衡主食檢驗，故不適用 AAFCO／NRC 完整營養規範（該品牌僅「主廚海鮮燉」等主食系列才符合 AAFCO／NRC）。建議作為日常獎勵或拌入主食增加風味，不建議完全取代主食。",
      estimateInputs: {
        protein: 58.9,
        fat: 31.2,
        fiber: 1.2,
        moisture: 3.5,
        kcalPer100g: 474,
        phosphorus: 0.65,
        calcium: 0.04,
      },
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "0.04 公斤",
          sourceType: "委託代工廠製造",
          origin: "台灣",
          company: "艾澌克企業股份有限公司",
          subcontractor: "—",
        },
      ],
    },
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
      { cat: "海苔", verdict: "like" },
    ],
    review: {
      comment:
        "TAPAZO特百滋貓用老饕鮮味盤整粒鮮雞心凍乾，單一雞心肉源、蛋白質58.9%、脂肪31.2%，本丸、麻糬、海苔都超愛。保證分析與熱量（474kcal/100g）皆取自農業部申報網公開資料，官方未列出鈣磷數值（廠商未公布），這裡另外用USDA生雞心典型值換算推估（非官方，僅供參考）：磷約0.65%、鈣約0.04%，換算下來鈣磷比只有約0.07:1，比草蝦凍乾更懸殊——雞心是內臟肌肉，磷天然偏高、幾乎不含鈣，屬純肉零食常見情況，營養不均衡，加上官方申報明確定位為零食、未標示AAFCO／FEDIAF均衡標準，不建議取代正餐或長期大量餵食。",
    },
    price: 149,
    affiliateUrl: "https://s.shopee.tw/4qEZGrd9w8",
  },
  {
    id: "cat-dry-011",
    category: "貓咪乾糧",
    brand: "Mobby 莫比",
    name: "低卡成貓化毛配方 (雞肉&米) (1.5kg)",
    image: "/images/products/mobby-choice-healthy-weight-hairball.png",
    debugTags: ["含穀（非無穀）"],
    features: ["低卡", "化毛", "雞肉"],
    dmbCarb: 34.44,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "新鮮雞肉，雞肉粉，玉米麩粉，整粒糙米，鮭魚，雞蛋萃取物，雞脂(以混合生育酚-維生素E保鮮)，微晶纖維素，亞麻籽粉，海帶，波菜，萵苣，番茄，迷迭香萃取物，洋香菜薄片，乾菊苣根，牛磺酸，貝殼粉(天然葡萄糖胺來源)，家禽軟骨(天然軟骨素來源)，左旋肉鹼，維生素與礦物質。",
      originCountry: "美國",
      moisture: 10,
      protein: 35,
      fat: 10,
      fiber: 8,
      ash: 6,
      phosphorus: 0.7,
      kcalPer100g: 333.4,
      weightGrams: 1500,
      listPrice: 379,
      salePrice: 379,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "博東客企業有限公司",
          subcontractor: "鑽石寵物食品",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
      { cat: "海苔", verdict: "like" },
    ],
    review: {
      comment:
        "Mobby莫比自然食低卡成貓化毛配方，本丸、麻糬、海苔都愛吃。⚠️ 提醒：官方申報名稱含「米」（玉米麩粉、整粒糙米），並非無穀配方，選購前請留意包裝標示。保證分析（蛋白質35%、脂肪10%、灰分6%、纖維8%、磷0.7%）取自農業部申報網公開資料；官方未列出鈣與熱量，此處熱量（333.4kcal/100g，即3334kcal/kg）取自品牌授權經銷網站標示的營養標示表格，非官方申報數字，鈣磷比因缺鈣資料無法計算。AAFCO標示依品牌官方文案與多家經銷網站說明認定，官方申報本身未附此項聲明。",
    },
    price: 379,
    affiliateUrl: "https://s.shopee.tw/qiQXqUFwA",
  },
  {
    id: "cat-dry-012",
    category: "貓咪乾糧",
    brand: "Mobby 莫比",
    name: "成貓化毛配方 (雞肉&米) (1.5kg)",
    image: "/images/products/mobby-choice-adult-hairball.png",
    debugTags: ["含穀（非無穀）"],
    features: ["化毛", "雞肉"],
    dmbCarb: 31.11,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "雞肉，雞肉粉，大麥，雞蛋衍生物，米粉，纖維素，雞脂(以混合生育酚-維生素E保鮮)，鮭魚，馬鈴薯(2%)，小米，天然雞肉香料，亞麻籽，海魚粉，乾菊苣根，貝殼粉(葡萄糖胺來源)，家禽軟骨(軟骨素來源)，海帶，胡蘿蔔(0.1%)，豌豆(0.1%)，蘋果(0.1%)，番茄，藍莓，菠菜，蔓越莓粉，迷迭香萃取物，洋香菜薄片，絲蘭萃取物，腸道益生菌群，維生素與礦物質。",
      originCountry: "美國",
      moisture: 10,
      protein: 33,
      fat: 15,
      fiber: 8,
      ash: 6,
      phosphorus: 0.9,
      calcium: 1,
      kcalPer100g: 345,
      weightGrams: 1500,
      listPrice: 379,
      salePrice: 379,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "博東客企業有限公司",
          subcontractor: "鑽石寵物食品",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
      { cat: "海苔", verdict: "like" },
    ],
    review: {
      comment:
        "Mobby莫比自然食成貓化毛配方（一般版，非低卡），本丸、麻糬、海苔都愛吃。⚠️ 提醒：官方申報名稱含「米」，原料也有大麥、米粉、小米，並非無穀配方。保證分析（蛋白質33%、脂肪15%、灰分6%、纖維8%、鈣1%、磷0.9%）取自農業部申報網公開資料，這款官方有公布鈣（低卡版沒有），鈣磷比約1.11，落在理想範圍內。官方未列出熱量，此處熱量（345kcal/100g，即3450kcal/kg）取自品牌授權經銷網站標示的營養標示表格，非官方申報數字。AAFCO標示依品牌官方文案與多家經銷網站說明認定，官方申報本身未附此項聲明。",
    },
    price: 379,
    affiliateUrl: "https://s.shopee.tw/qiQXqUFwA",
  },
  {
    id: "cat-dry-013",
    category: "貓咪乾糧",
    brand: "Mobby 莫比",
    name: "無穀配方 (鹿肉 x 鮭魚) (1.5kg)",
    image: "/images/products/mobby-choice-grainfree-venison-salmon.png",
    debugTags: [],
    features: ["鹿肉", "鮭魚", "無穀"],
    dmbCarb: 21.11,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "雞肉粉，海魚粉，豌豆，甜薯，雞脂(以混合生育酚-維生素E保鮮)，馬鈴薯蛋白質，鹿肉，燻鮭魚，蛋胺酸，牛磺酸，氯化膽鹼，乾菊苣根，番茄，藍莓，覆盆子，絲蘭萃取物，腸道益生菌群，維生素E，菸鹼酸，螯合錳，螯合銅，硫化鋅，硫化錳，硫化銅。",
      originCountry: "美國",
      moisture: 10,
      protein: 43,
      fat: 18,
      fiber: 2,
      ash: 8,
      phosphorus: 1,
      calcium: 1.5,
      kcalPer100g: 374.5,
      weightGrams: 1500,
      listPrice: 489,
      salePrice: 489,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "博東客企業有限公司",
          subcontractor: "原始風味寵物食品",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
      { cat: "海苔", verdict: "like" },
    ],
    review: {
      comment:
        "Mobby莫比自然食無穀配方鹿肉x鮭魚，本丸、麻糬、海苔都愛吃。這款原料確實無穀（豌豆、甜薯、馬鈴薯蛋白質為主），符合無穀標示。保證分析（蛋白質43%、脂肪18%、灰分8%、纖維2%、鈣1.5%、磷1%）取自農業部申報網公開資料；官方未列出熱量，此處熱量（374.5kcal/100g，即3745kcal/kg）取自品牌授權經銷網站標示的營養標示表格，非官方申報數字，多家經銷網站數字一致，並標示產地為美國。鈣磷比約1.5，略高於理想範圍 1.1-1.4，建議留意。AAFCO標示依品牌官方文案與多家經銷網站說明認定，官方申報本身未附此項聲明。",
    },
    price: 489,
    affiliateUrl: "https://s.shopee.tw/qiQXqUFwA",
  },
  {
    id: "cat-dry-014",
    category: "貓咪乾糧",
    brand: "Mobby 莫比",
    name: "無穀配方 (鵪鶉 x 鴨肉) (1.5kg)",
    image: "/images/products/mobby-choice-grainfree-quail-duck.png",
    debugTags: [],
    features: ["鵪鶉", "鴨肉", "無穀"],
    partialNutrition: {
      ingredientsText:
        "烤鵪鶉，鴨肉，烤鴨，鴨肉粉，火雞肉粉，雞肉粉，地瓜，扁豆，豌豆，雞脂(以混合生育酚-維生素E保鮮)，鮭魚油，DL-蛋氨酸，鹽，氯化鉀，氯化膽鹼，牛磺酸，藍莓，覆盆子，番茄，天然香料，乾菊苣根，乾燥乳酸桿菌發酵物，乾燥枯草桿菌發酵物，乾燥嗜酸乳酸菌發酵物，乾燥植物乳桿菌發酵物，乾燥雙歧桿菌發酵物，鋅蛋白，維生素E補充劑，菸鹼酸，錳蛋白，銅蛋白，硫酸鋅，硫酸錳，硫酸銅，硝酸硫胺明(維生素B1)，維生素A補充劑，生物素，碘化鉀，泛酸鈣，核黃素(維生素B2)，鹽酸吡哆醇(維生素B6)，維生素B12補充劑，氧化錳，亞硒酸鈉，維生素D補充劑，葉酸。",
      items: [
        { label: "粗蛋白質", value: "36.0%" },
        { label: "粗脂肪", value: "16.0%" },
        { label: "粗纖維", value: "3.0%" },
        { label: "水分", value: "10.0%" },
      ],
      note:
        "官方保證分析只列出蛋白質／脂肪／纖維／水分，未列灰分、鈣、磷、熱量。灰分（約8%）與熱量（約355.8kcal/100g，即3558kcal/kg）在多家經銷網站標示一致，可作為參考，但非官方申報數字。鈣、磷完全查無資料——本品是強化礦物質的配方乾糧，不像純肉零食可用生肉典型值換算，故不做推估，磷含量與鈣磷比無法計分，總分是用其餘三項（碳水、AAFCO、蛋白質，滿分60）按比例換算成 100 分制，僅供粗略參考。原料確實無穀（地瓜、扁豆、豌豆為主），符合無穀標示。",
      estimateInputs: { protein: 36, fat: 16, fiber: 3, moisture: 10 },
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "博東客企業有限公司",
          subcontractor: "原始風味寵物食品",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
      { cat: "海苔", verdict: "like" },
    ],
    review: {
      comment:
        "Mobby莫比自然食無穀配方鵪鶉x鴨肉，本丸、麻糬、海苔都愛吃。原料確實無穀（地瓜、扁豆、豌豆為主）。保證分析（蛋白質36%、脂肪16%、纖維3%）取自農業部申報網公開資料，但官方未列灰分、鈣、磷、熱量；灰分與熱量（355.8kcal/100g）多家經銷網站數字一致可參考，但鈣、磷完全查無資料，本品是強化礦物質的配方乾糧、不適合用生肉典型值推估，故磷與鈣磷比無法計分，總分僅用碳水/蛋白質/AAFCO三項估算，僅供參考。AAFCO標示依品牌官方文案與多家經銷網站說明認定，官方申報本身未附此項聲明。",
    },
    price: 489,
    affiliateUrl: "https://s.shopee.tw/qiQXqUFwA",
  },
  {
    id: "cat-dry-015",
    category: "貓咪乾糧",
    brand: "Mobby 莫比",
    name: "挑嘴成貓饕客配方 (雞肉&米) (1.5kg)",
    image: "/images/products/mobby-choice-fussy-adult.png",
    debugTags: ["含穀（非無穀）"],
    features: ["挑嘴", "雞肉", "鮭魚"],
    dmbCarb: 31.11,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "新鮮雞肉，新鮮鮭魚，雞肉粉，整粒白米，雞脂(以混合生育酚-維生素E保鮮)，燕麥片，馬鈴薯，大麥，亞麻籽，硫酸氫鈉，氯化鉀，DL-蛋氨酸，氯化膽鹼，雞蛋衍生物，胡蘿蔔，豌豆，蘋果，番茄，藍莓，菠菜，海帶，蔓越莓粉，迷迭香萃取物，洋香菜薄片，乾菊苣根，牛磺酸，絲蘭萃取物，乾腸球菌發酵物，嗜酸乳桿A菌，乾酪乳桿C菌和植物乳桿菌，乾木黴發酵萃取物，維生素與礦物質。",
      originCountry: "美國",
      moisture: 10,
      protein: 34,
      fat: 18,
      fiber: 3,
      ash: 7,
      phosphorus: 1.2,
      calcium: 1.5,
      kcalPer100g: 384.4,
      weightGrams: 1500,
      listPrice: 379,
      salePrice: 379,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "博東客企業有限公司",
          subcontractor: "鑽石寵物食品",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
      { cat: "海苔", verdict: "like" },
    ],
    review: {
      comment:
        "Mobby莫比自然食挑嘴成貓饕客配方，新鮮雞肉搭配新鮮鮭魚，本丸、麻糬、海苔都愛吃。⚠️ 提醒：官方申報名稱含「米」，原料也有整粒白米、燕麥片、大麥，並非無穀配方。保證分析（蛋白質34%、脂肪18%、灰分7%、纖維3%、鈣1.5%、磷1.2%）取自農業部申報網公開資料，鈣磷比約1.25，落在理想範圍內。官方未列出熱量，此處熱量（384.4kcal/100g，即3844kcal/kg）取自品牌授權經銷網站標示的營養標示表格，非官方申報數字。AAFCO標示依品牌官方文案與多家經銷網站說明認定，官方申報本身未附此項聲明。",
    },
    price: 379,
    affiliateUrl: "https://s.shopee.tw/qiQXqUFwA",
  },
  {
    id: "cat-dry-016",
    category: "貓咪乾糧",
    brand: "Mobby 莫比",
    name: "幼貓/懷孕授乳貓配方 (雞肉&米) (1.5kg)",
    image: "/images/products/mobby-choice-kitten.png",
    debugTags: ["含穀（非無穀）"],
    features: ["幼貓", "懷孕授乳貓", "雞肉", "鮭魚"],
    dmbCarb: 26.67,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "新鮮雞肉，新鮮鮭魚，整粒白米，雞肉粉，雞脂(以混合生育酚-維生素E保鮮)，豌豆蛋白，燕麥片，馬鈴薯蛋白，馬鈴薯，微晶纖維素，氯化鉀，氯化膽鹼，亞麻籽，雞蛋衍生物，胡蘿蔔，豌豆，蘋果，海帶，番茄，藍莓，菠菜，蔓越莓粉，迷迭香萃取物，洋香菜薄片，乾菊苣根，牛磺酸，絲蘭萃取物，乾腸球菌發酵物，嗜酸乳桿A菌，乾酪乳桿C菌和植物乳桿菌，乾木黴發酵萃取物，維生素與礦物質。",
      originCountry: "美國",
      moisture: 10,
      protein: 34,
      fat: 22,
      fiber: 3,
      ash: 7,
      phosphorus: 1.2,
      calcium: 1.5,
      kcalPer100g: 399,
      weightGrams: 1500,
      listPrice: 379,
      salePrice: 379,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "博東客企業有限公司",
          subcontractor: "鑽石寵物食品",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
    ],
    review: {
      comment:
        "Mobby莫比自然食幼貓/懷孕授乳貓配方，新鮮雞肉搭配新鮮鮭魚，本丸、麻糬小時候都愛吃。⚠️ 提醒：官方申報名稱含「米」，原料也有整粒白米、燕麥片，並非無穀配方。此為成長期配方，蛋白質34%、脂肪22%皆高於一般成貓配方，符合幼貓／懷孕授乳貓較高的營養需求。保證分析（灰分7%、纖維3%、鈣1.5%、磷1.2%）取自農業部申報網公開資料，鈣磷比約1.25，落在理想範圍內。官方未列出熱量，此處熱量（399kcal/100g，即3990kcal/kg）取自品牌授權經銷網站標示的營養標示表格，非官方申報數字。⚠️ 本站評分邏輯是以一般成貓／成犬標準設計，未特別校正幼貓成長期的營養需求門檻，分數僅供參考，幼貓飼料建議仍以「是否標示適用幼貓成長期」為優先考量。AAFCO標示依品牌官方文案與多家經銷網站說明認定，官方申報本身未附此項聲明。",
    },
    price: 379,
    affiliateUrl: "https://s.shopee.tw/qiQXqUFwA",
  },
  {
    id: "cat-dry-017",
    category: "貓咪乾糧",
    brand: "Mobby 莫比",
    name: "無穀配方 (鮭魚 x 鱒魚) (1.5kg)",
    image: "/images/products/mobby-choice-grainfree-trout-salmon.png",
    debugTags: [],
    features: ["鱒魚", "鮭魚", "無穀"],
    partialNutrition: {
      ingredientsText:
        "鱒魚，海魚茸，地瓜，馬鈴薯蛋白，馬鈴薯，芥花油，牛磺酸，煙燻鮭魚，番茄，天然香料，氯化膽鹼，蛋胺酸，乾菊苣根，藍莓，覆盆子，絲蘭萃取物，乾燥發酵產品嗜酸乳桿菌、雙歧桿菌，鋅蛋白，維生素E補充劑，菸鹼酸，錳蛋白，銅蛋白，硫酸鋅，硫酸錳，硫酸銅，硝酸硫胺明(維生素B1)，維生素A補充劑，生物素，碘化鉀，泛酸鈣，核黃素(維生素B2)，鹽酸吡哆醇(維生素B6)，維生素B12補充劑，氧化錳，亞硒酸鈉，維生素D補充劑，葉酸。",
      items: [
        { label: "粗蛋白質", value: "32.0%" },
        { label: "粗脂肪", value: "16.0%" },
        { label: "粗纖維", value: "3.0%" },
        { label: "水分", value: "10.0%" },
      ],
      note:
        "官方保證分析只列出蛋白質／脂肪／纖維／水分，未列灰分、鈣、磷、熱量。灰分（約8%）與熱量（約374.1kcal/100g，即3741kcal/kg）在品牌授權經銷網站標示一致，可作為參考，但非官方申報數字。鈣、磷完全查無資料——本品是強化礦物質的配方乾糧，不像純肉零食可用生肉典型值換算，故不做推估，磷含量與鈣磷比無法計分，總分是用其餘三項（碳水、AAFCO、蛋白質，滿分60）按比例換算成 100 分制，僅供粗略參考。原料確實無穀（地瓜、馬鈴薯為主），符合無穀標示。",
      estimateInputs: { protein: 32, fat: 16, fiber: 3, moisture: 10 },
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "博東客企業有限公司",
          subcontractor: "原始風味寵物食品",
        },
      ],
    },
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
      { cat: "海苔", verdict: "like" },
    ],
    review: {
      comment:
        "Mobby莫比自然食無穀配方鱒魚x煙燻鮭魚，本丸、麻糬、海苔都愛吃。原料確實無穀（地瓜、馬鈴薯為主）。保證分析（蛋白質32%、脂肪16%、纖維3%）取自農業部申報網公開資料，但官方未列灰分、鈣、磷、熱量；灰分與熱量（374.1kcal/100g）品牌授權經銷網站數字一致可參考，但鈣、磷完全查無資料，本品是強化礦物質的配方乾糧、不適合用生肉典型值推估，故磷與鈣磷比無法計分，總分僅用碳水/蛋白質/AAFCO三項估算，僅供參考。AAFCO標示依品牌官方文案與多家經銷網站說明認定，官方申報本身未附此項聲明。",
    },
    price: 489,
    affiliateUrl: "https://s.shopee.tw/qiQXqUFwA",
  },
  {
    id: "cat-can-037",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (19號 純嫩鴨)",
    image: "/images/products/mjamjam-duck.png",
    debugTags: ["無膠"],
    features: ["鴨肉", "單一蛋白質"],
    dmbCarb: 7.62,
    detailedAnalysis: {
      ingredientsText: "70%鮮嫩鴨肉（鴨肉、心、肝）、29%鮮肉汁、0.5%礦物質營養素、0.5%乾燥蛋殼（鈣質來源）。",
      originCountry: "德國",
      moisture: 79,
      protein: 11,
      fat: 6,
      fiber: 0.4,
      ash: 2,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      kcalPer100g: 95.1,
      weightGrams: 400,
      listPrice: 140,
      salePrice: 140,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "400g（0.4公斤）",
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
      { cat: "烏克", verdict: "like" },
      { cat: "三色蛋", verdict: "like" },
    ],
    review: {
      comment:
        "MjAMjAM 德國魔力喵鮮肉主食罐純嫩鴨口味，單一鴨肉來源、成分乾淨無爭議性膠類，符合 FEDIAF 標準，烏克、三色蛋都愛吃。保證分析（含鈣磷）取自農業部申報網公開資料，申報規格與本品同為400g；官方未標示熱量，此處熱量（約95.1kcal/100g）依蛋白質/脂肪/碳水回推估算，非官方數字。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 140,
    affiliateUrl: "https://s.shopee.tw/1LehK9zSRX",
  },
  {
    id: "cat-can-038",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (22號 鮮嫩豬肉 x 胡蘿蔔)",
    image: "/images/products/mjamjam-pork-carrot.png",
    debugTags: ["無膠"],
    features: ["豬肉", "胡蘿蔔"],
    dmbCarb: 5.45,
    detailedAnalysis: {
      ingredientsText: "70%鮮嫩豬肉（豬肉、心、肺、肝）、鮮肉汁、4%胡蘿蔔、礦物質營養素、亞麻仁油、海藻。",
      originCountry: "德國",
      moisture: 78,
      protein: 11.5,
      fat: 6.5,
      fiber: 0.5,
      ash: 2.3,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      kcalPer100g: 99.7,
      weightGrams: 400,
      listPrice: 140,
      salePrice: 140,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "400g（0.4公斤）",
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
      { cat: "烏克", verdict: "like" },
      { cat: "三色蛋", verdict: "like" },
    ],
    review: {
      comment:
        "MjAMjAM 德國魔力喵鮮肉主食罐豬肉x胡蘿蔔口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，烏克、三色蛋都愛吃。保證分析（含鈣磷）取自農業部申報網公開資料，申報規格與本品同為400g；官方未標示熱量，此處熱量（約99.7kcal/100g）依蛋白質/脂肪/碳水回推估算，非官方數字。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 140,
    affiliateUrl: "https://s.shopee.tw/1LehK9zSRX",
  },
  {
    id: "cat-can-039",
    category: "貓咪主食罐",
    brand: "MjAMjAM 魔力喵 迷幻喵",
    name: "魔法喵 奇幻妙喵 貓主食罐 貓罐 德國貓罐 (23號 火雞 x 嫩鴨 x 蒸南瓜)",
    image: "/images/products/mjamjam-turkey-duck-pumpkin.png",
    debugTags: ["無膠"],
    features: ["火雞肉", "鴨肉", "南瓜"],
    dmbCarb: 3.33,
    detailedAnalysis: {
      ingredientsText: "56%火雞（火雞肉、胃、肝）、鮮肉汁、鴨肉、4%南瓜、礦物質營養素、亞麻仁油、海藻。",
      originCountry: "德國",
      moisture: 76,
      protein: 11.5,
      fat: 9,
      fiber: 0.5,
      ash: 2.2,
      phosphorus: 0.25,
      calcium: 0.3,
      caPhosRatio: "1.2",
      kcalPer100g: 119.55,
      weightGrams: 400,
      listPrice: 140,
      salePrice: 140,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "400g（0.4公斤）",
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
      { cat: "烏克", verdict: "like" },
      { cat: "三色蛋", verdict: "like" },
    ],
    review: {
      comment:
        "MjAMjAM 德國魔力喵鮮肉主食罐火雞x嫩鴨x蒸南瓜口味，成分乾淨無爭議性膠類，符合 FEDIAF 標準，烏克、三色蛋都愛吃。保證分析（含鈣磷）取自農業部申報網公開資料，申報規格與本品同為400g；官方未標示熱量，此處熱量（約119.6kcal/100g）依蛋白質/脂肪/碳水回推估算，非官方數字。鈣磷比約1.2，落在理想範圍內。",
    },
    price: 140,
    affiliateUrl: "https://s.shopee.tw/1LehK9zSRX",
  },
  {
    id: "cat-dry-018",
    category: "貓咪乾糧",
    brand: "ROYAL CANIN 法國皇家",
    name: "室內成貓專用飼料 IN27 (4kg)",
    image: "/images/products/royalcanin-indoor-in27.png",
    debugTags: ["含穀（非無穀）"],
    features: ["室內貓", "化毛", "熱量管理", "降低便臭"],
    dmbCarb: 44.13,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "小麥、米、植物分離蛋白、脫水家禽蛋白、玉米、動物脂肪、水解動物蛋白、小麥麵粉、蔬菜纖維、礦物質、甜菜漿、大豆油、酵母及酵母提取物、魚油、果寡糖、洋車前子及殼(0.5%)。",
      originCountry: "韓國",
      moisture: 8,
      protein: 27,
      fat: 13,
      fiber: 3.8,
      ash: 7.6,
      phosphorus: 0.85,
      calcium: 1.1,
      caPhosRatio: "1.29",
      kcalPer100g: 353.4,
      weightGrams: 4000,
      listPrice: 1566,
      salePrice: 1566,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "4 公斤",
          sourceType: "輸入",
          origin: "—",
          company: "台灣皇家寵物食品有限公司",
          subcontractor: "RGY, Royal Canin Gimje Factory",
        },
      ],
    },
    aafcoCertified: true,
    review: {
      comment:
        "ROYAL CANIN 法國皇家室內成貓專用飼料 IN27，主打降低便臭、化毛、熱量管理，適合室內活動量較低的成貓。⚠️ 提醒：原料含小麥、米、玉米，並非無穀配方。保證分析（蛋白質27%、脂肪13%、纖維3.8%、灰分7.6%、鈣1.1%、磷0.85%）取自農業部申報網公開資料；官方申報未列水分與熱量，此處水分（上限8%）與熱量（353.4kcal/100g，即3534kcal/kg）取自 Royal Canin 官方網站公開資料，符合 AAFCO 標準。鈣磷比約1.29，落在理想範圍內；碳水偏高（DM約44%），符合此類穀物基底配方的特性。毛孩評價待更新。",
    },
    price: 1566,
    affiliateUrl: "https://s.shopee.tw/50Xzp2nOmC",
  },
  {
    id: "supplement-000",
    category: "毛孩保健品",
    brand: "毛孩時代",
    name: "95%頂級深海魚油 (30顆)",
    image: "/images/products/maohaishidai-fish-oil.png",
    debugTags: [],
    features: ["Omega-3", "犬貓適用", "ISO22000/HACCP雙認證工廠"],
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "0.06 公斤（30顆 x 700mg）",
          sourceType: "委託代工廠製造",
          origin: "—",
          company: "騰勢股份有限公司",
          subcontractor: "中南生物科技股份有限公司",
        },
      ],
    },
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
    ],
    review: {
      comment:
        "毛孩時代95%頂級深海魚油，犬貓適用保健品，本丸、海苔都願意吃。成分為深海魚油（Omega-3 95%、EPA 60%、DHA 20%）與維生素E抗氧化劑，官方申報標示每顆（700mg）含熱量5大卡、脂肪0.5g、蛋白質0.2g、碳水0.1g，資料取自農業部申報網公開資料。廠商文案標示具ISO22000／HACCP雙認證工廠、堅持使用專利及實驗證明有效原料，但此為廠商自述、非本站查核項目。⚠️ 本品為保健品膠囊，成分標示方式與一般主食的保證分析不同，不適用本站碳水/AAFCO評分邏輯，故不計分。",
    },
    price: 790,
    affiliateUrl: "https://s.shopee.tw/2gA54ivfiZ",
  },
  {
    id: "cat-dry-019",
    category: "貓咪乾糧",
    brand: "毛孩時代",
    name: "80%鮮魚肉無穀全貓糧 (1.5kg)",
    image: "/images/products/maohaishidai-fish-grainfree.png",
    debugTags: [],
    features: ["魚肉", "無穀", "全齡貓"],
    dmbCarb: 22.22,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "脫水魚肉（鰹魚、鯡魚、鱈魚、鰈魚、沙丁魚）、豌豆、雞油、新鮮鮭魚泥、番薯、魚油（鮭魚油、SPD專利魚油）、酵母、甜菜、木質纖維、苜蓿、絲蘭、鱉蛋、菊糖、果寡糖、牛磺酸、甲硫胺酸、有機鋅、有機鐵、有機錳、有機銅、有機硒、有機鉻、維生素A、維生素D3、維生素E、維生素B1、維生素B2、維生素B6、維生素B12、菸鹼酸、泛酸、葉酸、膽鹼。",
      originCountry: "台灣",
      moisture: 10,
      protein: 37,
      fat: 18,
      fiber: 5,
      ash: 10,
      phosphorus: 0.84,
      calcium: 1,
      caPhosRatio: "1.19",
      kcalPer100g: 352.5,
      weightGrams: 1500,
      listPrice: 850,
      salePrice: 850,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "1.5 ± 0.15 公斤",
          sourceType: "委託代工廠製造",
          origin: "—",
          company: "騰勢股份有限公司",
          subcontractor: "台灣信元寵物食品股份有限公司",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "AAFCO",
    review: {
      comment:
        "毛孩時代80%鮮魚肉無穀全貓糧，主原料為脫水魚肉（鰹魚、鯡魚、鱈魚、鰈魚、沙丁魚），原料確實無穀（豌豆、番薯為主）。保證分析（蛋白質37%、脂肪18%、纖維5%、灰分10%、鈣1%、總磷0.84%、碳水化合物20%、熱量352.5kcal/100g）皆取自農業部申報網公開資料，資料完整度高，官方連碳水與熱量都有直接標示。鈣磷比約1.19，落在理想範圍內。品牌標示符合 AAFCO、FEDIAF 標準（此聲明未見於農業部申報網摘要，依廠商包裝／官方文案認定）。毛孩評價待更新。",
    },
    price: 850,
    affiliateUrl: "https://s.shopee.tw/AUswQXHsQP",
  },
  {
    id: "cat-dry-020",
    category: "貓咪乾糧",
    brand: "毛孩時代",
    name: "85%鮮雞肉無穀全貓糧 (1.5kg)",
    image: "/images/products/maohaishidai-chicken-grainfree.png",
    debugTags: [],
    features: ["雞肉", "無穀", "全齡貓"],
    dmbCarb: 13.04,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "脫水雞肉（台灣、澳洲）、新鮮雞肉漿（台灣氣冷雞）、豌豆、番薯、酵母、雞油、魚油（鮭魚油、SPD專利魚油）、甜菜、木質纖維、苜蓿、絲蘭、菊糖、果寡糖、益生菌（LAB2PRO專利益生菌）、牛磺酸、甲硫胺酸、有機鋅、有機鐵、有機錳、有機銅、有機硒、有機鉻、維生素A、維生素D3、維生素E、維生素B1、維生素B2、維生素B6、維生素B12、菸鹼酸、泛酸、葉酸、膽鹼。",
      originCountry: "台灣",
      moisture: 8,
      protein: 48,
      fat: 17,
      fiber: 5,
      ash: 10,
      phosphorus: 0.84,
      calcium: 1,
      caPhosRatio: "1.19",
      kcalPer100g: 354.5,
      weightGrams: 1500,
      listPrice: 790,
      salePrice: 790,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "1.5 ± 0.15 公斤",
          sourceType: "委託代工廠製造",
          origin: "—",
          company: "騰勢股份有限公司",
          subcontractor: "台灣信元寵物食品股份有限公司",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "AAFCO",
    ourCatsRating: [{ cat: "烏克", verdict: "like" }],
    review: {
      comment:
        "毛孩時代85%鮮雞肉無穀全貓糧，主原料為脫水雞肉（台灣、澳洲）與新鮮雞肉漿（台灣氣冷雞），原料確實無穀（豌豆、番薯為主），烏克愛吃。保證分析（蛋白質48%、脂肪17%、纖維5%、灰分10%、水分8%、鈣1%、總磷0.84%、碳水化合物12%、熱量354.5kcal/100g）皆取自農業部申報網公開資料，官方連碳水與熱量都有直接標示。鈣磷比約1.19，落在理想範圍內。品牌官網明確標示營養成分符合 AAFCO、FEDIAF 兩大標準。",
    },
    price: 790,
    affiliateUrl: "https://s.shopee.tw/3g2cKjEcTB",
  },
  {
    id: "cat-dry-021",
    category: "貓咪乾糧",
    brand: "HeroMama 英雄媽媽",
    name: "益生菌晶球夾心糧－深海鱈魚 亮毛護膚 (1.5kg)",
    image: "/images/products/heromama-probiotic-cod.png",
    debugTags: [],
    features: ["鱈魚", "益生菌", "全齡貓", "亮毛護膚"],
    dmbCarb: 17.7,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "乾燥藍鱈及鯡魚、新鮮雞肉、豌豆蛋白、雞脂肪、樹薯澱粉、小肽蛋白、酵母粉、乳酪粉、鮭魚油、碗豆、植物纖維、水解酵母、田園蔬菜（蔓越莓、南瓜、紅蘿蔔）、鱉蛋粉、卵磷脂、蛋黃粉、蛋白粉、牛磺酸、膽鹼、果寡醣、甘露寡醣、離胺酸、蛋胺酸、磷酸氫二鉀、磷酸鎂、焦磷酸鈉、綜合維生素（維生素A、維生素D3、維生素C、維生素E、維生素B1、維生素B2、維生素B6、維生素B12、菸鹼酸、泛酸鈣、葉酸、生物素H）、綜合礦物質（銅、鐵、錳、鋅）、膠原蛋白、絲蘭、酵母硒、β-葡聚醣，另添加副乾酪乳桿菌、嗜熱鏈球菌、鼠李糖乳桿菌等多株益生菌。",
      originCountry: "台灣",
      moisture: 8.5,
      protein: 43.8,
      fat: 17.7,
      fiber: 5.4,
      ash: 9,
      phosphorus: 0.88,
      calcium: 1.21,
      caPhosRatio: "1.38",
      kcalPer100g: 359.7,
      weightGrams: 1500,
      listPrice: 980,
      salePrice: 980,
    },
    officialFiling: {
      queryDate: "2026-08-04",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "委託代工廠製造",
          origin: "—",
          company: "飛輪寵物有限公司",
          subcontractor: "自力耕生股份有限公司",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "AAFCO",
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
      { cat: "海苔", verdict: "like" },
    ],
    review: {
      comment:
        "HeroMama益生菌晶球夾心糧－深海鱈魚口味，主原料為乾燥藍鱈及鯡魚、新鮮雞肉，並添加多株益生菌與魚油訴求亮毛護膚，本丸、麻糬、海苔都愛吃。保證分析（蛋白質43.8%、脂肪17.7%、纖維5.4%、灰分9%、水分8.5%、鈣1.21%、總磷0.88%、碳水化合物16.2%、熱量359.7kcal/100g）皆取自農業部申報網公開資料，與品牌官網數據一致。鈣磷比約1.38，在合理範圍。要注意的是配方含樹薯澱粉、豌豆蛋白，並非無穀配方，碳水化合物（DMB約17.7%）也略高於同類無穀產品。品牌官網聲明營養配分依據AAFCO／NRC標準設計，但未見有第三方認證或FEDIAF標準的相關聲明。",
    },
    price: 980,
    affiliateUrl: "https://s.shopee.tw/111rBrrH74",
  },
  {
    id: "cat-dry-022",
    category: "貓咪乾糧",
    brand: "HeroMama 英雄媽媽",
    name: "益生菌晶球夾心糧－曠野鮮雞 腸胃排毛 (1.5kg)",
    image: "/images/products/heromama-probiotic-chicken.png",
    debugTags: [],
    features: ["雞肉", "益生菌", "全齡貓", "腸胃排毛"],
    dmbCarb: 17.7,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "脫水雞肉、新鮮雞肉、豌豆蛋白、雞脂肪、樹薯澱粉、新鮮虱目魚、小肽蛋白、酵母粉、乳酪粉、鮭魚油、碗豆、植物纖維、水解酵母、田園蔬菜（蔓越莓、南瓜、紅蘿蔔）、小麥草、貓薄荷、蛋黃粉、蛋白粉、牛磺酸、膽鹼、果寡醣、甘露寡醣、離胺酸、蛋胺酸、磷酸氫二鉀、磷酸鎂、焦磷酸鈉、綜合維生素（維生素A、維生素D3、維生素C、維生素E、維生素B1、維生素B2、維生素B6、維生素B12、菸鹼酸、泛酸鈣、葉酸、生物素H）、綜合礦物質（銅、鐵、錳、鋅）、膠原蛋白、絲蘭、酵母硒、β-葡聚醣，另添加副乾酪乳桿菌、嗜熱鏈球菌、鼠李糖乳桿菌等多株益生菌。",
      originCountry: "台灣",
      moisture: 8.5,
      protein: 43.7,
      fat: 17.6,
      fiber: 5.5,
      ash: 9,
      phosphorus: 0.88,
      calcium: 1.21,
      caPhosRatio: "1.38",
      kcalPer100g: 359.7,
      weightGrams: 1500,
      listPrice: 980,
      salePrice: 980,
    },
    officialFiling: {
      queryDate: "2026-08-05",
      records: [
        {
          spec: "1.5 公斤",
          sourceType: "委託代工廠製造",
          origin: "—",
          company: "飛輪寵物有限公司",
          subcontractor: "自力耕生股份有限公司",
        },
      ],
    },
    aafcoCertified: true,
    certStandard: "AAFCO",
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "麻糬", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "荳荳", verdict: "like" },
    ],
    review: {
      comment:
        "HeroMama益生菌晶球夾心糧－曠野鮮雞口味，主原料為脫水雞肉、新鮮雞肉，並添加新鮮虱目魚、小麥草、貓薄荷與多株益生菌，訴求腸胃排毛，本丸、麻糬、海苔、荳荳都愛吃。保證分析（蛋白質43.7%、脂肪17.6%、纖維5.5%、灰分9%、水分8.5%、鈣1.21%、總磷0.88%、碳水化合物16.2%、熱量359.7kcal/100g）皆取自農業部申報網公開資料，數值與同系列深海鱈魚口味幾乎相同。鈣磷比約1.38，在合理範圍。同樣要注意配方含樹薯澱粉、豌豆蛋白，並非無穀配方，碳水化合物（DMB約17.7%）偏高。品牌官網聲明營養配分依據AAFCO／NRC標準設計，但未見第三方認證或FEDIAF標準的相關聲明。",
    },
    price: 980,
    affiliateUrl: "https://s.shopee.tw/W5bpCAaZt",
  },
  {
    id: "cat-dry-023",
    category: "貓咪乾糧",
    brand: "HeroMama 英雄媽媽",
    name: "幼貓初乳晶球糧 6mm小顆粒飼料+初乳凍乾晶球+增量營養素+低敏腸胃友善 (營養嫩雞) (300g)",
    image: "/images/products/heromama-kitten-colostrum-chicken.png",
    debugTags: [],
    features: ["雞肉", "無穀", "幼貓", "初乳"],
    dmbCarb: 20.87,
    detailedAnalysis: {
      productType: "乾飼糧",
      ingredientsText:
        "乾燥去骨雞肉、乾燥雞肉、豌豆蛋白、雞油脂、樹薯澱粉、小肽蛋白、凍乾雞肉及雞肝、酵母粉、鮭魚油、豌豆、乳酪粉、植物纖維、水解酵母、田園蔬菜（蔓越莓、南瓜、紅蘿蔔）、卵磷脂、乾燥全蛋、牛磺酸、膽鹼、果寡醣、甘露寡醣、離胺酸、蛋胺酸、磷酸氫二鉀、專利水溶性膳食纖維、綜合維生素（維生素A、維生素D3、維生素C、維生素E、維生素B1、維生素B2、維生素B6、維生素B12、菸鹼酸、泛酸鈣、葉酸、維生素B7）、綜合礦物質（銅、鐵、錳、鋅）、絲蘭、後生元、APS初乳、酵母硒、β-葡聚醣、益生菌、半乳寡糖、天然生育酚、迷迭香萃取物。",
      originCountry: "台灣",
      moisture: 8,
      protein: 43.2,
      fat: 17.8,
      fiber: 4,
      ash: 7.8,
      phosphorus: 0.82,
      calcium: 1.15,
      caPhosRatio: "1.40",
      kcalPer100g: 370.8,
      weightGrams: 300,
      listPrice: 270,
      salePrice: 270,
    },
    officialFiling: {
      queryDate: "2026-08-05",
      records: [
        {
          spec: "300 公克",
          sourceType: "委託代工廠製造",
          origin: "—",
          company: "飛輪寵物有限公司",
          subcontractor: "自力耕生股份有限公司",
        },
      ],
    },
    ourCatsRating: [{ cat: "麻糬", verdict: "like" }],
    review: {
      comment:
        "HeroMama幼貓初乳晶球糧－營養嫩雞口味，主原料為乾燥去骨雞肉、乾燥雞肉，並添加初乳凍乾晶球（APS初乳）、益生菌與後生元，訴求低敏腸胃友善，6mm小顆粒適合幼貓與轉食階段，麻糬愛吃。保證分析（蛋白質43.2%、脂肪17.8%、纖維4%、灰分7.8%、水分8%、鈣1.15%、總磷0.82%、熱量370.8kcal/100g）皆取自農業部申報網公開資料；官方未直接列出碳水化合物數值，此處以100%扣除蛋白質/脂肪/灰分/纖維/水分回推估算約19.2%，DMB碳水約20.87%，非官方數字。鈣磷比約1.40，落在理想範圍上緣。品牌官網明確標示為「低敏無穀配方」，但頁面全文並未提及 AAFCO、NRC 或 FEDIAF 標準，與同品牌益生菌晶球夾心糧系列的標示不同，選購前建議留意。",
    },
    price: 270,
    affiliateUrl: "https://s.shopee.tw/1qazQs10NV",
  },
];
