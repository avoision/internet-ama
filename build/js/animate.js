var allowAnimation = true

animate = function() {
  allowAnimation = true
  
  var canvas = document.getElementById('canvas')

  var c = canvas.getContext("2d"),
      radiusGrowthFactor = 4.3,
      alphaDimFactor = 0.009,
      colorFactor = 0.00005,

      particlesObj = {},
      particleIndex = 0,

      colorMaxPos = 360,
      colorMinPos = 0,
      colorPos = randomize(0, colorMaxPos)

  function setWidthHeight() {
    canvas.width = window.innerWidth
    var cHeight = 300

    if (window.innerHeight > window.innerWidth) {
     // alert("You are now in portrait");
    } else {
      // alert("You are now in landscape");
      if (window.innerWidth <= 667) {
        cHeight = 200
      }
    }
    canvas.height = cHeight
  }

  // Utility
  function randomize(min, max) {
    return Math.floor(Math.random() * (max - min) + 1) + min
  }

  function getColor() {
    colorPos += colorFactor

    if ((colorPos > colorMaxPos) || (colorPos < colorMinPos)) {
      colorFactor *= -1
    }
    return Math.floor(colorPos)
  }

  function clearCanvas() {
    c.globalCompositeOperation = 'destination-out'
    c.color = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.globalCompositeOperation = 'lighter'
  }

  // Particle
  function Particle() {
    // ID
    particleIndex++
    particlesObj[particleIndex] = this
    this.id = particleIndex

    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height

    this.radius = 1
    this.alpha = 1
  }

  Particle.prototype.grow = function() {
    this.radius += radiusGrowthFactor
    this.alpha -= alphaDimFactor

    c.beginPath()
    // c.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    // ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    c.arc(this.x, this.y, this.radius, 0, (Math.PI*2))
    c.fillStyle = `hsla(${getColor()}, 73%, 1%, ${this.alpha})`
    c.fill()

    if (this.alpha <= 0) {
      delete particlesObj[this.id]
    }
  }

  function smoke() {
    clearCanvas()
    if (allowAnimation) {
      var chance = Math.ceil(Math.random() * 100)
      // if ((chance % 2) === 0) {
      if (chance >= 37) {
        new Particle()
      }

      for (var j in particlesObj) {
        particlesObj[j].grow()
      }
      window.requestAnimationFrame(smoke)  
    }    
  }

  var timeout
  window.addEventListener('resize', function() {
    clearTimeout(timeout)
    timeout = setTimeout(setWidthHeight, 200)
  })

  setWidthHeight()
  smoke()
}

stopAnimation = function() {
  allowAnimation = false
}
