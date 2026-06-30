const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

const itchData = [
  {
    sector: "Manufacturing",
    size: "Mid-market",
    score: 94,
    title: "Shift handoffs lose production context",
    problem: "Supervisors rely on memory, notes, and scattered messages to explain defects, downtime, and priority changes.",
    action: "Create a shift handoff standard, visual dashboard, and escalation routine."
  },
  {
    sector: "Healthcare Clinics",
    size: "Growing",
    score: 91,
    title: "Patient follow-ups sit in multiple queues",
    problem: "Appointments, lab follow-ups, referrals, and patient questions are tracked across inboxes and manual lists.",
    action: "Map intake-to-follow-up flow and define one visible queue with ownership."
  },
  {
    sector: "Construction and Trades",
    size: "Small",
    score: 90,
    title: "Change orders move slower than the job",
    problem: "Field updates, photos, approvals, and material changes arrive late, causing rework and billing friction.",
    action: "Standardize change capture and automate reminders for approvals."
  },
  {
    sector: "Logistics and Warehousing",
    size: "Mid-market",
    score: 88,
    title: "Inventory counts do not match reality",
    problem: "Teams lose time reconciling system quantities, returns, damaged goods, and unplanned stock movements.",
    action: "Review transaction points, error categories, and daily inventory control routines."
  },
  {
    sector: "Professional Services",
    size: "Small",
    score: 86,
    title: "Client intake starts over too often",
    problem: "Teams ask clients for the same information more than once and rebuild project context manually.",
    action: "Create one intake standard, document checklist, and client-status workflow."
  },
  {
    sector: "Retail and E-commerce",
    size: "Growing",
    score: 84,
    title: "Returns create hidden admin work",
    problem: "Refunds, exchanges, inventory updates, and customer messages require repeated manual checks.",
    action: "Map the return flow and remove duplicate status updates."
  },
  {
    sector: "Food and Beverage",
    size: "Mid-market",
    score: 83,
    title: "Batch records are audit-ready too late",
    problem: "Production, quality, and sanitation records are completed after the fact or stored in disconnected places.",
    action: "Design a simple daily record review and quality exception routine."
  },
  {
    sector: "Municipal and Nonprofit",
    size: "Growing",
    score: 81,
    title: "Approvals stall service response",
    problem: "Permits, grants, requests, and board decisions wait because ownership and next steps are unclear.",
    action: "Create a visible approval board with age, owner, and next action."
  },
  {
    sector: "Property Management",
    size: "Small",
    score: 79,
    title: "Maintenance tickets lack closure discipline",
    problem: "Requests move through calls, texts, contractors, and emails without a clean closed-loop status.",
    action: "Define ticket categories, handoff rules, and tenant communication triggers."
  }
];

const sectorFilter = document.getElementById("sectorFilter");
const sizeFilter = document.getElementById("sizeFilter");
const itchList = document.getElementById("itchList");
const indexStatus = document.getElementById("indexStatus");
const personalScore = document.getElementById("personalScore");
const scoreAdvice = document.getElementById("scoreAdvice");

function closeMenu() {
  mobileMenu.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

function populateFilters() {
  const sectors = [...new Set(itchData.map(item => item.sector))].sort();

  sectors.forEach(sector => {
    const option = document.createElement("option");
    option.value = sector;
    option.textContent = sector;
    sectorFilter.appendChild(option);
  });
}

function scoreClass(score) {
  if (score >= 88) return "high";
  if (score >= 82) return "medium";
  return "low";
}

function renderItches() {
  const sector = sectorFilter.value;
  const size = sizeFilter.value;

  itchList.classList.add("updating");

  const filtered = itchData
    .filter(item => sector === "all" || item.sector === sector)
    .filter(item => size === "all" || item.size === size)
    .sort((a, b) => b.score - a.score);

  window.setTimeout(() => {
    if (!filtered.length) {
      itchList.innerHTML = `
        <article class="itch-card card-enter">
          <h3>No exact match yet</h3>
          <p>Try a broader filter or use the score tool to rank your own workflow itch.</p>
        </article>
      `;
      indexStatus.textContent = "No exact match yet. Try a broader sector or size filter.";
      itchList.classList.remove("updating");
      return;
    }

    indexStatus.textContent = `Showing ${filtered.length} ranked workflow ${filtered.length === 1 ? "itch" : "itches"}${sector !== "all" ? ` for ${sector}` : ""}.`;

    itchList.innerHTML = filtered.map((item, index) => `
      <article class="itch-card ${scoreClass(item.score)} card-enter" style="animation-delay:${index * 70}ms">
        <div class="card-top">
          <div>
            <div class="card-meta">${item.sector} | ${item.size}</div>
            <h3>${item.title}</h3>
          </div>
          <div class="score-badge">${item.score}</div>
        </div>
        <p>${item.problem}</p>
        <div class="leanos-action">
          <strong>LeanOS first move</strong>
          <span>${item.action}</span>
        </div>
      </article>
    `).join("");

    const topItch = filtered[0];
    document.getElementById("heroScore").textContent = topItch.score;
    document.querySelector(".score-orbit b").textContent = topItch.score;
    itchList.classList.remove("updating");
  }, 160);
}

function activateScoreTool() {
  const inputs = ["frequency", "timeWaste", "friction", "automation"].map(id => document.getElementById(id));

  function updateScore() {
    const total = inputs.reduce((sum, input) => sum + Number(input.value), 0);
    const calculated = Math.round((total / 40) * 100);
    personalScore.textContent = calculated;
    personalScore.animate(
      [
        { transform: "scale(0.94)", opacity: 0.76 },
        { transform: "scale(1.04)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 }
      ],
      { duration: 260, easing: "ease-out" }
    );

    if (calculated >= 80) {
      scoreAdvice.textContent = "High priority. This should be reviewed for standardization or automation.";
    } else if (calculated >= 55) {
      scoreAdvice.textContent = "Medium priority. Worth mapping before it becomes a recurring bottleneck.";
    } else {
      scoreAdvice.textContent = "Lower priority. Track it, but focus first on higher-friction work.";
    }
  }

  inputs.forEach(input => input.addEventListener("input", updateScore));
  updateScore();
}

function activateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 900;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = target;
        }
      }

      requestAnimationFrame(tick);
      observer.unobserve(element);
    });
  }, { threshold: 0.35 });

  counters.forEach(counter => observer.observe(counter));
}

function activateReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  items.forEach(item => observer.observe(item));
}

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

populateFilters();
renderItches();
activateScoreTool();
activateCounters();
activateReveal();

[sectorFilter, sizeFilter].forEach(filter => {
  filter.addEventListener("change", renderItches);
});
