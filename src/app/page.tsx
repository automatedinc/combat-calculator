import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Hero */}
      <div className="text-center space-y-6 mb-16">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="text-red-500">Combat</span>
          <br />
          <span className="text-amber-400">Calculator</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Simulate the full 10th Edition combat sequence. Select your units,
          choose weapons, and see the carnage unfold — roll by roll.
        </p>
        <Link
          href="/simulator"
          className="inline-flex items-center gap-2 rounded-md bg-red-700 px-8 py-3 text-lg font-semibold text-white hover:bg-red-600 transition-colors"
        >
          Launch Simulator
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          title="Full Combat Sequence"
          description="Hit rolls, wound rolls, saving throws, damage allocation, and Feel No Pain — all automated with accurate 10th Edition rules."
        />
        <FeatureCard
          title="Weapon Abilities"
          description="Lethal Hits, Sustained Hits, Devastating Wounds, Torrent, Melta, Twin-linked, Blast, and more — all implemented."
        />
        <FeatureCard
          title="Statistical Analysis"
          description="Run 1000+ simulations to see average damage, kill probabilities, and damage distributions at a glance."
        />
      </div>

      {/* Faction Tags */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Preset Units</h2>
        <p className="text-muted-foreground mb-6">
          25+ units across 6 factions ready to go.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: 'Space Marines', color: 'bg-blue-800' },
            { name: 'Chaos', color: 'bg-red-900' },
            { name: 'Aeldari', color: 'bg-emerald-800' },
            { name: 'Orks', color: 'bg-green-800' },
            { name: 'Tyranids', color: 'bg-orange-900' },
            { name: 'Necrons', color: 'bg-neutral-700' },
          ].map((faction) => (
            <span
              key={faction.name}
              className={`${faction.color} rounded-full px-4 py-1 text-sm font-medium text-white`}
            >
              {faction.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
