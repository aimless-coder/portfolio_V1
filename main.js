const hoverItems = document.querySelectorAll('.project-name');
const revealItems = document.querySelectorAll('.reveal-item');

const activateRevealItem = (targetId) => {
  revealItems.forEach(item => {
    if (item.id === targetId) {
      if (!item.classList.contains('active')) {
        const children = item.querySelectorAll('*');
        gsap.fromTo(children, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.1 }
      );
      }
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
};

hoverItems.forEach(item => {
  item.addEventListener('mouseover', () => {
    const targetId = item.getAttribute('data-target');
    activateRevealItem(targetId);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  activateRevealItem('project1');
});
