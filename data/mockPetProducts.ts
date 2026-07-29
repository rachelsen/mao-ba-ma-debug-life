export type PetProductCategory =
  | "貓咪主食罐"
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
  /** 已知的官方標示項目，例如 { label: "蛋白質(min)", value: "9.0%" } */
  items: { label: string; value: string }[];
  /** 說明為何無法提供完整保證分析對照表 */
  note: string;
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
    id: "dog-can-000",
    category: "狗狗主食罐",
    brand: "Cesar 西莎",
    name: "精緻風味餐盒 (牛肉) 24入",
    image: "/images/products/cesar-gourmet-tray-beef.png",
    debugTags: [],
    features: ["肉餅"],
    partialNutrition: {
      items: [
        { label: "蛋白質(min)", value: "9.0%" },
        { label: "脂肪(min)", value: "4.5%" },
        { label: "水分(max)", value: "89%" },
        { label: "膳食纖維(max)", value: "0.4%–1.0%" },
        { label: "熱量(代謝能)", value: "70–95 kcal/100g" },
      ],
      note: "官方包裝僅標示上述數值，未列出灰質、磷、鈣、鈉等具體百分比（統稱於「必需維生素及礦物質」），故無法提供完整乾物比／熱量佔對照表。",
    },
    aafcoCertified: true,
    ourCatsRating: [{ cat: "露比", verdict: "like" }],
    review: {
      comment:
        "西莎精緻風味餐盒牛肉口味，24入分裝方便，符合 AAFCO 標準，露比很捧場。官方包裝未完整揭露灰分、磷等數值，暫無法提供完整保證分析對照表。",
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
    features: ["小型犬", "迷你犬", "雞肉"],
    partialNutrition: {
      items: [
        { label: "粗蛋白質(min)", value: "20.5%" },
        { label: "粗脂肪(min)", value: "11.5%" },
        { label: "粗纖維(max)", value: "3%" },
        { label: "水分(max)", value: "10%" },
        { label: "維生素E(min)", value: "700 IU/kg" },
        { label: "維生素C(min)", value: "125 mg/kg" },
      ],
      note: "官方保證成分分析未列出灰分、磷、熱量等數值，故無法提供完整乾物比／熱量佔對照表。",
    },
    aafcoCertified: true,
    ourCatsRating: [{ cat: "露比", verdict: "like" }],
    review: {
      comment:
        "希爾思雞肉配方，專為小型及迷你成犬設計，符合 AAFCO 標準，露比很喜歡。官方保證分析未列出灰分、磷等數值，暫無法提供完整保證分析對照表。",
    },
    price: 791,
    affiliateUrl: "https://s.shopee.tw/3LPcgvJllu",
  },
  {
    id: "dog-dry-001",
    category: "狗狗乾糧",
    brand: "Hill's 希爾思",
    name: "雞肉 1-6歲小型及迷你成犬 (7.03公斤)",
    image: "/images/products/hills-chicken-adult-small-mini-1-6y.png",
    debugTags: [],
    features: ["小型犬", "迷你犬", "雞肉"],
    partialNutrition: {
      items: [
        { label: "粗蛋白質(min)", value: "20.5%" },
        { label: "粗脂肪(min)", value: "11.5%" },
        { label: "粗纖維(max)", value: "3%" },
        { label: "水分(max)", value: "10%" },
        { label: "維生素E(min)", value: "700 IU/kg" },
        { label: "維生素C(min)", value: "125 mg/kg" },
      ],
      note: "官方保證成分分析未列出灰分、磷、熱量等數值，故無法提供完整乾物比／熱量佔對照表。",
    },
    aafcoCertified: true,
    ourCatsRating: [{ cat: "露比", verdict: "like" }],
    review: {
      comment:
        "希爾思雞肉配方，專為小型及迷你成犬設計，符合 AAFCO 標準，露比很喜歡。官方保證分析未列出灰分、磷等數值，暫無法提供完整保證分析對照表。",
    },
    price: 2499,
    affiliateUrl: "https://s.shopee.tw/3LPcgvJllu",
  },
];
