const hoverItems = document.querySelectorAll('.project-name');
const revealItems = document.querySelectorAll('.reveal-item');
const arrowItems = document.querySelectorAll('.arrow');

const skillItems = document.querySelectorAll('.skill');

const isMobile = () => window.innerWidth <= 767;

const updateArrowRotation = (targetId, isActive) => {
  const targetArrow = document.querySelector(`[data-target="${targetId}"]`)
    .closest('.hover-item')
    .querySelector('.arrow');
  
  if (targetArrow) {
    targetArrow.style.transform = isActive ? 'rotate(90deg)' : 'rotate(0deg)';
  }
};

const activateRevealItem = (targetId, clickedArrow = null) => {
  if (isMobile()) {
    const clickedItem = document.querySelector(`[data-target="${targetId}"]`).closest('.hover-item');
    const targetReveal = document.getElementById(targetId);
    
    const existingReveals = document.querySelectorAll('.mobile-reveal');
    
    arrowItems.forEach(arrow => {
      const arrowHoverItem = arrow.closest('.hover-item').querySelector('.project-name');
      const arrowTargetId = arrowHoverItem.getAttribute('data-target');
      updateArrowRotation(arrowTargetId, false);
    });
    
    existingReveals.forEach(reveal => {
      if (!(clickedArrow && reveal === clickedItem.nextElementSibling)) {
        reveal.remove();
      }
    });

    if (clickedItem.nextElementSibling?.classList.contains('mobile-reveal')) {
      clickedItem.nextElementSibling.remove();
      updateArrowRotation(targetId, false);
      return;
    }

    const mobileReveal = document.createElement('div');
    mobileReveal.className = 'mobile-reveal active';
    mobileReveal.innerHTML = targetReveal.innerHTML;

    clickedItem.after(mobileReveal);
    updateArrowRotation(targetId, true);

    mobileReveal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
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

    hoverItems.forEach(item => {
      const itemHoverContainer = item.closest('.hover-item');
      if (item.getAttribute('data-target') === targetId) {
        itemHoverContainer.style.opacity = '1';
      } else {
        itemHoverContainer.style.opacity = '0.7';
      }
    });
  }
};

hoverItems.forEach(item => {
  const targetId = item.getAttribute('data-target');
  
  if (isMobile()) {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      activateRevealItem(targetId);
    });
  } else {
    item.addEventListener('mouseover', () => {
      activateRevealItem(targetId);
    });
  }
});

arrowItems.forEach(arrow => {
  const hoverItem = arrow.closest('.hover-item').querySelector('.project-name');
  const targetId = hoverItem.getAttribute('data-target');
  
  if (isMobile()) {
    arrow.addEventListener('click', (e) => {
      e.preventDefault();
      activateRevealItem(targetId, arrow);
    });
  }
});

const randomChar = () => {
  let char = "abcdefghijklmnopqrstuvwxyz1234567890!@#$^&*()…æ_+-=;[]/~`"
  char = char[Math.floor(Math.random() * char.length)]
  return (Math.random() > 0.5 )? char : char.toUpperCase();
}

skillItems.forEach((text) =>{
  const arr1 = text.innerHTML.split('');
  const arr2 = [];

  arr1.forEach((char, i) => arr2[i] = randomChar());
  text.onpointerover = () => {
    const tl = gsap.timeline();
    let step = 0;
    tl.fromTo(text, {
      innerHTML: arr2.join(''),
    },{
      duration: arr1.length/10,
      ease: 'power.in',
      delay: 0.1,
      onUpdate: () => {
        const p = Math.floor(tl.progress() * (arr1.length));
        if(step != p){
          step = p;
          arr1.forEach((char, i) => arr2[i] = randomChar());
          let pt1 = arr1.join('').substring(p, 0);
          let pt2 = arr2.join('').substring(arr2.length - p, 0);

          text.innerHTML = pt1 + pt2;
        }
      }
    })
  }
})

window.addEventListener('resize', () => {
  const mobileReveals = document.querySelectorAll('.mobile-reveal');
  if (!isMobile()) {
    mobileReveals.forEach(reveal => reveal.remove());
    document.querySelectorAll('.hover-item').forEach(item => {
      item.style.opacity = '1';
    });
    activateRevealItem('project1');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  if (!isMobile()) {
    activateRevealItem('project1');
  }
});

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = 'none';
});
