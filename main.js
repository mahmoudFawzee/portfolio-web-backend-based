const PROFILE_API_URL =
  "https://fullstack-node-flutter-portfolio.vercel.app/api/profile/mamdofa004";
const PROJECTS_API_URL =
  "https://fullstack-node-flutter-portfolio.vercel.app/api/projects/mamdofa004";
const SKILLS_API_URL =
  "https://fullstack-node-flutter-portfolio.vercel.app/api/skills/mamdofa004";

import { getSkillIcon } from "./skillsIcons.js";

let state = {
  profile: null,
  projects: [],
  skills: [],
  currentGalleryImages: [],
  currentImageIndex: 0,
};

const elements = {
  loader: document.getElementById("loader"),
  app: document.getElementById("app"),
  error: document.getElementById("error-message"),
  homeView: document.getElementById("home-view"),
  projectView: document.getElementById("project-view"),
  projectsGrid: document.getElementById("projects-grid"),
  skillsGrid: document.getElementById("skills-grid"),
  projectDetails: document.getElementById("project-details"),
  menuToggle: document.getElementById("menu-toggle"),
  navLinksContainer: document.getElementById("nav-links"),
  navLinks: document.querySelectorAll(".nav-link"),
  profileInfo: {
    name: document.getElementById("name"),
    job: document.getElementById("job"),
    image: document.getElementById("profile-image"),
    valueProp: document.getElementById("valueProp"),
    professionalBackground: document.getElementById("professionalBackground"),
    personalTouch: document.getElementById("personalTouch"),
    contactGrid: document.getElementById("contact-grid"),
    cvActions: document.getElementById("cv-actions"),
  },
  modal: {
    container: document.getElementById("image-modal"),
    image: document.getElementById("modal-image"),
    close: document.querySelector(".modal-close"),
    prev: document.getElementById("modal-prev"),
    next: document.getElementById("modal-next"),
  },
  skillModal: {
    container: document.getElementById("skill-modal"),
    details: document.getElementById("skill-details"),
    close: document.getElementById("skill-modal-close"),
  },
  themeToggle: document.getElementById("theme-toggle"),
  themeIcon: document.querySelector(".theme-icon"),
};

async function init() {
  try {
    // Essential data: Profile and Projects
    const [profileRes, projectsRes] = await Promise.all([
      fetch(PROFILE_API_URL),
      fetch(PROJECTS_API_URL),
    ]);

    if (!profileRes.ok || !projectsRes.ok) {
      throw new Error("Failed to fetch essential portfolio data");
    }

    const profileData = await profileRes.json();
    const projectsData = await projectsRes.json();

    state.profile = profileData.profileModel;
    state.projects = projectsData.data;

    renderProfile(state.profile);
    renderProjects(state.projects);

    // Fetch Skills independently so as not to block the entire app
    fetchSkills();

    // Theme and Animations
    setupTheme();
    setupScrollAnimations();
    animateName();

    // Footer Year
    document.getElementById("footer-year").textContent =
      new Date().getFullYear();

    // Handle initial routing
    handleRouting();
    setupNavbar();
    setupSectionObserver();

    elements.loader.style.display = "none";
    elements.app.style.display = "block";
  } catch (err) {
    console.error("Initialization error:", err);
    showError();
  }
}

async function fetchSkills() {
  try {
    console.log("Skills API call to:", SKILLS_API_URL);
    const skillsRes = await fetch(SKILLS_API_URL);

    if (!skillsRes.ok) {
      throw new Error(`Skills API failed with status: ${skillsRes.status}`);
    }

    const skillsData = await skillsRes.json();
    console.log("Skills API response:", skillsData);

    const skills = skillsData.skills || [];
    state.skills = skills;
    console.log("Parsed skills:", skills);

    renderSkills(skills);
  } catch (err) {
    console.error("Error fetching skills:", err);
    renderSkillsError();
  }
}

function handleRouting() {
  const hash = window.location.hash;

  if (hash.startsWith("#project/")) {
    const projectId = hash.split("/")[1];
    const project = state.projects.find((p) => p._id === projectId);
    if (project) {
      showProjectDetails(project);
    } else {
      showHome();
    }
  } else if (
    hash === "#home" ||
    hash === "#projects" ||
    hash === "#skills" ||
    hash === "#contact" ||
    hash === ""
  ) {
    showHome();
    if (hash && hash !== "#home") {
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else {
    showHome();
  }
}

function setupNavbar() {
  // Menu Toggle
  elements.menuToggle.addEventListener("click", () => {
    elements.menuToggle.classList.toggle("active");
    elements.navLinksContainer.classList.toggle("active");
  });

  // Close menu on link click
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      elements.menuToggle.classList.remove("active");
      elements.navLinksContainer.classList.remove("active");
    });
  });

  // Theme Toggle
  elements.themeToggle.addEventListener("click", toggleTheme);
}

function setupTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  elements.themeIcon.textContent = savedTheme === "dark" ? "🌙" : "☀️";
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  elements.themeIcon.textContent = newTheme === "dark" ? "🌙" : "☀️";
}

function setupScrollAnimations() {
  const reveals = document.querySelectorAll(
    "section, .glass-card, .project-card, .skill-card",
  );

  const revealOnScroll = () => {
    reveals.forEach((el) => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        el.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Initial check
}

function animateName() {
  const nameEl = elements.profileInfo.name;
  const text = nameEl.textContent;
  nameEl.textContent = "";
  nameEl.style.opacity = "1";

  let i = 0;
  const type = () => {
    if (i < text.length) {
      nameEl.textContent += text.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  };
  // Delayed start to ensure profile rendering is complete
  setTimeout(type, 500);
}

function setupSectionObserver() {
  const options = {
    threshold: 0.2,
    rootMargin: "-20%",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        elements.navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, options);

  document.querySelectorAll("section[id]").forEach((section) => {
    observer.observe(section);
  });
}

function showHome() {
  elements.homeView.style.display = "block";
  elements.projectView.style.display = "none";
}

function showProjectDetails(project) {
  elements.homeView.style.display = "none";
  elements.projectView.style.display = "block";
  renderProjectDetails(project);
  window.scrollTo(0, 0);
}

function getContactLink(type, value) {
  switch (type.toLowerCase()) {
    case "mobile":
      return `tel:${value.replace(/\s/g, "")}`;
    case "email":
      return `mailto:${value}`;
    case "whatsapp":
      const cleanNum = value.replace(/[^\d]/g, "");
      return `https://wa.me/${cleanNum}`;
    default:
      return value.startsWith("http") ? value : `https://${value}`;
  }
}

function renderProfile(profile) {
  const { personalInfo, contactInfo } = profile;
  const { profileInfo } = elements;

  profileInfo.name.textContent = personalInfo.name;
  profileInfo.job.textContent = personalInfo.job;
  profileInfo.image.src = personalInfo.imageUrl;
  profileInfo.image.alt = personalInfo.name;
  profileInfo.valueProp.textContent = personalInfo.valueProp;
  profileInfo.professionalBackground.textContent =
    personalInfo.professionalBackground;
  profileInfo.personalTouch.textContent = personalInfo.personalTouch;

  // CV Buttons
  profileInfo.cvActions.innerHTML = "";
  if (personalInfo.cvViewUrl) {
    const viewBtn = document.createElement("a");
    viewBtn.href = personalInfo.cvViewUrl;
    viewBtn.target = "_blank";
    viewBtn.className = "btn primary cv-btn";
    viewBtn.innerHTML = '<span class="icon">👁️</span> View CV';
    profileInfo.cvActions.appendChild(viewBtn);
  }
  if (personalInfo.cvDownloadUrl) {
    const downloadBtn = document.createElement("a");
    downloadBtn.href = personalInfo.cvDownloadUrl;
    downloadBtn.target = "_blank";
    downloadBtn.className = "btn secondary cv-btn";
    downloadBtn.innerHTML = '<span class="icon">📥</span> Download CV';
    profileInfo.cvActions.appendChild(downloadBtn);
  }

  profileInfo.contactGrid.innerHTML = "";
  contactInfo.forEach((contact) => {
    const link = getContactLink(contact.type, contact.value);
    const contactItem = document.createElement("a");
    contactItem.href = link;
    if (!link.startsWith("tel:") && !link.startsWith("mailto:"))
      contactItem.target = "_blank";
    contactItem.className = "contact-item";

    contactItem.innerHTML = `
            <img src="${contact.imageUrl}" alt="${contact.type}" class="contact-icon">
            <div class="contact-info">
                <span class="contact-type">${contact.type}</span>
            </div>
        `;
    profileInfo.contactGrid.appendChild(contactItem);
  });
}

function renderProjects(projects) {
  elements.projectsGrid.innerHTML = "";
  projects.forEach((project) => {
    const card = document.createElement("a");
    card.href = `#project/${project._id}`;
    card.className = "project-card";
    card.innerHTML = `
            <div class="project-cover-wrapper">
                <img src="${project.cover}" alt="${project.name}" class="project-cover" loading="lazy">
            </div>
            <div class="project-info">
                <h3>${project.name}</h3>
                <div class="project-icon-arrow">→</div>
            </div>
        `;
    elements.projectsGrid.appendChild(card);
  });
}

function renderSkills(skills) {
  elements.skillsGrid.innerHTML = "";

  if (!skills || skills.length === 0) {
    elements.skillsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                <span style="font-size: 3rem; display: block; margin-bottom: 20px;">🚀</span>
                <p>Skills will be added soon</p>
            </div>
        `;
    return;
  }

  skills.forEach((skill, index) => {
    const card = document.createElement("div");
    card.className = "skill-card reveal";
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
            <div class="skill-icon-wrapper">
                <img src="${getSkillIcon(skill.name)}" alt="${skill.name}" class="skill-icon">
            </div>
            <h3>${skill.name}</h3>
        `;
    card.onclick = () => showSkillDetails(skill);
    elements.skillsGrid.appendChild(card);
  });
}

function renderSkillsError() {
  elements.skillsGrid.innerHTML = `
        <div class="error-state" style="grid-column: 1/-1; text-align: center; padding: 40px; background: rgba(239, 68, 68, 0.05); border-radius: 20px; border: 1px dashed rgba(239, 68, 68, 0.3);">
            <p style="color: #ef4444; margin-bottom: 20px;">Unable to load skills at the moment.</p>
            <button onclick="fetchSkills()" class="btn secondary" style="padding: 8px 20px; font-size: 0.9rem;">
                <span class="icon">🔄</span> Retry
            </button>
        </div>
    `;
}

// Make fetchSkills global so retry button can call it
window.fetchSkills = fetchSkills;

function showSkillDetails(skill) {
  const detailsContainer = elements.skillModal.details;
  detailsContainer.innerHTML = `
        <div class="skill-details-header">
            <div class="skill-icon-wrapper" style="width: 60px; height: 60px; padding: 10px;">
                <img src="${getSkillIcon(skill.name)}" alt="${skill.name}" class="skill-icon">
            </div>
            <h2>${skill.name}</h2>
        </div>
        <div class="refs-section">
            <h3 style="margin-bottom: 20px; color: var(--primary);">Learning Resources</h3>
            <div class="refs-list">
                ${skill.refs
                  .map((ref) => {
                    const isClickable = ref.url && ref.url.trim() !== "";
                    return `
                        <${isClickable ? 'a href="' + ref.url + '" target="_blank"' : "div"} class="ref-item ${isClickable ? "clickable" : ""}">
                            <span class="ref-icon">${isClickable ? "🔗" : "📖"}</span>
                            <span class="ref-name">${ref.name}</span>
                            ${isClickable ? '<span class="external-icon">↗</span>' : ""}
                        </${isClickable ? "a" : "div"}>
                    `;
                  })
                  .join("")}
            </div>
        </div>
    `;
  elements.skillModal.container.style.display = "block";
  setupSkillModalEvents();
}

function setupSkillModalEvents() {
  elements.skillModal.close.onclick = () =>
    (elements.skillModal.container.style.display = "none");
  elements.skillModal.container.onclick = (e) => {
    if (e.target === elements.skillModal.container) {
      elements.skillModal.container.style.display = "none";
    }
  };

  // Support Escape key
  const originalKeyDown = document.onkeydown;
  document.onkeydown = (e) => {
    if (e.key === "Escape") {
      elements.skillModal.container.style.display = "none";
      document.onkeydown = originalKeyDown;
    } else if (originalKeyDown) {
      originalKeyDown(e);
    }
  };
}

function renderProjectDetails(project) {
  elements.projectDetails.innerHTML = `
        <div class="detail-header">
            <img src="${project.cover}" alt="${project.name}" class="detail-cover">
        </div>
        <div class="detail-content">
            <h1>${project.name}</h1>
            <p class="detail-summary">${project.summary}</p>
            
            <div class="links-section">
                ${Object.entries(project.links || {})
                  .map(([key, url]) => {
                    const iconMap = {
                      google_play:
                        "https://cdn-icons-png.flaticon.com/128/732/732208.png",
                      app_store:
                        "https://cdn-icons-png.flaticon.com/128/888/888841.png",
                      youtube:
                        "https://cdn-icons-png.flaticon.com/128/1384/1384060.png",
                      github:
                        "https://cdn-icons-png.flaticon.com/128/25/25231.png",
                      githup:
                        "https://cdn-icons-png.flaticon.com/128/25/25231.png",
                      website:
                        "https://cdn-icons-png.flaticon.com/128/1006/1006771.png",
                    };
                    const iconUrl = iconMap[key.toLowerCase()];
                    if (!iconUrl || !url) return "";

                    return `
                        <a href="${url}" target="_blank" class="link-icon" title="${key.replace("_", " ")}">
                            <img src="${iconUrl}" alt="${key}">
                        </a>
                    `;
                  })
                  .join("")}
            </div>

            <div class="gallery-section">
                <div class="gallery-header">
                    <h3>App Screenshots</h3>
                    <p>Click any screen for a closer look</p>
                </div>
                <div class="gallery-grid-vertical">
                    ${project.images
                      .map(
                        (img, index) => `
                        <div class="phone-mockup" onclick="openModal(${index})">
                            <div class="phone-frame">
                                <div class="phone-screen">
                                    <img src="${img.link}" alt="Screenshot" loading="lazy">
                                    <div class="phone-overlay">
                                        <div class="zoom-icon">🔍</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;

  state.currentGalleryImages = project.images.map((img) => img.link);
  setupModalEvents();
}

function setupModalEvents() {
  elements.modal.close.onclick = () =>
    (elements.modal.container.style.display = "none");
  elements.modal.container.onclick = (e) => {
    if (e.target === elements.modal.container)
      elements.modal.container.style.display = "none";
  };
  elements.modal.prev.onclick = (e) => {
    e.stopPropagation();
    navigateModal(-1);
  };
  elements.modal.next.onclick = (e) => {
    e.stopPropagation();
    navigateModal(1);
  };

  // Keyboard support
  document.onkeydown = (e) => {
    if (elements.modal.container.style.display === "block") {
      if (e.key === "ArrowLeft") navigateModal(-1);
      if (e.key === "ArrowRight") navigateModal(1);
      if (e.key === "Escape") elements.modal.container.style.display = "none";
    }
  };
}

window.openModal = function (index) {
  state.currentImageIndex = index;
  elements.modal.image.src = state.currentGalleryImages[index];
  elements.modal.container.style.display = "block";
};

function navigateModal(step) {
  state.currentImageIndex =
    (state.currentImageIndex + step + state.currentGalleryImages.length) %
    state.currentGalleryImages.length;
  elements.modal.image.src =
    state.currentGalleryImages[state.currentImageIndex];
}

function showError() {
  elements.loader.style.display = "none";
  elements.error.style.display = "flex";
  elements.error.style.justifyContent = "center";
}

window.addEventListener("hashchange", handleRouting);
document.addEventListener("DOMContentLoaded", init);
