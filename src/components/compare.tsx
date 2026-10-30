// Panels of one picture at each step, written as "file:Label|file:Label" under the evidence folder.
export function Compare({ images, caption }: { images: string; caption: string }) {
  const panels = images.split("|").map((panel) => panel.split(":"));
  return (
    <figure className="compare">
      <div style={{ gridTemplateColumns: `repeat(${panels.length}, minmax(0, 1fr))` }}>
        {panels.map(([file, label]) => (
          <div key={file}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/research/organism/evidence/${file}.webp`} alt={label} loading="lazy" />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
