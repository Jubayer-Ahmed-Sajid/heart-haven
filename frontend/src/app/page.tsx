const highlights = [
  {
    title: "Moner Kotha",
    text: "Anonymous vent feed with a soft, non-judgmental tone.",
  },
  {
    title: "No-Contact Engine",
    text: "Track your streak and get gentle Bengali comfort quotes when you feel weak.",
  },
  {
    title: "Support Chat",
    text: "Private peer rooms powered by Socket.io and JWT.",
  },
  {
    title: "Resource Directory",
    text: "Mental health professionals, counseling services, and helplines in Bangladesh.",
  },
];

const supportCards = ["bKash", "Nagad", "Upay", "Rocket"];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
        <div className="max-w-2xl space-y-5">
          <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            Heart-Haven
          </span>
          <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            A quiet digital sanctuary for healing after heartbreak.
          </h1>
          <p className="text-base leading-7 text-slate-600 sm:text-lg">
            Built for Bangladesh with anonymity, emotional safety, and a calm mobile-first experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <a className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white" href="#features">
              Explore the app
            </a>
            <a className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700" href="#support">
              See support options
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="mt-6 grid gap-4 md:grid-cols-2">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-200/80 bg-slate-950 p-6 text-white shadow-sm">
          <h2 className="text-xl font-semibold">What ships first</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
            <li>• Anonymous posting with MongoDB persistence</li>
            <li>• No-contact streak tracking with comfort quotes</li>
            <li>• Real-time chat rooms for private support</li>
            <li>• Resource cards for Dhaka and wider Bangladesh</li>
          </ul>
        </article>

        <article id="support" className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Future support funding</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Mock payment scaffolds are ready for bKash, Nagad, Upay, and Rocket.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {supportCards.map((card) => (
              <span key={card} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                {card}
              </span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
