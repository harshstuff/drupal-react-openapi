/**
 * get_random_delay
 * @param {*} min
 * @param {*} max
 */
function getRandomDelay(min, max) {
  min = parseFloat(min);
  max = parseFloat(max);
  var delay = Math.random() * (max - min) + min;
  return Math.round(delay / 0.1) * 0.1;
}

/**
 * checkVisible
 * @param {*} elm
 */
function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

/**
 * AnimateOnScroll
 * @param {*} context
 */
export const AnimateOnScroll = (context) => {
  // setup the intersection observer
  let observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // animate in
          let delay = getRandomDelay(0, 0.2);
          let timeline = new gsap.timeline();
          timeline.fromTo(
            entry.target,
            { opacity: 0, y: 100 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: delay,
            }
          );
          timeline.play();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  // first find all the aos elements and hide those that aren't presently on the screen
  context.querySelectorAll("[data-aos]").forEach((element) => {
    // if the element is not currently visible
    if (!checkVisible(element)) {
      element.style.opacity = 0;
      observer.observe(element);
    }
  });
};
