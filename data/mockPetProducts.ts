export type PetProductCategory =
  | "貓咪主食罐"
  | "貓砂/用品"
  | "狗狗主食罐"
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

export interface PetProduct {
  id: string;
  category: PetProductCategory;
  brand: string;
  name: string;
  /** 商品圖片網址（示意圖，正式上線請替換為實拍圖） */
  image: string;
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
    dmbCarb: 4.17,
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
    dmbCarb: 4.58,
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
];
