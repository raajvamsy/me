// One labelled audio clip inside an article.
export function Sample({ src, label }: { src: string; label: string }) {
  return (
    <figure className="sample">
      <figcaption>{label}</figcaption>
      <audio controls preload="none" src={src} />
    </figure>
  );
}
