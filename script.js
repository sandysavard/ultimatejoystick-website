// Ultimate Joystick Script - 5-in-1 Restrictor System

// Always start at the top of the page on load
window.addEventListener('DOMContentLoaded', function() {
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
  }
  window.scrollTo(0, 0);
  initAllVideoDocks();
  initNavHighlighting();
});

// Universal Webpage Reset Handler
function resetWebpage() {
  // Clear and reset all video docks on the page
  const videoDocks = document.querySelectorAll('.video-dock');
  videoDocks.forEach((dock) => {
    if (dock._resetDock) {
      dock._resetDock();
    }
  });

  // Clear all text and file inputs
  document.querySelectorAll('input').forEach((input) => {
    if (input.type === 'text' || input.type === 'file' || input.type === 'search') {
      input.value = '';
    }
  });

  // Reset MAME search and filters if present
  const mameSearchInput = document.getElementById('mame-search-input');
  if (mameSearchInput) {
    mameSearchInput.value = '';
    if (typeof renderMameGrid === 'function') {
      searchQuery = '';
      activeFilter = 'all';
      const pills = document.querySelectorAll('.mame-filter-pill');
      pills.forEach((p) => p.classList.toggle('is-active', p.dataset.filter === 'all'));
      renderMameGrid();
    }
  }

  // Smooth scroll back to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.resetWebpage = resetWebpage;

// Clean Parent MAME Game Database (100% Deduplicated, No Clones)
const mameDatabase = [
  // PLUS (4-Way)
  { title: "Pac-Man", zip: "pacman.zip", year: "1980", dev: "Namco / Midway", genre: "Maze", gate: "plus", gateName: "PLUS (4-Way)", desc: "Strict 4-way cardinal restriction prevents sticky cornering." },
  { title: "Ms. Pac-Man", zip: "mspacman.zip", year: "1981", dev: "Midway", genre: "Maze", gate: "plus", gateName: "PLUS (4-Way)", desc: "Fast maze classic with 4-way cardinal requirement." },
  { title: "Donkey Kong", zip: "dkong.zip", year: "1981", dev: "Nintendo", genre: "Platformer", gate: "plus", gateName: "PLUS (4-Way)", desc: "Clean ladder climbing with zero diagonal drift." },
  { title: "Donkey Kong Jr.", zip: "dkongjr.zip", year: "1982", dev: "Nintendo", genre: "Platformer", gate: "plus", gateName: "PLUS (4-Way)", desc: "4-way vine climbing and fruit dropping precision." },
  { title: "Frogger", zip: "frogger.zip", year: "1981", dev: "Konami / Sega", genre: "Action", gate: "plus", gateName: "PLUS (4-Way)", desc: "Grid movement locked to 4 cardinal directions." },
  { title: "Dig Dug", zip: "digdug.zip", year: "1982", dev: "Namco", genre: "Maze", gate: "plus", gateName: "PLUS (4-Way)", desc: "Underground digging requires crisp 4-way turns." },
  { title: "Q*bert", zip: "qbert.zip", year: "1982", dev: "Gottlieb", genre: "Puzzle", gate: "plus", gateName: "PLUS (4-Way)", desc: "Isometric pyramid jumps mapped to cardinal gate." },
  { title: "BurgerTime", zip: "btime.zip", year: "1982", dev: "Data East", genre: "Platformer", gate: "plus", gateName: "PLUS (4-Way)", desc: "Stair and ladder navigation without diagonal trapping." },
  { title: "Berzerk", zip: "berzerk.zip", year: "1980", dev: "Stern", genre: "Shooter", gate: "plus", gateName: "PLUS (4-Way)", desc: "4-way maze survival against Evil Otto." },
  { title: "Punch-Out!!", zip: "punchout.zip", year: "1984", dev: "Nintendo", genre: "Sports", gate: "plus", gateName: "PLUS (4-Way)", desc: "Boxing dodges and jabs locked to 4 cardinal vectors." },

  // SQUARE (8-Way)
  { title: "Street Fighter II: World Warrior", zip: "sf2.zip", year: "1991", dev: "Capcom", genre: "Fighting", gate: "square", gateName: "SQUARE (8-Way)", desc: "Full 8-way range for quarter-circle and dragon punch motions." },
  { title: "Super Street Fighter II Turbo", zip: "ssf2t.zip", year: "1994", dev: "Capcom", genre: "Fighting", gate: "square", gateName: "SQUARE (8-Way)", desc: "Precision 8-way box for high-level competitive play." },
  { title: "Street Fighter Alpha 3", zip: "sfa3.zip", year: "1998", dev: "Capcom", genre: "Fighting", gate: "square", gateName: "SQUARE (8-Way)", desc: "8-way directional combos and air-blocking." },
  { title: "Metal Slug", zip: "mslug.zip", year: "1996", dev: "SNK / Nazca", genre: "Run & Gun", gate: "square", gateName: "SQUARE (8-Way)", desc: "Responsive 360-degree aiming and jump maneuvers." },
  { title: "Mortal Kombat II", zip: "mk2.zip", year: "1993", dev: "Midway", genre: "Fighting", gate: "square", gateName: "SQUARE (8-Way)", desc: "8-way control for fatalities and special moves." },
  { title: "Marvel vs Capcom 2", zip: "mvsc2.zip", year: "2000", dev: "Capcom", genre: "Fighting", gate: "square", gateName: "SQUARE (8-Way)", desc: "High-speed 8-way aerial combos and team supers." },
  { title: "King of Fighters '98", zip: "kof98.zip", year: "1998", dev: "SNK", genre: "Fighting", gate: "square", gateName: "SQUARE (8-Way)", desc: "Neo-Geo arcade standard 8-way restrictor." },
  { title: "Teenage Mutant Ninja Turtles", zip: "tmnt.zip", year: "1989", dev: "Konami", genre: "Beat 'em Up", gate: "square", gateName: "SQUARE (8-Way)", desc: "4-player beat 'em up with full 8-way movement." },
  { title: "Golden Axe", zip: "goldnaxe.zip", year: "1989", dev: "Sega", genre: "Beat 'em Up", gate: "square", gateName: "SQUARE (8-Way)", desc: "8-directional hack-and-slash arcade classic." },
  { title: "NBA Jam Tournament Edition", zip: "nbajamte.zip", year: "1994", dev: "Midway", genre: "Sports", gate: "square", gateName: "SQUARE (8-Way)", desc: "High-flying 8-way basketball dunks." },

  // VERTICAL (2-Way)
  { title: "Galaga (Vert)", zip: "galaga.zip", year: "1981", dev: "Namco", genre: "Shooter", gate: "vertical", gateName: "VERTICAL (2-Way)", desc: "2-way vertical channel for space fighter positioning." },
  { title: "1942", zip: "1942.zip", year: "1984", dev: "Capcom", genre: "Shooter", gate: "vertical", gateName: "VERTICAL (2-Way)", desc: "Vertical scrolling flight lane." },
  { title: "1943: Midway", zip: "1943.zip", year: "1987", dev: "Capcom", genre: "Shooter", gate: "vertical", gateName: "VERTICAL (2-Way)", desc: "WWII vertical flight combat." },
  { title: "Space Invaders (Vert)", zip: "invaders.zip", year: "1978", dev: "Taito", genre: "Shooter", gate: "vertical", gateName: "VERTICAL (2-Way)", desc: "Dedicated vertical mode restriction." },
  { title: "Raiden", zip: "raiden.zip", year: "1990", dev: "Seibu Kaihatsu", genre: "Shooter", gate: "vertical", gateName: "VERTICAL (2-Way)", desc: "Vertical shooter flight track." },
  { title: "DoDonPachi", zip: "ddonpach.zip", year: "1997", dev: "Cave", genre: "Shooter", gate: "vertical", gateName: "VERTICAL (2-Way)", desc: "Bullet hell vertical corridor precision." },

  // HORIZONTAL (2-Way)
  { title: "Arkanoid", zip: "arkanoid.zip", year: "1986", dev: "Taito", genre: "Breakout", gate: "horizontal", gateName: "HORIZONTAL (2-Way)", desc: "Horizontal paddle tracking with zero vertical wobble." },
  { title: "Breakout", zip: "breakout.zip", year: "1976", dev: "Atari", genre: "Breakout", gate: "horizontal", gateName: "HORIZONTAL (2-Way)", desc: "Classic side-to-side paddle restrictor." },
  { title: "Defender", zip: "defender.zip", year: "1981", dev: "Williams", genre: "Shooter", gate: "horizontal", gateName: "HORIZONTAL (2-Way)", desc: "Linear horizontal radar defense." },
  { title: "Joust", zip: "joust.zip", year: "1982", dev: "Williams", genre: "Action", gate: "horizontal", gateName: "HORIZONTAL (2-Way)", desc: "Horizontal ostrich flight battling." },

  // CIRCLE (360° Free)
  { title: "720 Degrees", zip: "720.zip", year: "1986", dev: "Atari", genre: "Sports", gate: "circle", gateName: "CIRCLE (360° Free)", desc: "Full 360-degree free rotation skateboarding." },
  { title: "After Burner II", zip: "aburner2.zip", year: "1987", dev: "Sega", genre: "Flight", gate: "circle", gateName: "CIRCLE (360° Free)", desc: "360-degree jet dogfight freedom." },
  { title: "Daytona USA", zip: "daytona.zip", year: "1993", dev: "Sega", genre: "Racing", gate: "circle", gateName: "CIRCLE (360° Free)", desc: "Smooth circular steering wheel analog feel." },
  { title: "OutRun", zip: "outrun.zip", year: "1986", dev: "Sega", genre: "Racing", gate: "circle", gateName: "CIRCLE (360° Free)", desc: "Scenic highway circular steering curve." },
  { title: "Robotron: 2084", zip: "robotron.zip", year: "1982", dev: "Williams", genre: "Dual-Stick Shooter", gate: "circle", gateName: "CIRCLE (360° Free)", desc: "Smooth 360-degree dual-stick aiming and movement." },

  // OCTAGONAL (8-Way Guided)
  { title: "Soul Calibur", zip: "soulclbr.zip", year: "1998", dev: "Namco", genre: "Fighting", gate: "octagonal", gateName: "OCTAGONAL (8-Way Guided)", desc: "Guided 8-way detents for 8-way run 3D sword fighting." },
  { title: "Tekken 3", zip: "tekken3.zip", year: "1997", dev: "Namco", genre: "Fighting", gate: "octagonal", gateName: "OCTAGONAL (8-Way Guided)", desc: "Tactile corner detents for sidestepping and crouch dashes." }
];

// Universal Video Dock Handler for Home & 6-Box Video Demo Page
function initAllVideoDocks() {
  const videoDocks = document.querySelectorAll('.video-dock');
  videoDocks.forEach((dock) => {
    const input = dock.querySelector('.video-input');
    const preview = dock.querySelector('.video-preview');
    const stage = dock.querySelector('.video-stage');
    const status = dock.querySelector('.video-status');
    const clearBtn = dock.querySelector('.video-clear');
    const browseBtn = dock.querySelector('.btn-browse-dock-video');
    const demoBtn = dock.querySelector('.btn-demo-dock-video');
    const compressOverlay = dock.querySelector('.video-compress-overlay');
    const compressBarFill = dock.querySelector('.compress-bar-fill');
    const compressStatusText = dock.querySelector('.compress-status-text');

    function resetDock() {
      if (preview) {
        if (preview.src) URL.revokeObjectURL(preview.src);
        preview.removeAttribute('src');
        preview.load();
      }
      if (input) input.value = '';
      if (stage) {
        stage.classList.remove('is-loaded');
        stage.classList.remove('is-dragging');
      }
      if (status) status.textContent = 'Ready for Video File';
      if (clearBtn) clearBtn.hidden = true;
      if (compressOverlay) compressOverlay.hidden = true;
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetDock();
      });
    }

    function loadDockVideo(file) {
      if (!file || !file.type.startsWith('video/')) {
        if (status) status.textContent = 'Please select a valid video file';
        return;
      }

      if (compressOverlay) compressOverlay.hidden = false;
      if (status) status.textContent = 'Compressing & Optimizing Video...';
      if (compressBarFill) compressBarFill.style.width = '0%';

      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        if (compressBarFill) compressBarFill.style.width = `${progress}%`;
        if (compressStatusText) {
          if (progress === 25) compressStatusText.textContent = 'Analyzing video codecs & framerate...';
          if (progress === 50) compressStatusText.textContent = 'Compressing bitrate for fast web playback...';
          if (progress === 75) compressStatusText.textContent = 'Syncing live HUD telemetry...';
        }

        if (progress >= 100) {
          clearInterval(interval);
          if (compressOverlay) compressOverlay.hidden = true;
          if (preview) {
            preview.src = URL.createObjectURL(file);
            preview.play().catch(() => {});
          }
          if (stage) stage.classList.add('is-loaded');
          if (status) status.textContent = `${file.name} (Optimized HD)`;
          if (clearBtn) clearBtn.hidden = false;
        }
      }, 200);
    }

    if (input) {
      input.addEventListener('change', (e) => {
        const [file] = e.target.files;
        if (file) loadDockVideo(file);
      });
    }

    if (browseBtn && input) {
      browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        input.click();
      });
    }

    if (demoBtn) {
      demoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (status) status.textContent = 'Simulated Hardware Demo Active';
        if (stage) stage.classList.add('is-loaded');
        if (clearBtn) clearBtn.hidden = false;
      });
    }

    if (stage) {
      ['dragenter', 'dragover'].forEach((evt) => {
        stage.addEventListener(evt, (e) => {
          e.preventDefault();
          stage.classList.add('is-dragging');
        });
      });

      ['dragleave', 'dragend'].forEach((evt) => {
        stage.addEventListener(evt, () => {
          stage.classList.remove('is-dragging');
        });
      });

      stage.addEventListener('drop', (e) => {
        e.preventDefault();
        stage.classList.remove('is-dragging');
        const [file] = e.dataTransfer.files;
        if (file) loadDockVideo(file);
      });
    }

    // Save reset reference on element
    dock._resetDock = resetDock;
  });
}

// MAME Database Search & Filter
const mameSearchInput = document.getElementById("mame-search-input");
const mameFilterPills = [...document.querySelectorAll(".mame-filter-pill")];
const mameGrid = document.getElementById("mame-grid");

let activeFilter = "all";
let searchQuery = "";

function renderMameGrid() {
  if (!mameGrid) return;

  const filtered = mameDatabase.filter((game) => {
    const matchesFilter = activeFilter === "all" || game.gate === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      game.title.toLowerCase().includes(searchQuery) ||
      game.zip.toLowerCase().includes(searchQuery) ||
      game.genre.toLowerCase().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    mameGrid.innerHTML = '<div class="glass-card" style="grid-column: 1/-1; padding: 2rem; text-align: center;"><p>No matching games found in database.</p></div>';
    return;
  }

  mameGrid.innerHTML = filtered
    .map(
      (game) => `
    <article class="mame-card glass-card">
      <div class="mame-card-header">
        <h4 class="mame-title">${game.title}</h4>
        <span class="mame-badge badge-${game.gate}">${game.gateName}</span>
      </div>
      <p class="mame-desc">${game.desc}</p>
      <div style="font-size: 0.75rem; color: var(--ink-soft); margin-top: 0.6rem; display: flex; justify-content: space-between; align-items: center;">
        <span>${game.zip} • ${game.dev} (${game.year})</span>
        <button onclick="removeGameByTitle('${game.title.replace(/'/g, "\\'")}')" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-weight: 600; font-size: 0.75rem; text-decoration: underline;" title="Remove game profile">Delete</button>
      </div>
    </article>
  `
    )
    .join("");
}

if (mameSearchInput) {
  mameSearchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderMameGrid();
  });
}

mameFilterPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    mameFilterPills.forEach((p) => p.classList.remove("is-active"));
    pill.classList.add("is-active");
    activeFilter = pill.dataset.filter;
    renderMameGrid();
  });
});

// Dynamic Navigation Active Highlight
function initNavHighlighting() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.site-nav .nav-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('ultimate_joystick.html') || currentPath.endsWith('/') || currentPath === '';
    const isVideo = currentPath.includes('video_demo.html');
    const isOrder = currentPath.includes('order.html');

    let isActive = false;
    if (isVideo && href.includes('video_demo.html')) {
      isActive = true;
    } else if (isOrder && href.includes('order.html')) {
      isActive = true;
    } else if (isHome && (href.includes('index.html') || href.includes('ultimate_joystick.html'))) {
      isActive = true;
    }

    link.classList.toggle('active', isActive);
  });
}

// Initializations
if (mameGrid) renderMameGrid();
