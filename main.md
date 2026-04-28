# Remotion Video Replication Spec

A specification for rebuilding the vertical "sticker-book" explainer video in Remotion. The video uses a constant mascot (koala) at the bottom with rapidly swapping props above it, synced word-by-word with narration on a pure white canvas.

---

## 1. Video Specs

| Property | Value |
| --- | --- |
| Duration | 40 – 70 seconds |
| Resolution | 576 × 1024 px |
| Aspect ratio | 9:16 (vertical) |
| Frame rate | 30 fps |
| Background | Pure white (`#FFFFFF`) — no gradients, no texture |
| Total frames | 1,200 – 2,100 |
| Output | `.mp4` (H.264) |

---

## 2. Canvas Layout

The 576 × 1024 canvas is split into **three** horizontal zones. The renderer only draws into the middle and bottom zones — the **top zone is reserved as a safe area for subtitles that get added later in post-production** (CapCut, Descript, etc.). The Remotion composition itself does not render captions.

```
┌─────────────────────────────┐  0 px
│                             │
│   SUBTITLE SAFE (~16%)      │  ≈ 160 px tall
│   ── leave EMPTY ──         │  added later in post
│   (fits ~2 lines @ 32–40px) │
│                             │
├─────────────────────────────┤  ≈ 160 px
│                             │
│   MIDDLE ZONE (~29%)        │  ≈ 300 px tall
│   Illustration / prop zone  │
│   (stock photos, emoji,     │
│    typography, signboards)  │
│                             │
├─────────────────────────────┤  ≈ 460 px
│                             │
│                             │
│                             │
│   BOTTOM ZONE (~55%)        │  ≈ 564 px tall
│   Mascot (koala)            │
│   — constant character,     │
│     poppy pose swaps        │
│                             │
│                             │
│                             │
└─────────────────────────────┘  1024 px
```

**Hard rules:**
- **Top 160 px is empty.** Nothing renders into it — no graphics, no shapes, no mascot, no props. The user adds subtitles to that band manually after the MP4 is exported. 160 px comfortably fits 2 lines of subtitle at ~32–40 px font + padding.
- The mascot never leaves the bottom zone, and props never enter the bottom zone or the subtitle safe area.
- **Horizontal safety:** props must fit within ~512 px (canvas width 576 minus 32 px side padding). Cap big-text fontSize so long words don't run off-frame — at font-weight 900, char width ≈ 0.6 × fontSize, so a 9-character word ("EXPLAINED", "TIMELAPSE") needs fontSize ≤ ~95. Prefer breaking long phrases into two lines over shrinking the font.
- The Remotion composition itself does **NOT render captions / subtitles / on-screen narration text**. If a word matters in-engine, the prop or the mascot pose communicates it visually. Stat callouts ("5–6 HRS", "LOCKED") are typography props, NOT captions — they live in the middle zone and follow prop rules (Section 5). Subtitles are added on a separate post-production track in the empty top zone.

---

## 3. Visual Style

- Pure white background throughout the full duration — this is critical for the clean sticker-book aesthetic. No color washes, no vignettes.
- Flat illustration style: bold outlines, solid fills, minimal shading.
- All assets pre-rendered as transparent PNGs (or SVGs) and dropped onto the canvas. No in-engine drawing.
- Slight drop shadow (optional, soft, <5% opacity) under mascot to anchor it — otherwise everything sits flat on white.

---

## 4. Mascot Behavior (Bottom Zone)

The mascot is a constant presence — it never leaves the frame. **It is also the primary visual rhythm of the video — its pose changes drive the beat, not the props.**

- Character: koala (or substitutable mascot — see `/assets/mascot/` folder structure below).
- **Motion rule: no animated motion.** The mascot changes via image swaps only — one static pose replaced by another static pose.
- **Swap frequency: HIGH.** Pose changes happen at minimum once per sentence, and frequently *within* a sentence on tonal or emotional beats — realization, frustration, pride, sleep, punchline. Aim for **~12–30 mascot pose swaps across the full video** (one every ~2–5 seconds on average).
- A new pose should land on a meaningful word, not on a filler word. Hooks, verbs, and reaction beats are the natural anchors ("**fails.**", "**decides.**", "**locked.**", "**sleeps.**").
- Pose library examples (drawn from `asset-map.md`):
  - `koala_explains` (teacher / pointer)
  - `koala_thinking` (arms-crossed, contemplating)
  - `koala_action` (one paw up, "aha!")
  - `koala_confused` (shrug)
  - `koala_scrolls` (head down, on phone)
  - `koala_scrolls_laughs` (laughing at phone)
  - `koala_happy` (arms raised, celebration)
  - `koala_sleeps` (curled up asleep)
- Transition between poses: instant cut for punch beats, OR a 3–5 frame cross-fade for smoother emotional shifts. Both are encouraged — variety in the cuts keeps the rhythm from feeling robotic. No slides.
- **Poppy entry on every pose swap.** When a new pose lands, scale it from `0.6 → 1.12 → 1.0` over ~6 frames (overshoot pop) anchored at `transform-origin: bottom center` so the koala looks like it's standing up into the frame. Pair with a 2-frame opacity fade-in to soften the cut. This is the *signature motion* of the video — the koala feels alive even though every individual pose is a still image.
- A **subtle continuous breathing oscillation** (~±1.5% scale, ~0.7 Hz) keeps the held pose from feeling frozen. Don't make it bigger than that — anything more reads as wobbly.

---

## 5. Prop Behavior (Middle Zone)

Props support the narration — they do **not** keep pace with every word.

- **Swap frequency: LOW.** Props change per **phrase, clause, or concept** — NOT per word. One prop holds steady through multiple words of caption text. Typical cadence: a new prop every **2–5 spoken words** (one per clause / beat) or every full sentence.
- Across a 30–60s video, this lands at **~15–40 prop swaps total** — far fewer than the captions update.
- The captions in the top zone update per-word independently of the prop. Don't re-pop the prop on every caption change.
- Each prop is one of:
  1. **Stock image** (preferred when the concept has a clear real-world referent — see Section 8). Examples: a phone screen, a desk, a laptop, a person scrolling.
  2. **Project asset** from `./assets/` (any reusable mascot accessory, signboard, or product mock).
  3. **Emoji** (used sparingly, only for abstract / iconic beats where a photo would feel literal or awkward — `❌`, `🔒`, `💤`, `🎉`, `💡`, `🚫`).
  4. **Big bold typography** (a stat, a stamp, a wordmark — e.g. "5–6 HRS", "LOCKED", "DAY 1").
- Prop entry: instant appear OR a 3–5 frame pop-in scale from 0.8 → 1.0. Nothing slower.
- Only one prop on screen at a time unless the script calls for a combo (e.g., object + `❌` overlay).
- Don't escalate motion on the prop to compensate for a static one — motion variety should come from the *mascot* swapping (Section 4), not from the prop pulsing.

---

## 6. Narration Sync

Narration drives the entire timing. Everything slaves to the audio track.

1. Record or generate the full narration first (single audio file).
2. Transcribe it with word-level timestamps (Whisper `verbose_json` with `word_timestamps: true` works well). The captions JSON is the **timing source of truth** even though we don't render captions on screen — we use the word-level timestamps to anchor prop-phase boundaries and mascot pose-swap moments.
3. Build a **timeline JSON** with two arrays:
   - `poses` — one entry per mascot pose, anchored to a starting timestamp from the captions (~12–30 entries, see §4).
   - `props` — one entry per **prop phase** (per phrase or concept, NOT per word), anchored to a starting word from the captions (~15–40 entries, see §5).
4. **No `captions` array** in the timeline — there are no on-screen subtitles (see §2). Word-level timestamps from the source captions JSON are used purely as anchors; they don't get rendered.

### Example `timeline.json` fragment

```json
{
  "duration": 52.4,
  "audio": "/assets/audio/narration.mp3",
  "poses": [
    { "from": 0.0,  "asset": "koala_action.png"     },
    { "from": 8.2,  "asset": "koala_thinking.png"   },
    { "from": 11.5, "asset": "koala_confused.png"   },
    { "from": 19.0, "asset": "koala_explains.png"   },
    { "from": 27.9, "asset": "koala_happy.png"      },
    { "from": 30.0, "asset": "koala_sleeps.png"     }
  ],
  "props": [
    { "from": 0.0,  "to": 4.17, "kind": "big-text", "value": "HOW TO STOP" },
    { "from": 4.17, "to": 7.61, "kind": "emoji",    "value": "📱"          },
    { "from": 7.61, "to": 9.81, "kind": "stat",     "value": "5–6 HRS"     }
  ]
}
```

---

## 7. Remotion Project Structure

```
remotion-koala-video/
├── package.json
├── remotion.config.ts
├── src/
│   ├── Root.tsx                 // registers the composition
│   ├── MainVideo.tsx            // the composition itself
│   ├── components/
│   │   ├── PropZone.tsx         // middle 45% zone
│   │   └── Mascot.tsx           // bottom 55% zone (poppy pose swaps)
│   └── data/
│       └── timeline.json
└── public/
    └── assets/
        ├── audio/
        │   └── narration.mp3
        ├── mascot/
        │   ├── pose-pointing-right.png
        │   ├── pose-arms-crossed.png
        │   └── …
        └── props/
            ├── sign-no-entry.png
            ├── icon-x.png
            └── …
```

---

## 8. Stock Images (MCP)

The middle zone (props) can pull from the **content-machine
stock-images MCP server** instead of relying on emoji. Use this
whenever the concept has a clear real-world referent — a phone
screen, a desk, a laptop, a coffee cup, a person scrolling, a study
setup, a pile of notifications. Reserve emoji for abstract / iconic
beats (`❌`, `🔒`, `💤`, `🎉`) where a literal photo would feel
awkward.

```yaml
allowed:        yes
sources:        [unsplash, pexels, pixabay]
fallback:       ask          # if MCP returns nothing good, ask the user
                             # before falling back to emoji or typography
prefer_over:    emoji        # default to a stock image whenever a
                             # concrete-noun visual exists
```

### How scene agents use the MCP

1. Call `mcp__plugin_content-machine_content-machine-stock-images__search_stock_images`
   with a short, concrete query (2–5 words) and the enabled sources.
   Examples: `"empty classroom desks dusk"`,
   `"phone notifications stacking"`, `"coffee laptop morning desk"`,
   `"timelapse work overhead"`.
2. Pick the single best result.
3. Download the image into `public/stock/<short-unique-name>.jpg`
   (use `curl` or `wget`).
4. Reference via `<Img src={staticFile('stock/<name>.jpg')} />`,
   sized to the middle zone with `object-cover` (cropped) or
   `object-contain` (whole image visible — use this when the photo
   has key edges or text).
5. Credit the source at the top of the scene file:
   ```tsx
   // Stock: <source> by <author> — <page_url>
   ```
6. If the MCP returns only `mode: "web-search"` (API key not
   configured), do NOT guess a URL — apply the **fallback** policy
   above.

### When stock images are the right call (and when they're not)

| Beat                             | Use what                         |
|----------------------------------|----------------------------------|
| "Phone scrolling, hours wasted"  | Stock photo (close-up of phone)  |
| "Laptop, work setup"             | Stock photo                      |
| "Coffee, morning routine"        | Stock photo                      |
| "Locked"                         | `🔒` emoji or typography         |
| "Big red ❌ on the screen"       | Emoji + overlay                  |
| "Stat: 5–6 HRS"                  | Big bold typography              |
| "Wordmark / CTA"                 | Project asset or typography      |
| "Sleeping / dreaming"            | `💤` emoji                       |

Rule of thumb: if you'd describe the prop to a designer with a
**noun** ("a phone", "a desk"), reach for a stock image. If you'd
describe it with a **symbol** ("an X", "a lock", "Zzz"), reach for
an emoji.

---

## 9. Script Narrative Arc (input contract)

Every narration that drives this video follows the 5-beat arc
defined in `persona.md` and `app.md`:

1. **Hook (~3s)** — a question + *"explained by koalas."* Stat
   ("60 days a year"), conspiratorial ("hey… pssst…"), or
   contrarian ("why does willpower never work?").
2. **Toxic cycle / shared problem** — koala's own scrolling story
   ("scroll. sleep. repeat.") or the viewer's, in 1–3 sentences.
3. **Reframe (the pivot)** — your brain isn't addicted to your
   phone, it's addicted to dopamine. Willpower can't beat
   chemistry. The em-dash usually lives here.
4. **The fix** — build one off-screen habit (running, reading,
   meditation, fishing). Film yourself doing it. Timelapse it.
   Closes on a quotable two-sentence line ("same loop. better
   source.").
5. **CTA (lockin club enters — never before this beat)** — the
   fixed line: *"koala doesn't gatekeep, koala use lockin club
   to track his productivity using timelapses."* Optionally
   preceded by a one-line "koala happy" payoff.

**Visual implications for this Remotion spec:**

- The lockin club wordmark, lock icon, app screenshot, or any
  product asset **must not render before beat 5.** Beats 1–4 are
  about the cycle, the dopamine reframe, and the fix — the
  product is not the topic.
- The hook (beat 1) gets the loudest typography of the video. It
  is the natural place for a single big-text prop ("60 DAYS",
  "4 HRS/DAY", "PSSST…") to fill the middle zone.
- Mascot pose swaps (§4) cluster at the emotional pivots: the
  hook (beat 1), the reframe (beat 3 — `koala_action` "aha"),
  the fix (beat 4 — `koala_happy` while filming/working), and
  the optional payoff line (`koala_happy` again before CTA).
- Beat 4 is the natural place for a fast prop cadence — one prop
  per concrete habit (running shoes, book, meditation cushion,
  fishing rod) — followed by a phone/timelapse-frame prop on
  "film yourself doing it. timelapse it."
- Stacked-period cadences ("cheap. fast. infinite." /
  "scroll. sleep. repeat.") are the natural place for rapid
  three-beat prop swaps timed to each period.

See `persona.md` for full voice + arc guidance and `app.md` for
the fixed CTA framing (lockin club as a *timelapse productivity
tracker* in-script, never as a phone-locker).

---

## 10. End card (brand outro — every video)

Every video ends with a **fixed brand end card** that is independent of the script and the §2 three-zone layout.

- **Asset:** `assets/image.png` — the Lockin Club App Store listing screenshot (see `asset-map.md`). Reserved for this purpose; never used mid-video as a regular prop.
- **Duration:** **30 frames (1.0 s @ 30 fps)**, appended after the final scripted scene.
- **Layout:** **fills the entire 576 × 1024 canvas** — overrides §2's three-zone rule for these frames only. No mascot, no props, no subtitle safe area; the end card *is* the whole frame.
- **Rendering:** `<Img src={staticFile('assets/image.png')} />` sized to cover the canvas. Use `object-cover` if it crops cleanly; switch to `object-contain` over a white background (`#FFFFFF`) if cropping would clip the app title or rating row.
- **Audio:** silent by default. The narration mp3 should already be over by the time the end card lands; if it bleeds under, that's fine — do not add an outro sting.
- **Motion:** instant cut in, hold, instant cut out. No fade, no pop, no breathing oscillation. This is a logo lockup, not a beat.

**Composition implications (Root.tsx):**
- Total composition duration = `Math.ceil(narration_duration * fps) + 30`.
- Append a final `<Series.Sequence durationInFrames={30}><EndCard /></Series.Sequence>` after the last scripted scene.
- The end card is **NOT a "scene"** in the planning sense — it has no captions window, no `beatType`, no scene-agent dispatch. The orchestrator wires it directly as a small `EndCard.tsx` component (or inline) and copies `assets/image.png` into `public/assets/image.png` during scaffolding.

## 11. Quality Checklist

- [ ] Background is pure `#FFFFFF` on every frame
- [ ] Mascot is visible in every frame and never leaves the bottom 55%
- [ ] **Top ~160 px (subtitle safe area) is EMPTY** — no graphics render there; reserved for post-production subtitles (fits ~2 lines @ 32–40 px)
- [ ] The Remotion composition itself does NOT render subtitles / captions / on-screen narration text
- [ ] Props never overlap into the mascot zone or into the subtitle safe area
- [ ] Big-text props fit within 512 px width — long words (8+ chars) cap at fontSize ~95 to avoid horizontal overflow
- [ ] Prop swaps align with **phrases or concepts** (every ~2–5 words / per clause), NOT per word
- [ ] Mascot pose swaps drive the rhythm — **~12–30 swaps across the video**, often *within* sentences on emotional beats
- [ ] Mascot uses the **poppy entry pop** (0.6 → 1.12 → 1.0 over ~6 frames, anchored bottom-center) on every pose swap
- [ ] Mascot has the subtle continuous breathing oscillation (≤ 1.5%) while a pose holds
- [ ] Stock images (when used) live under `public/stock/` and credit the source at the top of the scene file
- [ ] Emoji is reserved for abstract / iconic beats; concrete nouns use stock images instead
- [ ] No slow animations — prop transitions ≤ 5 frames; mascot pop ≤ 6 frames
- [ ] Audio is tight — no leading silence, no trailing dead air
- [ ] Total duration falls between 40 and 70 seconds (script body — the 1 s end card is appended on top)
- [ ] Final export is 576 × 1024 @ 30 fps
- [ ] Last 30 frames (1 s) are the Lockin Club end card — `assets/image.png` full-canvas, no zones, no mascot, no props (see §10)
- [ ] Total composition duration = `ceil(narration_duration * fps) + 30`