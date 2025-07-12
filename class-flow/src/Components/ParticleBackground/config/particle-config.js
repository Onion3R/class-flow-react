function particleConfig(dark = false) {
  const particleColor = dark ? '#ffffff' : '#000000'

  return {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: particleColor },
      links: {
        color: particleColor,
        distance: 150,
        enable: true,
        opacity: 0.4,
        width: 1
      },
      shape: {
        type: 'circle',
        stroke: { width: 0, color: particleColor }
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: 'none',
        outMode: 'out',
        bounce: false
      },
      opacity: { value: 0.5 },
      size: { value: 3, random: true }
    },
    interactivity: {
      detectOn: 'canvas',
      events: {
        onhover: { enable: true, mode: 'repulse' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 400, links: { opacity: 1 } },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3
        },
        repulse: { distance: 200, duration: 0.4 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  }
}

export default particleConfig
