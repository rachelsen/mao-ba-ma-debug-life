export type PetProductCategory =
  | "貓咪主食罐"
  | "貓砂/用品"
  | "狗狗糧食/零食"
  | "毛孩保健品";

export interface PetProductReview {
  /** 工程師毛拔麻的一句話短評 */
  comment: string;
  pros: string[];
  cons: string[];
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
  /** 本站三貓（本丸／海苔／麻糬）試吃心得 */
  ourCatsRating?: CatRating[];
  review: PetProductReview;
  price: number;
  originalPrice?: number;
  discountNote?: string;
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
    debugTags: [],
    features: ["零澱粉", "零穀物", "無添加爭議性膠類", "單一肉源"],
    dmbCarb: 4.17,
    aafcoCertified: true,
    ourCatsRating: [
      { cat: "本丸", verdict: "like" },
      { cat: "海苔", verdict: "like" },
      { cat: "麻糬", verdict: "neutral" },
    ],
    review: {
      comment:
        "鮮雞單一肉源搭配蒲公英，配方乾淨無爭議性膠類增稠，DMB 碳水控制得很低，本丸跟海苔一吃就愛上。",
      pros: ["零澱粉零穀物，配方單純", "AAFCO 認證，可安心當主食"],
      cons: ["單價偏高，長期餵食成本較高", "蒲公英風味較特殊，麻糬偶爾會挑嘴"],
    },
    price: 65,
    affiliateUrl: "https://s.shopee.tw/2LX3cefdNR",
  },
];
