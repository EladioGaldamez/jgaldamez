import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, Flip);

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SEEN_KEY = "jg:loader-seen";

/* -------------------------------------------------------------------------- */
/* Loader                                                                      */
/* -------------------------------------------------------------------------- */

function readSeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable — loader will just replay */
  }
}

function waitForVideo(video: HTMLVideoElement | null): Promise<void> {
  if (!video || video.readyState >= 3) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    video.addEventListener("canplaythrough", done, { once: true });
    video.addEventListener("error", done, { once: true });
  });
}

function runLoader(): Promise<void> {
  const loader = document.querySelector<HTMLElement>("[data-loader]");
  if (!loader || !root.classList.contains("is-loading")) return Promise.resolve();

  const percent = loader.querySelector<HTMLElement>("[data-loader-percent]")!;
  const bar = loader.querySelector<HTMLElement>("[data-loader-bar]")!;
  const meta = loader.querySelector<HTMLElement>("[data-loader-meta]")!;
  const media = document.querySelector<HTMLElement>("[data-hero-media]");
  const video = document.querySelector<HTMLVideoElement>("[data-hero-video]");

  const seen = readSeen();
  const minDuration = seen ? 0.7 : 2.4;

  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>("[data-camera] img"),
  );
  const tasks: Promise<unknown>[] = [
    waitForVideo(video),
    document.fonts.ready,
    ...images.map((img) => img.decode().catch(() => undefined)),
  ];

  let done = 0;
  let real = 0;
  tasks.forEach((task) =>
    task.finally(() => {
      done += 1;
      real = done / tasks.length;
    }),
  );

  // Never keep someone staring at a loader on a bad connection.
  const bail = window.setTimeout(() => (real = 1), 9000);

  return new Promise((resolve) => {
    const start = performance.now();
    let shown = 0;

    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const target = Math.min(real, elapsed / minDuration);
      shown += (target - shown) * 0.1;
      if (target === 1 && shown > 0.995) shown = 1;

      const value = Math.round(shown * 100);
      percent.textContent = `${String(value).padStart(3, "0")}%`;
      loader.setAttribute("aria-valuenow", String(value));
      gsap.set(bar, { scaleX: shown });

      if (shown < 1) return;

      gsap.ticker.remove(tick);
      window.clearTimeout(bail);
      markSeen();
      exit();
    };

    const exit = () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      tl.to(meta, { autoAlpha: 0, y: 12, duration: 0.4 })
        .to(bar, { scaleX: 0, transformOrigin: "right", duration: 0.5 }, "<")
        .add(() => {
          // Release the video from the loader and let Flip carry it into the hero.
          const state = media ? Flip.getState(media) : null;
          root.classList.remove("is-loading");
          if (media && state) {
            Flip.from(state, { duration: 1.1, ease: "power3.inOut", scale: false });
          }
          resolve();
        })
        .fromTo(
          loader,
          { clipPath: "inset(0% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "power4.inOut" },
          "<",
        )
        .set(loader, { display: "none" });
    };

    gsap.ticker.add(tick);
  });
}

/* -------------------------------------------------------------------------- */
/* Hero intro                                                                  */
/* -------------------------------------------------------------------------- */

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.from("[data-hero-line]", { yPercent: 110, duration: 1.2, stagger: 0.12 }).from(
    "[data-hero-intro]",
    { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.1 },
    "-=0.8",
  );
}

/* -------------------------------------------------------------------------- */
/* Generic reveals                                                             */
/* -------------------------------------------------------------------------- */

function setupReveals() {
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
    gsap.fromTo(
      group.children,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: group, start: "top 85%", once: true },
      },
    );
  });
}

/* -------------------------------------------------------------------------- */
/* Floating circles + pointer parallax                                         */
/* -------------------------------------------------------------------------- */

function setupFloaters() {
  const floaters = gsap.utils.toArray<HTMLElement>("[data-float]");

  floaters.forEach((el, i) => {
    gsap.to(el, {
      y: i % 2 ? 18 : -18,
      x: i % 3 ? 10 : -6,
      duration: 4 + (i % 3),
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  });

  if (!window.matchMedia("(pointer: fine)").matches) return;

  const movers = floaters.map((el) => ({
    depth: Number(el.dataset.depth ?? 1),
    x: gsap.quickTo(el, "xPercent", { duration: 1.2, ease: "power3.out" }),
    y: gsap.quickTo(el, "yPercent", { duration: 1.2, ease: "power3.out" }),
  }));

  window.addEventListener("pointermove", (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    movers.forEach((m) => {
      m.x(nx * 12 * m.depth);
      m.y(ny * 12 * m.depth);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* About — instant camera printing polaroids                                   */
/* -------------------------------------------------------------------------- */

type Landing = { xPercent: number; yPercent: number; rotation: number };

// Where each polaroid lands once printed (relative to its own size).
// Desktop: a pile beside the camera. Mobile: a fan underneath it.
const PILE_SIDE: Landing[] = [
  { xPercent: 138, yPercent: -150, rotation: -7 },
  { xPercent: 162, yPercent: -100, rotation: 5 },
  { xPercent: 128, yPercent: -52, rotation: -3 },
  { xPercent: 150, yPercent: -118, rotation: 8 },
];
const PILE_BELOW: Landing[] = [
  { xPercent: -36, yPercent: 40, rotation: -7 },
  { xPercent: 34, yPercent: 46, rotation: 6 },
  { xPercent: -16, yPercent: 78, rotation: -3 },
  { xPercent: 18, yPercent: 70, rotation: 4 },
];

function printPhoto(
  tl: gsap.core.Timeline,
  camera: HTMLElement,
  photo: HTMLElement,
  landing: Landing,
) {
  const img = photo.querySelector("[data-polaroid-photo]");

  tl.to(camera, { x: 2, duration: 0.05, repeat: 5, yoyo: true, ease: "none" })
    .set(camera, { x: 0 })
    // Push the print out of the slot: translate and clip in lockstep so the
    // part still "inside" the camera stays hidden.
    .fromTo(
      photo,
      { yPercent: -100, clipPath: "inset(100% 0% 0% 0%)" },
      { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power1.inOut" },
      "<",
    )
    .fromTo(
      img,
      { filter: "brightness(1.7) contrast(0.6) blur(2px)" },
      { filter: "brightness(1) contrast(1) blur(0px)", duration: 1.6, ease: "power1.in" },
      "<0.4",
    )
    .set(photo, { clipPath: "none" })
    .to(photo, { ...landing, duration: 0.9, ease: "back.out(1.4)" }, "-=0.6");
}

function setupCamera(mm: gsap.MatchMedia) {
  const section = document.querySelector<HTMLElement>("[data-about]");
  const camera = document.querySelector<HTMLElement>("[data-camera-body]");
  const photos = gsap.utils.toArray<HTMLElement>("[data-polaroid]");
  const copy = gsap.utils.toArray<HTMLElement>("[data-about-copy]");
  if (!section || !camera || !photos.length) return;

  gsap.set(photos, { yPercent: -100, clipPath: "inset(100% 0% 0% 0%)" });

  // Desktop: pin the section and print one photo per paragraph while scrolling.
  mm.add("(min-width: 1024px)", () => {
    gsap.set(copy, { opacity: 0.18 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * 2.4}`,
        pin: true,
        scrub: 0.8,
      },
    });

    photos.forEach((photo, i) => {
      tl.to(copy[i] ?? [], { opacity: 1, duration: 0.6 }, i === 0 ? 0 : ">-0.4");
      printPhoto(tl, camera, photo, PILE_SIDE[i % PILE_SIDE.length]);
    });
    tl.to({}, { duration: 0.6 });
  });

  // Mobile / tablet: no pin, play the prints once the camera is in view.
  mm.add("(max-width: 1023px)", () => {
    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: { trigger: camera, start: "top 70%", once: true },
    });
    photos.forEach((photo, i) => printPhoto(tl, camera, photo, PILE_BELOW[i % PILE_BELOW.length]));
    tl.timeScale(1.6);
    gsap.fromTo(
      copy,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: copy[0], start: "top 85%", once: true },
      },
    );
  });
}

/* -------------------------------------------------------------------------- */
/* Work — cursor-following preview                                             */
/* -------------------------------------------------------------------------- */

function setupWorkPreview() {
  const preview = document.querySelector<HTMLElement>("[data-work-preview]");
  const img = preview?.querySelector<HTMLImageElement>("[data-work-preview-img]");
  const stroke = preview?.querySelector<SVGElement>("[data-work-preview-stroke]");
  if (!preview || !img || !stroke) return;
  if (!window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return;

  const x = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3.out" });
  const y = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3.out" });
  gsap.set(stroke, { strokeDasharray: 1, strokeDashoffset: 1 });

  window.addEventListener("pointermove", (e) => {
    x(e.clientX + 40);
    y(e.clientY);
  });

  document.querySelectorAll<HTMLElement>("[data-work-row]").forEach((row) => {
    row.addEventListener("pointerenter", () => {
      if (img.getAttribute("src") !== row.dataset.preview) img.src = row.dataset.preview ?? "";
      gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(stroke, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" });
    });
    row.addEventListener("pointerleave", () => {
      gsap.to(preview, { autoAlpha: 0, scale: 0.94, duration: 0.3, ease: "power2.in" });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* Hobbies — the controller drops in and floats                                */
/* -------------------------------------------------------------------------- */

function setupJoystick() {
  const wrap = document.querySelector<HTMLElement>("[data-joystick-float]");
  if (!wrap) return;

  gsap
    .timeline({ scrollTrigger: { trigger: wrap, start: "top 80%", once: true } })
    .from(wrap, { y: -80, rotation: -8, autoAlpha: 0, duration: 1.1, ease: "bounce.out" })
    .to(wrap, { y: -14, rotation: 1.5, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
}

/* -------------------------------------------------------------------------- */
/* The pack — portraits sketch in, Kira's ball bounces over to Nala          */
/* -------------------------------------------------------------------------- */

function setupDogs() {
  gsap.utils.toArray<HTMLElement>("[data-sketch-reveal]").forEach((img) => {
    gsap.fromTo(
      img,
      { "--reveal": "0%" },
      {
        "--reveal": "130%",
        ease: "none",
        scrollTrigger: { trigger: img, start: "top 85%", end: "center 45%", scrub: 0.8 },
      },
    );
  });

  // Placeholder outlines (dogs without a portrait yet) draw themselves in.
  gsap.utils.toArray<SVGPathElement>("[data-draw]").forEach((path, i) => {
    gsap.fromTo(
      path,
      { strokeDasharray: "1 2", strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: path.closest("article") ?? path,
          start: "top 85%",
          end: i % 2 ? "top 25%" : "top 35%",
          scrub: 0.6,
        },
      },
    );
  });

  document.querySelectorAll<HTMLElement>("[data-ball-stage]").forEach(setupBallBounce);
}

/**
 * Kira's ball drops in from her side, bounces across the page losing height on
 * every hop, and rolls to a stop next to Nala. Each hop is a real parabola with
 * constant horizontal speed, so the dotted trail and the ball share one curve.
 */
type BallSegment = { to: number; height: number; duration: number; kind: "fall" | "hop" | "roll" };

const BALL_SEGMENTS: BallSegment[] = [
  { to: 0.34, height: 1, duration: 0.55, kind: "fall" },
  { to: 0.62, height: 0.58, duration: 0.62, kind: "hop" },
  { to: 0.81, height: 0.28, duration: 0.45, kind: "hop" },
  { to: 0.92, height: 0.1, duration: 0.28, kind: "hop" },
  { to: 1, height: 0, duration: 0.6, kind: "roll" },
];

function setupBallBounce(stage: HTMLElement) {
  const ball = stage.querySelector<HTMLElement>("[data-ball]");
  const spin = stage.querySelector<HTMLElement>("[data-ball-spin]");
  const shadow = stage.querySelector<HTMLElement>("[data-ball-shadow]");
  const trail = stage.querySelector<SVGPathElement>("[data-ball-trail]");
  if (!ball || !spin || !shadow || !trail) return;

  let width = 0;
  let height = 0;
  let size = 0;

  // Position along the path: f = horizontal fraction (0..1), lift = 0 on the floor, 1 at the start height.
  const pointAt = (index: number, u: number) => {
    const seg = BALL_SEGMENTS[index];
    const from = index === 0 ? 0 : BALL_SEGMENTS[index - 1].to;
    const progress = seg.kind === "roll" ? 1 - (1 - u) ** 2 : u;
    const f = from + (seg.to - from) * progress;
    const lift =
      seg.kind === "fall" ? seg.height * (1 - u * u) : seg.kind === "hop" ? 4 * seg.height * u * (1 - u) : 0;
    return { f, lift };
  };

  const render = (f: number, lift: number) => {
    const x = f * (width - size);
    const y = -lift * height;
    gsap.set(ball, { x, y });
    gsap.set(spin, { rotation: (x / (Math.PI * size)) * 360 });
    gsap.set(shadow, { x, scaleX: 1 - lift * 0.55, opacity: 1 - lift * 0.75 });
    // Reveal the trail only up to the ball.
    trail.style.clipPath = `inset(-100% ${Math.max(0, width - x - size / 2)}px -100% -100%)`;
  };

  const measure = () => {
    width = stage.clientWidth;
    height = stage.clientHeight;
    size = ball.offsetWidth;

    const points: string[] = [];
    BALL_SEGMENTS.forEach((_, i) => {
      for (let step = 0; step <= 24; step++) {
        const { f, lift } = pointAt(i, step / 24);
        const px = f * (width - size) + size / 2;
        const py = height - lift * height - size / 2;
        points.push(`${points.length ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`);
      }
    });
    trail.setAttribute("d", points.join(" "));
  };

  const build = () => {
    measure();
    const proxy = { u: 0 };
    const tl = gsap.timeline({ paused: true });
    let time = 0;

    BALL_SEGMENTS.forEach((seg, i) => {
      tl.fromTo(
        proxy,
        { u: 0 },
        {
          u: 1,
          duration: seg.duration,
          ease: "none",
          immediateRender: false,
          onUpdate: () => {
            const { f, lift } = pointAt(i, proxy.u);
            render(f, lift);
          },
        },
        time,
      );
      time += seg.duration;

      // Squash on every landing, overlapping the next hop.
      if (seg.kind !== "roll") {
        const strength = Math.max(0.06, 0.22 * seg.height);
        tl.to(
          ball,
          {
            scaleY: 1 - strength,
            scaleX: 1 + strength * 0.8,
            transformOrigin: "50% 100%",
            duration: 0.07,
            yoyo: true,
            repeat: 1,
            ease: "power1.out",
          },
          time - 0.03,
        );
      }
    });

    render(0, 1);
    return tl;
  };

  let tl = build();

  ScrollTrigger.create({
    trigger: stage,
    start: "top 70%",
    onEnter: () => tl.restart(),
    onLeaveBack: () => {
      tl.pause(0);
      render(0, 1);
    },
  });

  ScrollTrigger.addEventListener("refreshInit", () => {
    const wasDone = tl.progress() === 1;
    tl.kill();
    tl = build();
    if (wasDone) tl.progress(1);
  });
}

/* -------------------------------------------------------------------------- */
/* Boot                                                                        */
/* -------------------------------------------------------------------------- */

function boot() {
  document.querySelector("[data-back-to-top]")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  if (reduceMotion) {
    // Show everything in its final state, no motion.
    root.classList.remove("is-loading", "js");
    const pile = window.innerWidth >= 1024 ? PILE_SIDE : PILE_BELOW;
    gsap.utils.toArray<HTMLElement>("[data-polaroid]").forEach((photo, i) => {
      gsap.set(photo, pile[i % pile.length]);
    });
    return;
  }

  const mm = gsap.matchMedia();
  setupReveals();
  setupFloaters();
  setupCamera(mm);
  setupWorkPreview();
  setupJoystick();
  setupDogs();

  runLoader().then(() => {
    heroIntro();
    ScrollTrigger.refresh();
  });
}

boot();
