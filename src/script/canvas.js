const Particles = {
    setup() {
 
      const canvas = document.getElementById("canvas");
      canvas.width = window.innerWidth * 0.988;
      canvas.height = window.innerHeight;
      this.canvas = canvas;
      document.body.appendChild(canvas);
      this.ctx = this.canvas.getContext("2d");
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.dataToImageRatio = 1;
      this.ctx.imageSmoothingEnabled = false;
  
      this.xC = this.width / 2;
      this.yC = this.height / 2;
  
      this.stepCount = 0;
      this.particles = [];
      this.lifespan = 500;
      this.popPerBirth = 1;
      this.maxPop = 100;
      this.birthFreq = 2;
  
      // Build grid
      this.gridSize = 8;
      this.gridSteps = Math.floor(1000 / this.gridSize);
      this.grid = [];
      let i = 0;
      for (let xx = -500; xx < 500; xx += this.gridSize) {
        for (let yy = -500; yy < 500; yy += this.gridSize) {
          const r = Math.sqrt(xx ** 2 + yy ** 2),
            r0 = 100;
  
          const field = r < r0 ? (255 / r0) * r : 255 - Math.min(255, (r - r0) / 2);
  
          this.grid.push({
            x: xx,
            y: yy,
            busyAge: 0,
            spotIndex: i,
            isEdge:
              xx === -500
                ? "left"
                : xx === -500 + this.gridSize * (this.gridSteps - 1)
                ? "right"
                : yy === -500
                ? "top"
                : yy === -500 + this.gridSize * (this.gridSteps - 1)
                ? "bottom"
                : false,
            field,
          });
          i++;
        }
      }
      this.gridMaxIndex = i;
  
      this.drawnInLastFrame = 0;
      this.deathCount = 0;
  
      this.initDraw();
    },
  
    evolve() {
      this.stepCount++;
  
      this.grid.forEach((e) => {
        if (e.busyAge > 0) e.busyAge++;
      });
  
      if (this.stepCount % this.birthFreq === 0 && this.particles.length + this.popPerBirth < this.maxPop) {
        this.birth();
      }
      this.move();
      this.draw();
    },
  
    birth() {
        const gridSpotIndex = Math.floor(Math.random() * this.gridMaxIndex),
          gridSpot = this.grid[gridSpotIndex],
          { x, y } = gridSpot;
      
        // Randomly decide if this particle should be red
        const isRed = Math.random() < 0.1; // 10% chance for the particle to be red
      
        const particle = {
          hue: isRed ? Math.random() * 10 : 0, // Red hue for red particles, 0 for white
          sat: isRed ? 95 : 0, // High saturation for red, 0 for grayscale/white
          lum: isRed ? 30 + Math.random() * 20 : 80 + Math.random() * 10, // Adjust lightness for red and white
          x,
          y,
          xLast: x,
          yLast: y,
          xSpeed: 0,
          ySpeed: 0,
          age: 0,
          ageSinceStuck: 0,
          attractor: {
            oldIndex: gridSpotIndex,
            gridSpotIndex,
          },
          name: `seed-${Math.ceil(10000000 * Math.random())}`,
        };
      
        this.particles.push(particle);
      },
  
    kill(particleName) {
      this.particles = _.cloneDeep(_.reject(this.particles, (seed) => seed.name === particleName));
    },
  
    move() {
      for (const p of this.particles) {
        p.xLast = p.x;
        p.yLast = p.y;
  
        let index = p.attractor.gridSpotIndex,
          gridSpot = this.grid[index];
  
        if (Math.random() < 0.5) {
          if (!gridSpot.isEdge) {
            const topSpot = this.grid[index - 1],
              bottomSpot = this.grid[index + 1],
              leftSpot = this.grid[index - this.gridSteps],
              rightSpot = this.grid[index + this.gridSteps];
  
            const chaos = 30;
            const maxFieldSpot = _.maxBy([topSpot, bottomSpot, leftSpot, rightSpot], (e) => e.field + chaos * Math.random());
  
            const potentialNewGridSpot = maxFieldSpot;
            if (potentialNewGridSpot.busyAge === 0 || potentialNewGridSpot.busyAge > 15) {
              p.ageSinceStuck = 0;
              p.attractor.oldIndex = index;
              p.attractor.gridSpotIndex = potentialNewGridSpot.spotIndex;
              gridSpot = potentialNewGridSpot;
              gridSpot.busyAge = 1;
            } else {
              p.ageSinceStuck++;
            }
          } else {
            p.ageSinceStuck++;
          }
  
          if (p.ageSinceStuck === 10) this.kill(p.name);
        }
  
        const k = 8,
          visc = 0.4;
        const dx = p.x - gridSpot.x,
          dy = p.y - gridSpot.y,
          dist = Math.sqrt(dx ** 2 + dy ** 2);
  
        const xAcc = -k * dx,
          yAcc = -k * dy;
  
        p.xSpeed += xAcc;
        p.ySpeed += yAcc;
  
        p.xSpeed *= visc;
        p.ySpeed *= visc;
  
        p.speed = Math.sqrt(p.xSpeed ** 2 + p.ySpeed ** 2);
        p.dist = dist;
  
        p.x += 0.1 * p.xSpeed;
        p.y += 0.1 * p.ySpeed;
  
        p.age++;
  
        if (p.age > this.lifespan) {
          this.kill(p.name);
          this.deathCount++;
        }
      }
    },
  
    initDraw() {
      this.ctx.beginPath();
      this.ctx.rect(0, 0, this.width, this.height);
      this.ctx.fillStyle = "black";
      this.ctx.fill();
      this.ctx.closePath();
    },
  
    draw() {
        this.drawnInLastFrame = 0;
        if (!this.particles.length) return false;
      
        // Fade effect for the background
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Semi-transparent black
        this.ctx.fill();
        this.ctx.closePath();
      
        // Draw each particle
        for (const p of this.particles) {
          // Use the particle's color properties
          const h = p.hue,
            s = p.sat,
            l = p.lum,
            a = 1; // Full opacity
      
          const last = this.dataXYtoCanvasXY(p.xLast, p.yLast),
            now = this.dataXYtoCanvasXY(p.x, p.y);
      
          this.ctx.beginPath();
          this.ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
          this.ctx.moveTo(last.x, last.y);
          this.ctx.lineTo(now.x, now.y);
          this.ctx.stroke();
          this.drawnInLastFrame++;
        }
      },
  
    dataXYtoCanvasXY(x, y) {
      return {
        x: x * this.dataToImageRatio + this.width / 2,
        y: y * this.dataToImageRatio + this.height / 2,
      };
    },
  
    start() {
      this.setup();
      setInterval(() => this.evolve(), 1000 / 60);
    },
  };
  
  // RESIZE EVENT HANDLER
  const handleResize = () => {
    Particles.canvas.width = window.innerWidth* 0.988;
    Particles.canvas.height = window.innerHeight;
    Particles.width = Particles.canvas.width;
    Particles.height = Particles.canvas.height;
    Particles.xC = Particles.width / 2;
    Particles.yC = Particles.height / 2;
    Particles.initDraw();
  };
  
  // ADD EVENT LISTENER
  window.addEventListener("resize", handleResize);
  
  Particles.start();
  
  // Go to top button functionality
  const goToTopButton = document.getElementById('goToTop');
  
  // Show button when user scrolls down 100px
  window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
          goToTopButton.classList.add('visible');
      } else {
          goToTopButton.classList.remove('visible');
      }
  });
  
  // Smooth scroll to top when button is clicked
  goToTopButton.addEventListener('click', () => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
  