# Asset Map

List every image in `./assets/`. One row per file. Keep descriptions short
and concrete — these are the notes the script writer reads to know what
visuals exist.

## Visual prop policy (read this before picking)

The video has three zones (see `main.md §2`). The assets in this file
serve specific zones:

- **Bottom zone (mascot)** — the `koala_*.png` poses below are the
  mascot library. Per `main.md §4`, the mascot is the **primary
  visual rhythm** of the video and its pose should swap **frequently
  (~12–30 times across a 30–60s video)**, often *within* sentences
  on emotional beats. Pull from this list aggressively.
- **Middle zone (props)** — see `main.md §5` for the new low-frequency
  swap rule (per phrase / clause, NOT per word). For props, follow
  this preference order:
  1. **Stock images** via the MCP (see `main.md §8`) — preferred
     whenever the concept is a concrete noun (phone, desk, laptop,
     coffee, hands scrolling).
  2. **Project assets** below that fit the prop role (e.g.
     `phone_screen.png` is a clean mockup made for the middle zone).
  3. **Emoji** — only for abstract / iconic beats (`❌`, `🔒`,
     `💤`, `🎉`, `💡`).
  4. **Big bold typography** — for stats, stamps, wordmarks
     ("5–6 HRS", "LOCKED", "DAY 1").

If you find yourself picking emoji for a concrete noun, stop and try
the stock-image MCP first.

## Mascot library (bottom zone — swap often)

| Filename | What's in the image |
|----------|---------------------|
| `Koala_happy-Photoroom.png` | Kaola standing on hind legs with both arms raised high, paws open in a celebratory "yay!" pose. Red bow on head. |
| `kkoala_scrolls-Photoroom.png` | Kaola holding a smartphone with both paws, staring at the screen scrolling. Neutral focused expression, red bow. |
| `koala_action-Photoroom.png` | Kaola standing upright with one paw raised and a single finger pointing up — making a sharp "aha!" or "point #1" gesture. Red bow. |
| `koala_confused-Photoroom.png` | Kaola with both arms out to the sides, palms up in a shrug — confused / "I don't get it" gesture. Red bow. |
| `koala_explains-Photoroom.png` | Kaola in teacher mode, holding a thin pointer stick like he's about to explain something on a board. Red bow tie at neck. |
| `koala_scrolls_laughs-Photoroom.png` | Kaola holding a phone with both paws, mouth wide open laughing/cackling at whatever's on screen. Red bow. |
| `koala_sleeps-Photoroom.png` | Kaola curled up asleep on a tree branch, eyes closed, peaceful. Red bow on head. |
| `koala_thinking-Photoroom.png` | Kaola standing upright with arms crossed over chest, calm thoughtful expression — "let me think about this" pose. Red bow. |

## Middle-zone props & footage

| Filename | What's in the image |
|----------|---------------------|
| `phone_screen (1).png` | Two koala paws holding up a smartphone with a blank white screen — mockup/cutout ready for compositing app footage onto the screen. |
| `timelapse_koala.mov` | Video file (not an image — short timelapse clip of Kaola). |

<!-- Drop new image files into ./assets/ and add a row above. -->
<!-- For stock-image props, do NOT add them here — they live in
     `public/stock/` of the per-video Remotion project, fetched
     fresh per scene via the stock-images MCP. -->
