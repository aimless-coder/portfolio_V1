gsap.registerPlugin(ScrollTrigger);

const parent = document.getElementById('logo');
const child = document.getElementById('nameLogo');

const calculateOffsets = () => {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  return {
    offsetX: Math.round(childRect.left - parentRect.left),
    offsetY: Math.round(childRect.top - parentRect.top + 10),
  };
}

let offsetX, offsetY;

const initializeAnimations = () => {
  ({ offsetX, offsetY } = calculateOffsets());

  gsap.to(child, {
    scrollTrigger: {
      trigger: '.content',
      start: 'top 17%',
      end: 'bottom bottom',
      scrub: 1,
      // markers: true,
      onUpdate: () => {
        const offsets = calculateOffsets();
        offsetX = offsets.offsetX;
        offsetY = offsets.offsetY;
      },
    },
    scale: 1 / 3,
    x: () => -offsetX,
    y: () => -offsetY,
    z: -200,
    rotationY: 45,
    ease: 'back.out(1.7)',
  });

  // GSAP animation for opacity
  gsap.to('.content', {
    scrollTrigger: {
      trigger: '.content',
      start: 'top 10%',
      end: 'bottom bottom',
      scrub: 1,
    },
    opacity: 0.4,
    ease: 'power1.out',
  });
}

window.addEventListener('load', () => {
  initializeAnimations();

  window.addEventListener('resize', () => {
    const offsets = calculateOffsets();
    offsetX = offsets.offsetX;
    offsetY = offsets.offsetY;
    
    ScrollTrigger.refresh();
  });
});


//Changing nav color on background
const sections = document.querySelectorAll(".section");
const nav = document.querySelector(".nav");

sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top 12%",
    end: "bottom 10%",
    onEnter: () => {
      updateNavbarColor(section);
    },
    onEnterBack: () => {
      updateNavbarColor(section);
    },
  });
});

function updateNavbarColor(section) {
  const navColor = section.getAttribute("data-nav-color");
  nav.style.color = navColor;
}

