# Community launch plan (arcade builders), zero spend

Where the buyers are. Arcade cabinet builders are a small, loyal, forum-centric crowd. They distrust ads and reward
makers who show up, answer questions and post real footage. One honest thread in the right place is worth more than
any paid campaign at this stage.

## Before the first post (blockers)

1. Site live on https://ultimatejoystick.com with working order buttons (live Stripe) or a clear "order by e-mail" path.
2. **A 20-30 second phone video of the gate physically changing** when a game is selected (e.g. Pac-Man -> Street
   Fighter II). The existing videos only show the software; every forum will ask for this within an hour.
3. Decide the Vertical-gate claim (see deploy README section 7) so no post repeats a number you may have to retract.
4. Answer bank below memorised.

## Where to post (one per week, in this order)

| Week | Community | How to be welcome there |
|---|---|---|
| 1 | **Arcade Controls forum (BYOAC, forum.arcadecontrols.com)** - "Main Forum" and "Software" boards | The home of DIY cabinets. Read 2-3 restrictor threads first, post in **Project Announcements** with the physical-movement clip, your build story, and the price up front. Disclose you make it. Expect "why not a servo mod with an Arduino sketch" - have the answer ready. |
| 2 | **Reddit: r/cade, r/MAME, r/arcade** (check each sub's self-promotion rule; r/cade allows maker posts if you engage) | Title as a build/demo, not an ad: "I built a joystick that swaps its own restrictor gate when MAME launches a game". Reply to every comment for 48 hours. |
| 3 | **LaunchBox, HyperSpin, RetroBat, Attract-Mode forums / Discords** | Frontend users feel the 4-way/8-way pain most. Post in the hardware or showcase channel; emphasise "works with any frontend, no plugin needed - it watches the MAME process". |
| 4 | **KLOV / VAPS forums, Facebook groups "Arcade Cabinet Builders", "MAME Cabinet Builders"** | Older, collector-heavy. Lead with the Pac-Man/Donkey Kong 4-way problem and the fact that the stick returns to the circle (least restrictive) gate when nothing is running. |
| ongoing | **YouTube comments on popular "4-way vs 8-way" and "restrictor gate" videos** | Helpful one-paragraph answers that mention the site only when someone asks for an automatic solution. |

Later, if the first wave converts: Hackaday.io project page (the Arduino + servo design is exactly their audience),
Thingiverse/Printables listing for the 3D-printed restrictor parts (free files drive traffic to the kit), Tested /
Adafruit show-and-tell submission.

## Posting rules

* Disclose: "I'm the maker" in the first two lines, every time.
* One post per community, then only replies. Never cross-post the same text on the same day.
* Price and shipping stated plainly. People in these forums ask "how much" first; hiding it reads as a sales funnel.
* Show the failure modes honestly: what happens if the hand is on the stick during a change (the software waits and
  shows a splash), what happens on power loss (gate stays where it is; next launch corrects it), how servos are
  replaced (video 10).
* Never argue with "I'd just do it myself with an Arduino". Agree, link the firmware repo if the owner decides to open
  it, and point out that the value is the 2,860-game mapping and the safety logic, not the servo.

## Answer bank

**What problem does it solve?** 4-way games (Pac-Man, Donkey Kong, Frogger) on an 8-way stick register diagonals
the game never expected, so the character hesitates or turns the wrong way. 8-way games on a 4-way stick lose
diagonals. Builders either live with it or swap a plastic gate by hand under the panel. Ultimate Joystick swaps it
for you, before the game appears.

**How does it know which game?** The Windows app watches the MAME process. Any frontend that launches MAME works
(LaunchBox, HyperSpin, Attract-Mode, RetroBat, a batch file). No plugin.

**Which gates?** Plus (4-way), Square (8-way), Horizontal (2-way), Vertical (2-way), Circle (free 360, the default
when nothing is running), and Octagonal as an 8-way alternative. 2,860+ parent games are pre-mapped; any game can
be re-assigned in the app.

**What is in the box?** Assembled joystick, servo restrictor assembly (4 metal-gear micro servos per player), wiring
harness, Arduino Mega 2560, control software download. 1-Player $100, 2-Player $200 (one board drives both).

**Safety?** The app will not move a gate while it sees the joystick being used; it shows a full-screen "hands clear"
splash, retries, then gives up with a visible message rather than fight the player. Servos only hold current where
needed.

**What if a servo dies?** They are standard MG90-class micro servos. Video 10 shows the 5-minute replacement and
re-teach. Replacement sets are on the order page.

**Does it work on a Raspberry Pi / RetroPie?** Today the control app is Windows (it watches MAME on the same PC). Say
so plainly; collect the e-mail of anyone who asks, that is the roadmap signal.
