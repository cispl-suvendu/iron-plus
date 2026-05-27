const thumbs = document.querySelectorAll('.thumb');
const mainImg = document.getElementById('mainProduct');
const priceEl = document.querySelector('.price');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let current = 0;
let autoSlide;

// ==============================
// SELECT SLIDE
// ==============================

function select(i) {

  current = (i + thumbs.length) % thumbs.length;

  thumbs.forEach(t => t.classList.remove('active'));

  const t = thumbs[current];

  t.classList.add('active');

  const src = t.dataset.src;
  const price = t.dataset.price;

  // IMAGE OUT
  gsap.to(mainImg, {
    scale: 1.3,
    opacity: 0,
    duration: 0.2,
    ease: "power3.in",

    onComplete: () => {

      mainImg.src = src;

      // PREPARE NEXT
      gsap.set(mainImg, {
        scale: 0.8,
        opacity: 0
      });

      // IMAGE IN
      gsap.to(mainImg, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "expo.out"
      });

    }
  });

  // PRICE ANIMATION
  gsap.to(priceEl, {
    opacity: 0,
    y: 10,
    duration: 0.2,

    onComplete: () => {

      priceEl.textContent = `$ ${price}`;

      gsap.to(priceEl, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      });

    }
  });

}

// ==============================
// AUTO SLIDE
// ==============================

function startAutoSlide() {

  autoSlide = setInterval(() => {

    select(current + 1);

  }, 3000);

}

// ==============================
// RESET AUTO SLIDE
// ==============================

function resetAutoSlide() {

  clearInterval(autoSlide);

  startAutoSlide();

}

// ==============================
// EVENTS
// ==============================

thumbs.forEach((t, i) => {

  t.addEventListener('click', () => {

    select(i);

    resetAutoSlide();

  });

});

prevBtn.addEventListener('click', () => {

  select(current - 1);

  resetAutoSlide();

});

nextBtn.addEventListener('click', () => {

  select(current + 1);

  resetAutoSlide();

});

// ==============================
// START
// ==============================

startAutoSlide();


// ==============================
// SCROLL TO TOP
// ==============================

window.addEventListener("load", () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 10);
});

// =========================================
// INTRO ANIMATION
// =========================================

const introTL = gsap.timeline();

// Ball comes from top-left
introTL.to(".redRound", {
  top: "40%",
  left: "45%",
  duration: 1.8,
  ease: "bounce.out"
});

// Extra bounce
introTL.to(".redRound", {
  y: -40,
  duration: 0.25,
  repeat: 2,
  yoyo: true,
  ease: "power1.inOut"
});

introTL.to(".redRound", {
  borderRadius: 0,
  scaleX: 4,
  duration: 1,
  ease: "power4.inOut",
})

introTL.to(".redRound", {
  scaleX: 30,
  scaleY: 30,
  duration: 1,
  ease: "back",
  transformOrigin: "center center"
}, '>')

introTL.to(".site-loading", {
  display: 'none',
  ease: "power4.inOut",
}, '<-0.3')

introTL.to('body', {
  overflow: 'auto',
})

// =========================================
// Hero Text EFFECT
// =========================================

const words1 = [
  "Workouts",
  "Strength",
  "Recovery"
];

const words2 = [
  "Life",
  "Body",
  "Journey"
];

const el1 = document.querySelector(".moving-text");
const el2 = document.querySelector(".moving-text-2");

let index = 0;


// initial text
el1.textContent = words1[0];
el2.textContent = words2[0];


function changeWords() {

  index = (index + 1) % words1.length;

  const tl = gsap.timeline();

  // animate OUT
  tl.to([el1, el2], {
    y: -80,
    opacity: 0,
    filter: "blur(10px)",
    duration: 0.5,
    stagger: 0.05,
    ease: "power3.in"
  });

  // update text
  tl.call(() => {
    el1.textContent = words1[index];
    el2.textContent = words2[index];
  });

  // prepare next state
  tl.set([el1, el2], {
    y: 80,
    opacity: 0,
    filter: "blur(10px)"
  });

  // animate IN
  tl.to([el1, el2], {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    duration: 0.8,
    stagger: 0.05,
    ease: "expo.out"
  });

}


// auto loop
gsap.timeline({
  repeat: -1,
  repeatDelay: 2
})
  .to({}, {
    duration: 2,
    onComplete: changeWords
  });


// =========================================
// Net Canvas
// =========================================

const canvas = document.getElementById("meshCanvas");
const ctx = canvas.getContext("2d");

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

const mouse = {
  x: w / 2,
  y: h / 2
};

window.addEventListener("resize", () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

window.addEventListener("mousemove", e => {

  gsap.to(mouse, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.6,
    ease: "power3.out"
  });

});


// ======================================
// GRID
// ======================================

const spacing = 60;
const cols = Math.ceil(w / spacing) + 2;
const rows = Math.ceil(h / spacing) + 2;

let time = 0;


// ======================================
// DRAW
// ======================================

function render() {

  ctx.clearRect(0, 0, w, h);

  ctx.lineWidth = 1;

  for (let y = 0; y < rows; y++) {

    ctx.beginPath();

    for (let x = 0; x < cols; x++) {

      const px = x * spacing;
      const py = y * spacing;

      // wave motion
      const waveX =
        Math.sin((y * 0.5) + time) * 12;

      const waveY =
        Math.cos((x * 0.5) + time) * 12;


      // mouse distortion
      const dx = px - mouse.x;
      const dy = py - mouse.y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      let distortion = 0;

      if (dist < 250) {

        distortion =
          (1 - dist / 250) * 40;

      }

      const angle =
        Math.atan2(dy, dx);

      const mx =
        Math.cos(angle) * distortion;

      const my =
        Math.sin(angle) * distortion;

      const finalX =
        px + waveX + mx;

      const finalY =
        py + waveY + my;


      if (x === 0) {

        ctx.moveTo(finalX, finalY);

      } else {

        ctx.lineTo(finalX, finalY);

      }

    }

    ctx.strokeStyle =
      "rgba(255,255,255,0.08)";

    ctx.stroke();

  }


  // vertical lines
  for (let x = 0; x < cols; x++) {

    ctx.beginPath();

    for (let y = 0; y < rows; y++) {

      const px = x * spacing;
      const py = y * spacing;

      const waveX =
        Math.sin((y * 0.5) + time) * 12;

      const waveY =
        Math.cos((x * 0.5) + time) * 12;

      const dx = px - mouse.x;
      const dy = py - mouse.y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      let distortion = 0;

      if (dist < 250) {

        distortion =
          (1 - dist / 250) * 40;

      }

      const angle =
        Math.atan2(dy, dx);

      const mx =
        Math.cos(angle) * distortion;

      const my =
        Math.sin(angle) * distortion;

      const finalX =
        px + waveX + mx;

      const finalY =
        py + waveY + my;

      if (y === 0) {

        ctx.moveTo(finalX, finalY);

      } else {

        ctx.lineTo(finalX, finalY);

      }

    }

    ctx.strokeStyle =
      "rgba(255,255,255,0.08)";

    ctx.stroke();

  }


  time += 0.01;

  requestAnimationFrame(render);

}

render();

gsap.to("#meshCanvas", {
  rotate: 1.5,
  duration: 18,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  transformOrigin: "center center"
});



/* ================================
   Why IronPlus Section Animation
================================ */
let mm = gsap.matchMedia();

mm.add("(min-width: 1025px)", () => {

  /* ================================
     TIMELINE + SCROLLTRIGGER
  ================================= */
  const whyTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".why-ironplus-wrapper",
      start: "top top",
      end: "+=6000",
      scrub: 1,
      pin: ".why-pin-container"
    }
  });

  /* ================================
     INITIAL STATES
  ================================= */
  gsap.set("#whyContent2, #whyContent3, #whyContent4", {
    opacity: 0,
    scale: 0
  });

  /* ================================
     PHASE 1 → PHASE 2
  ================================= */

  whyTl.to(".why-ironplus-images", {
    left: "0%",
    duration: 1,
    ease: "power2.inOut"
  }, "transition1");

  whyTl.to("#whyContent1", {
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    ease: "power2.in"
  }, "transition1");

  whyTl.fromTo("#whyContent2",
    {
      top: "50%",
      left: "50%",
      opacity: 0,
      scale: 0.8
    },
    {
      top: "0",
      left: "50%",
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.inOut"
    },
    "transition1"
  );

  /* ================================
     PHASE 3 → IMAGE REVEAL
  ================================= */
  whyTl.to("#whyimg2", {
    clipPath: "inset(0% 0% 0% 0%)",
    duration: 1,
    ease: "none"
  }, "reveal1");

  /* ================================
    PHASE 4 → PHASE 3 TRANSITION
 ================================= */
  whyTl.to(".why-ironplus-images", {
    left: "50%",
    duration: 1,
    ease: "power2.inOut"
  }, "transition2");

  whyTl.to("#whyContent2", {
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    ease: "power1.in"
  }, "transition2");

  whyTl.fromTo("#whyContent3",
    {
      top: "100%",
      left: "0%",
      opacity: 0,
      scale: 0.8
    },
    {
      top: "0",
      left: "0%",
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.inOut"
    },
    "transition2"
  );

  /* ================================
     IMAGE 3 REVEAL
  ================================= */
  whyTl.to("#whyimg3", {
    clipPath: "inset(0% 0% 0% 0%)",
    duration: 1,
    ease: "none"
  }, "reveal2");

  /* ================================
     PHASE 5 → PHASE 4 TRANSITION
  ================================= */

  whyTl.to(".why-ironplus-images", {
    left: "0",
    duration: 1,
    ease: "power2.inOut"
  }, "transition3");

  whyTl.to("#whyContent3", {
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    ease: "power1.in"
  }, "transition3");

  whyTl.fromTo("#whyContent4",
    {
      top: "100%",
      left: "50%",
      opacity: 0,
      scale: 0.8
    },
    {
      top: "0%",
      left: "50%",
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.inOut"
    },
    "transition3"
  );

  /* ================================
     IMAGE 4 REVEAL
  ================================= */
  whyTl.to("#whyimg4", {
    clipPath: "inset(0% 0% 0% 0%)",
    duration: 1,
    ease: "none"
  }, "reveal3");

  whyTl.to({}, { duration: .5 });

  /* ================================
     CLEANUP (OPTIONAL)
  ================================= */
  return () => {
    // GSAP auto cleanup handles most things
  };

});

/* ================================
 Overflow Second Section on Hero
================================= */

const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".site-hero",
    start: "top top",
    end: "bottom top",
    pin: ".site-hero-sticky",
    pinSpacing: false,
    anticipatePin: 1
  }
})


/* ================================
 Heading Style
================================= */

// const headingTl = gsap.timeline({
//   scrollTrigger: {
//     trigger: ".heading-block",
//     start: "-=500",
//     end: "bottom top",
//     scrub: 1
//   }
// });

// headingTl.fromTo(".heading-block h2", {
//   y: 50,
//   opacity: 0
// }, {
//   y: 0,
//   opacity: 1,
//   duration: 1,
//   ease: "power2.out"
// });
  
// headingTl.fromTo(".heading-block p", {
//   y: 50,
//   opacity: 0
// }, {
//   y: 0,
//   opacity: 1,
//   duration: 1,
//   ease: "power2.out"
// }, "-=0.5");  


/* ================================
 Product Scrolling
================================= */

let productMM = gsap.matchMedia();

productMM.add("(min-width: 1025px)", () => {
  const productcontainer = document.querySelector(".siteproduct-container");
  const productSections = gsap.utils.toArray(".site-product-container");

  // total horizontal movement
  const totalScroll =
    productcontainer.scrollWidth - window.innerWidth + 200;

  const productTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".site-products-inr",
      start: "top top",
      end: `+=${totalScroll}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });  

  productTL.to(productcontainer, {
    x: -totalScroll,
    ease: "none"
  })

})


/* ================================
 Tesimonials Scrolling
================================= */


const testimoanlContainer = document.querySelector(".all-testimonails");
const singleTestimonail = gsap.utils.toArray(".t-wrap");

// total horizontal movement
const txTotalScroll =
  testimoanlContainer.scrollWidth - window.innerWidth + 200;

const testimonialsTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".all-testimonails",
    start: "top top",
    end: `+=${txTotalScroll}`,
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  }
});  

testimonialsTL.to(singleTestimonail, {
  x: -txTotalScroll,
  ease: "none"
})


/* ================================
 CTA Scrolling
================================= */


const ctaTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".newslatter-section",
    start: "-=30%",
    end: "bottom bottom",
    scrub: 1
  }
});

ctaTL.from('.newslatter-content h2', {
  x: 50,
  opacity:0,
  ease: "back",
  duration:.7
})

ctaTL.from('.newslatter-content .eyebrow', {
  x: -50,
  opacity:0,
  ease: "back",
  duration:.7
}, '<')

ctaTL.from('.newslatter-content p', {
  y:50,
  opacity:0,
  ease: "back",
  duration:.7
})

ctaTL.from('.newslatter-content .button', {
  opacity:0,
  ease: "back",
  duration:.7
})

ctaTL.from('.newslatter-model', {
  scale:0,
  transformOrigin:'center',
  ease: "back",
  duration:1
}, .5)


ctaTL.from('.newslatter-products img', {
  scale:0,
  transformOrigin:'center',
  ease: "back",
  duration:1,
  stagger:.5
}, .5)





