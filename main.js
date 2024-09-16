"use-strict";

const header = document.querySelector(".header");
const mobileNavBtn = document.querySelector(".nav__toggle");
const mobileNav = document.querySelector(".mobile__nav");
const navMenu = document.querySelector(".nav__menu");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const allSections = document.querySelectorAll(".section");
const imgTargets = document.querySelectorAll("img[data-src]");

//////// PAGE START FROM TOP WHEN RELAOD ////////
window.onbeforeunload = () => window.scrollTo(0, 0);

//////// STICKY NAVIGATION ////////
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//////// NAV MENU FADE ANIMATION ////////
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

//////// PAGE NAVIGATION ////////
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//////// MOBILE NAVIGATION ////////
mobileNavBtn.addEventListener("click", function () {
  if (mobileNav.classList.contains("open")) {
    mobileNav.classList.remove("open");
    navMenu.classList.add("menu-close");
  } else {
    mobileNav.classList.add("open");
    navMenu.classList.remove("menu-close");
  }

  navMenu.addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.classList.contains("mobile__nav-link")) {
      const id = e.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
      navMenu.classList.add("menu-close");
      mobileNav.classList.remove("open");
    }
  });
});

//////// MODAL WINDOW ////////
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

//////// BUTTON SCROLLING ////////
btnScrollTo.addEventListener("click", () =>
  section1.scrollIntoView({ behavior: "smooth" })
);

//////// TABBED COMPONENT ////////
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard Clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach((content) =>
    content.classList.remove("operations__content--active")
  );

  // Active tab
  clicked.classList.add("operations__tab--active");

  // Active content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//////// REVEAL SECTIONS ////////
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//////// LAZY LOADING IMAGES ////////
const loadImg = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", () =>
    entry.target.classList.remove("lazy-img")
  );

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

//////// SLIDER FUNCTION ////////
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = () =>
    slides.forEach((_, idx) =>
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${idx}"></button>`
      )
    );

  const activateDot = (slide) => {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = (slide) =>
    slides.forEach(
      (content, idx) =>
        (content.style.transform = `translateX(${100 * (idx - slide)}%)`)
    );

  const nextSlide = () => {
    curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = () => {
    curSlide === 0 ? (curSlide = maxSlide - 1) : curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = () => {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  //Event Handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", (e) => {
    e.key === "ArrowRight" && nextSlide();
    e.key === "ArrowLeft" && prevSlide();
  });

  dotContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();
