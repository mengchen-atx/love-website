# Findings

- Login route file: `app/login/page.tsx`.
- Project uses Next.js App Router layout under `app/`.
- Need to verify whether `framer-motion` and `lucide-react` are already installed before coding.
- `lucide-react` already existed; installed `framer-motion` successfully.
- Implemented split-screen responsive layout: desktop 2 columns, mobile stacked.
- Added `loginStatus` state (`idle | typing | error`) and wired it to login validation + animation reactions.
- Mouse tracking is normalized to SVG coordinate space (0-100), with pupil movement clamped by trig math.
