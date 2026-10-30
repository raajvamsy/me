import fs from "node:fs";
import path from "node:path";

const exists = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));

export const hasMedia = exists;

const isDev = process.env.NODE_ENV !== "production";

// Each page has a fixed place for its film and image. Drop the file into public/ and the
// page picks it up; a missing file shows a note in development and nothing in production.
export function PageMedia({ base, title }: { base: string; title: string }) {
  const image = `/img/${base}.webp`;
  const video = `/video/${base}.mp4`;

  return (
    <div className="page-media">
      {exists(video) ? (
        <figure>
          <video controls preload="metadata" src={video} />
          <figcaption>Overview: {title}</figcaption>
        </figure>
      ) : (
        isDev && <div className="media-slot">Overview video slot: public{video}</div>
      )}
      {exists(image) ? (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={`Illustration for ${title}`} width={1800} height={1013} />
        </figure>
      ) : (
        isDev && <div className="media-slot">Image slot: public{image}</div>
      )}
    </div>
  );
}
