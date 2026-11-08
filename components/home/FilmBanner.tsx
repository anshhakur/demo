"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Full-width brand film. Plays silently while on screen and pauses when scrolled away
 * (saves phone data and battery). Honours reduced-motion settings and has a pause button.
 */
export function FilmBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          video.play().catch(() => setPlaying(false));
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <section aria-labelledby="film-title" className="bg-charcoal text-ivory" data-theme="dark">
      <div className="relative">
        <video
          ref={videoRef}
          src="/videos/runway.mp4"
          poster="/videos/runway-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Models walking in tailored jackets and trousers outside a modern building"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="aspect-video max-h-[80vh] w-full object-cover"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause film" : "Play film"}
          className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center bg-charcoal/70 text-ivory backdrop-blur-sm"
        >
          {playing ? (
            <Pause className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Play className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
        <div className="pointer-events-none absolute inset-0 hidden bg-charcoal/30 md:block" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 hidden p-12 md:block lg:p-16">
          <FilmCopy />
        </div>
      </div>
      <div className="px-5 py-10 sm:px-8 md:hidden">
        <FilmCopy />
      </div>
    </section>
  );
}

function FilmCopy() {
  return (
    <div className="max-w-xl">
      <h2 id="film-title" className="font-serif text-4xl leading-none md:text-6xl">
        See it in motion.
      </h2>
      <p className="mt-4 text-ivory/85 md:text-lg">
        Tailored jackets, soft knits and easy trousers, worn the way they&rsquo;re meant to be.
      </p>
      <div className="pointer-events-auto mt-7">
        <ButtonLink href="/collections/layering-edit" variant="light">
          Shop the look
        </ButtonLink>
      </div>
    </div>
  );
}
