import Link from "next/link";
import Image from "next/image";
import { Home, Sparkles } from "lucide-react";

interface PetProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  imageSrc: string;
}

const pets: PetProfile[] = [
  {
    id: "benwan",
    name: "本丸",
    role: "Debug 總監",
    description: "負責監督工程師程式碼，最喜歡趴在木桌邊緣偷懶。",
    imageSrc: "/images/cats/shorthair.png",
  },
  {
    id: "mochi",
    name: "麻糬",
    role: "高級療癒師",
    description: "軟綿綿的白肚肚，隨時提供最高質感的肚肚按摩與療癒能量。",
    imageSrc: "/images/cats/white.png",
  },
  {
    id: "nori",
    name: "海苔",
    role: "爆毛大隊長",
    description: "擁有超級爆毛的粉紅小山竹，負責嚴格把關生活品質與肉乾 CP 值。",
    imageSrc: "/images/cats/norwegian-forest.png",
  },
];

export default function PetSection() {
  return (
    <section id="pet-section" className="w-full rounded-3xl bg-white px-4 py-16 transition-colors duration-300 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-500">
              <Sparkles className="h-4 w-4" />
              <span>Pet Zone</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
              萌寵專區
            </h2>
            <p className="mt-2 text-base text-slate-500">
              認識我們的貓咪團隊，陪伴你度過每個開發與生活日常。
            </p>
          </div>

          {/* 回到首頁按鈕 */}
          <div className="flex items-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-orange-500 hover:shadow-md active:scale-95"
            >
              <Home className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span>回到首頁</span>
            </Link>
          </div>
        </div>

        {/* Pet Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                {/* Image Container：固定 1:1 比例，裁切比例不受視窗寬度影響 */}
                <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50 transition-colors group-hover:bg-orange-50/30">
                  <Image
                    src={pet.imageSrc}
                    alt={pet.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ objectPosition: "50% 14%" }}
                  />
                </div>

                {/* Role Badge */}
                <span className="mb-3 inline-block rounded-md bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                  {pet.role}
                </span>

                {/* Name */}
                <h3 className="mb-1 text-xl font-bold text-slate-800">
                  {pet.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {pet.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
