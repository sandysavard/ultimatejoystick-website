# YouTube: channel text and the 10 video listings

Upload the MP4s from `videos/ultimate-joystick/` (1280x720, captions in the matching `.vtt`; upload the `.vtt` as the
English subtitle track so YouTube does not auto-caption). Thumbnails: the matching `.jpg`. Set every video to
"Not made for kids", category "Science & Technology", language English, license Standard. Put the site link first in
every description; YouTube turns the first line into the visible snippet.

Playlist: **Ultimate Joystick - Setup and How-To** (videos 1-9 in order, then 10).

## Channel

**Name:** Ultimate Joystick
**Handle:** @ultimatejoystick (if taken: @ultimatejoystickgates)
**About:**
Ultimate Joystick is an automated restrictor gate system for arcade joysticks. Pick a game in any frontend and the
right gate shape (4-way, 8-way, 2-way or circle) installs itself before the game starts, so Pac-Man never ghost-moves
and Street Fighter keeps its diagonals. Servo-driven, controlled by a free Windows app that watches MAME, with 2,860+
games already mapped. Setup, calibration and troubleshooting guides live here. https://ultimatejoystick.com
**Links:** Website https://ultimatejoystick.com | Order https://ultimatejoystick.com/order.html | Support support@ultimatejoystick.com

Common tags for every video: `arcade joystick`, `restrictor gate`, `4-way joystick`, `8-way joystick`, `MAME`,
`arcade cabinet`, `servo`, `Arduino Mega`, `arcade build`, `Ultimate Joystick`

---

## 1. Start and Connect (71 s) - `01-start-and-connect.mp4`
**Title:** Ultimate Joystick Setup 1/9: Start the App and Connect the Controller
**Description:**
https://ultimatejoystick.com - Open Ultimate Joystick, find the connection area on the Monitor and Test tab, and connect the servo controller. Covers No Hardware Mode (for preparing the software without the gate attached), Refresh, Connect, and what to check if the status never reads Ready.
Next: Set MAME and ROM Paths.
Full walkthrough and transcripts: https://ultimatejoystick.com/video_demo.html
**Extra tags:** `arduino serial connect`, `arcade software setup`

## 2. Set MAME and ROM Paths (41 s) - `02-set-mame-and-rom-paths.mp4`
**Title:** Ultimate Joystick Setup 2/9: Point the App at MAME and Your ROM Folder
**Description:**
https://ultimatejoystick.com - In Settings, browse to the MAME executable and the folder with your game files, add an XML or custom list if you use one, and Save. The game list fills in and the software is ready for gate assignments. Includes the fix for an empty game list.
**Extra tags:** `MAME setup`, `ROM folder`, `arcade frontend`

## 3. Interactive Servo Calibration (41 s) - `03-interactive-servo-calibration.mp4`
**Title:** Ultimate Joystick Setup 3/9: Calibrate Each Gate Servo Safely
**Description:**
https://ultimatejoystick.com - The Calibration tab, one servo at a time: small adjustments, set the engaged position, set the released position, test both, then Save Calibration. Shows the order that keeps the gate assembly from binding.
**Extra tags:** `servo calibration`, `MG90S`, `restrictor plate`

## 4. Test Joystick and Gates (31 s) - `04-test-joystick-and-gates.mp4`
**Title:** Ultimate Joystick Setup 4/9: Test Joystick Directions and Every Gate Shape
**Description:**
https://ultimatejoystick.com - Confirm up/down/left/right register for each player, then run the gate tests one shape at a time (plus, square, horizontal, vertical, circle) and return to the released position between tests.
**Extra tags:** `joystick test`, `4-way 8-way switch`

## 5. Assign Games to Gates (32 s) - `05-assign-games-to-gates.mp4`
**Title:** Ultimate Joystick Setup 5/9: Assign a Gate Shape to Any Game
**Description:**
https://ultimatejoystick.com - Game Management: search a title, choose its gate shape, save. 2,860+ parent games are already mapped; this is how you add, change or override one. Verify by searching a few finished games.
**Extra tags:** `game assignment`, `Pac-Man 4-way`, `Street Fighter 8-way`

## 6. Monitor and Launch Games (32 s) - `06-monitor-and-launch-games.mp4`
**Title:** Ultimate Joystick Setup 6/9: Start Monitoring and Launch a Game
**Description:**
https://ultimatejoystick.com - Start Monitoring, launch a game from your usual frontend, and watch the app recognise it, pick the saved gate and show the progress message. Hands off the stick while the gate changes; play when Ready returns.
**Extra tags:** `MAME frontend`, `LaunchBox`, `HyperSpin`, `automatic gate`

## 7. Configure Splash Screens (38 s) - `07-configure-splash-screens.mp4`
**Title:** Ultimate Joystick Setup 7/9: Splash Screens That Tell Players When to Wait
**Description:**
https://ultimatejoystick.com - Turn on the full-screen messages shown during a gate change, pick images or text, set the display time, preview, Save. Players see "hands clear" and "ready" without reading a manual.
**Extra tags:** `arcade splash screen`, `cabinet UX`

## 8. Troubleshooting and Safe Shutdown (34 s) - `08-troubleshooting-and-safe-shutdown.mp4`
**Title:** Ultimate Joystick Setup 8/9: Troubleshooting and Shutting Down Safely
**Description:**
https://ultimatejoystick.com - What to check when the controller does not respond, directions do not register, or the game list is empty, plus the correct shutdown order: stop monitoring, close the game, release the gates, Exit.
**Extra tags:** `arcade troubleshooting`, `servo not moving`

## 9. Complete Start-to-Finish Guide (50 s) - `09-complete-start-to-finish.mp4`
**Title:** Ultimate Joystick: Complete Setup and Operating Walkthrough in Under a Minute
**Description:**
https://ultimatejoystick.com - Every step in one video: connect, set paths, calibrate, test, assign games, monitor and launch, splash screens, shutdown, plus the frontend-to-gate sequence a player sees. Chapters below.
0:00 Start and connect
0:07 Arcade locations
0:13 Calibration
0:20 Input and gate tests
0:26 Game assignments
0:32 Monitoring and launching
0:38 Splash screens
0:42 Frontend demo
0:46 Troubleshooting and shutdown
(Adjust chapter times to the final cut before publishing.)
**Extra tags:** `arcade joystick upgrade`, `automatic restrictor`

## 10. How to Replace the Servo (99 s) - `10-how-to-replace-the-servo.mp4`
**Title:** Ultimate Joystick Maintenance: Replace a Gate Servo and Re-Teach Its Positions
**Description:**
https://ultimatejoystick.com - Remove the old servo, connect the new one to the same pins, center it at 1500 us before fitting the arm, mount it, then in the Calibration tab Teach Pos2 (released) and Pos1 (engaged), test, and finish at Circle. Replacement servo sets: https://ultimatejoystick.com/order.html
**Extra tags:** `servo replacement`, `MG90S replacement`, `arcade repair`
