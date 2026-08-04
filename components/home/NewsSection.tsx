import { newsItems } from "@/data/newsItems";

export function NewsSection() {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
      <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 bg-brand-green/10 px-3 py-1 text-sm font-medium text-brand-green">
        📰 最新新聞
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {newsItems.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2 rounded-2xl border border-slate-100 bg-cream-bg-light/60 p-5 transition hover:border-brand-orange/40 hover:bg-brand-orange/5"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
              <span>{item.date}</span>
              <span>·</span>
              <span>{item.source}</span>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-stone-500"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-sm font-bold leading-snug text-slate-800 group-hover:text-brand-orange-dark">
              {item.title}
            </h3>
            <p className="line-clamp-3 text-xs leading-relaxed text-stone-500">
              {item.summary}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
