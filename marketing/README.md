# Ultimate Joystick marketing kit (zero-spend, nothing is live)

Same approach as the Contractors Classroom kit: everything is prepared as text so the owner can paste it when the
site is live. Nothing here publishes anything.

| File | What it is |
|---|---|
| `youtube/videos.md` | channel description plus a title, description, chapters/tags block for each of the 10 existing videos (they are already on the site in `videos/ultimate-joystick/`, ready to upload as-is) |
| `community/launch-plan.md` | where arcade builders actually gather, the posting rules that keep you welcome there, a 4-week launch sequence, and a short answer bank for the questions people will ask |
| `email/launch-sequence.md` | three short e-mails for people who contact support@ or buy |

Rules that apply to every file:

* **Claims must match the product.** 2,860+ pre-mapped parent games (from `servo_config.json`), 5 gate shapes plus
  the octagonal substitute, 1-Player $100 / 2-Player $200, Arduino Mega 2560, works with any frontend because it
  watches the MAME process. Do not quote the "65+ Vertical games" figure anywhere until the owner resolves it
  (see `deploy/hostinger/README.md`, section 7).
* **No "compatible with" trademarks in titles.** Mention MAME, Sanwa, LaunchBox, HyperSpin, RetroPie etc. only as
  descriptive facts in body text.
* **Disclose that you are the maker** in every forum post. Hobbyist boards ban undisclosed promotion fast and
  permanently.
* **Never promise a ship date or stock you do not have.** Say "built to order" if that is the truth.
* **Videos show the software; the recordings do not show the physical gate moving** (that was a deliberate choice
  in the shot list). The first thing every arcade forum will ask for is a 20-second phone video of the gate
  physically changing while a game loads. Record that before posting anywhere.

Order of operations: site live and verified (deploy README steps 1-6) -> Stripe live or buttons blanked -> record the
physical-movement clip -> YouTube uploads -> forum posts, one community per week.
