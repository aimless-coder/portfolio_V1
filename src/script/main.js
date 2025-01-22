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

// Go to top button functionality
  const goToTopButton = document.getElementById('goToTop');
  
  window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
          goToTopButton.classList.add('visible');
      } else {
          goToTopButton.classList.remove('visible');
      }
  });
  
  goToTopButton.addEventListener('click', () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });


//Get position for GSAP Animation

const updateTargetPosition = () => {
  const reference = document.getElementById("titleLogo");
  const target = document.getElementById("nameLogo");
  const rect = reference.getBoundingClientRect();

  const refTop = rect.top + window.scrollY - (isMobile() ? 50 : 70);
  const refLeft = rect.left + window.scrollX;

  target.style.top = `${refTop}px`;
  target.style.left = `${refLeft}px`;
}

window.addEventListener('load', () => {
  updateTargetPosition();
  window.addEventListener('resize', updateTargetPosition);
  window.addEventListener('scroll', updateTargetPosition);
});

  
//GSAP Animation

gsap.registerPlugin(ScrollTrigger);

const parent = document.getElementById('logo');
const child = document.getElementById('nameLogo');

const calculateOffsets = () => {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();

  return {
    offsetX: Math.round(childRect.left - parentRect.left),
    offsetY: Math.round(childRect.top - parentRect.top + (isMobile() ? 5 : 10)),
  };
}

let offsetX, offsetY;

const initializeAnimations = () => {
  ({ offsetX, offsetY } = calculateOffsets());

    if(!isMobile()){gsap.to(child, {
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
  });}
  

  ScrollTrigger.matchMedia({
    "(max-width: 767px)": function() {
      gsap.to(child, {
        scrollTrigger: {
          trigger: '.content',
          start: 'top 25%', 
          end: 'bottom bottom',
          scrub: 1,
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
    }
  });

  // GSAP animation for opacity
if(!isMobile()){gsap.to('.content', {
    scrollTrigger: {
      trigger: '.content',
      start: 'top 10%',
      end: 'bottom bottom',
      scrub: 1,
    },
    opacity: 0.4,
    ease: 'power1.out',
  });}


ScrollTrigger.matchMedia({
  "(max-width: 767px)": function() {
    gsap.to('.content', {
      scrollTrigger: {
        trigger: '.content',
        start: 'top 25%',
        end: 'bottom bottom',
        scrub: 1,
      },
      opacity: 0.4,
      ease: 'power1.out',
    });
  }
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

const updateNavbarColor = (section) => {
  const navColor = section.getAttribute("data-nav-color");
  nav.style.color = navColor;
}

//Email contact section

window.sendEmail = () => {

  emailjs.init("S_iUIUPyQmhdB1tf3");

      const form = document.querySelector('.contact-form');
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const message = document.querySelector('#message').value;

      const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
      if (!name || !email || !message) {
        Toastify({
          text: "All fields are required.",
          duration: 3000,
          newWindow: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: true,
          style: {
            background: "black",
          },
        }).showToast();
        return;
      }
    
      if (!emailRegex.test(email)) {
        Toastify({
          text: "Please enter a valid email address.",
          duration: 3000,
          newWindow: true,
          gravity: "bottom",
          position: "center",
          stopOnFocus: true,
          style: {
            background: "black",
          },
        }).showToast();
        return;
      }

      emailjs.sendForm(
        'service_aimlessCoder',
        'template_submitContactFm',
        form 
      ).then(
        function (response) {
          Toastify({
              text: "Email sent successfully!",
              duration: 3000,
              newWindow: true,
              gravity: "bottom",
              position: "center",
              stopOnFocus: true,
              style: {
                background: "black",
              },
            }).showToast();
          form.reset();
        },
        function (error) {
          Toastify({
              text: "Failed to send email. Please try again later.",
              duration: 3000,
              newWindow: true,
              gravity: "bottom",
              position: "center",
              stopOnFocus: true,
              style: {
                background: "red",
              },
            }).showToast();
          form.reset();
        }
      );
    }
    

