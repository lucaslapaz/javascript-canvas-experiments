const impulsoX = document.getElementById("impulso-x");
const impulsoY = document.getElementById("impulso-y");
const timelapse = document.getElementById("tempo");
const executarBtn = document.getElementById("executar-btn");
const posX = document.getElementById("posX");
const posY = document.getElementById("posY");
const canvas = document.getElementById("canvas");
canvas.width = 900;
canvas.height = 500;
const ctx = canvas.getContext("2d");
let lastTimelapse = 0;
let deltaTime = null;

class Linha {
  constructor(x, y, angular, variante, linear) {
    this.variante = variante;
    this.angular = angular;
    this.linear = linear;
    this.x = x;
    this.y = y;
    document.addEventListener("keydown", this.keydown.bind(this));
  }
  keydown(e) {
    let tecla = e.key;
    if (tecla === "w") {
      this.angular += 0.1;
    }
    if (tecla === "s") {
      this.angular -= 0.1;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    for (let x = 0; x < this.variante; x++) {
      ctx.lineTo(this.x + x, this.y - (this.angular * x + this.linear));
    }
    ctx.stroke();
  }
  update() {
    this.draw();
  }
}

class Parabola {
  constructor(x, y, velx, vely, gravidade) {
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.gravidade = gravidade;
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    this.calcularTrajetoria(); //f(x) = ax^2 + bx + c
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  calcularTrajetoria() {
    ctx.moveTo(this.x, this.y);
    for (let x = 1; x <= parseInt(timelapse.value, 10); x++) {
      let X = x / 1000;
      let posX = this.x + this.velx * X;
      //0.5 foi diminuido por causa da perda de precisão do framerate
      let posY = this.y + this.vely * X + this.gravidade * 0.498 * Math.pow(X, 2);
      ctx.lineTo(posX, posY);
    }
    
  }
  update() {
    this.draw();
  }
}

class Bola {
  constructor(x, y, raio) {
    this.x = x;
    this.y = y;
    this.raio = raio;
    this.massa = 10;
    this.pixelsPorMetro = 100;
    this.gravidade = 9.81 * this.pixelsPorMetro; // em pixels por segundo ao quadrado
    this.peso = this.massa * this.gravidade;
    this.velx = 0;
    this.vely = 0;
    this.actualTimelapse = lastTimelapse;
    this.time = 0;
    executarBtn.addEventListener(
      "mousedown",
      this.calcularTrajetoria.bind(this)
    );
  }
  aplicarImpulso(forcaX, forcaY) {
    let aceleracaoX = (forcaX / this.massa) * this.pixelsPorMetro;
    let aceleracaoY = (forcaY / this.massa) * this.pixelsPorMetro;
    this.vely = this.vely ? this.vely + aceleracaoY : 0 + aceleracaoY;
    this.velx = this.velx ? this.velx + aceleracaoX : 0 + aceleracaoX;
  }
  calcularTrajetoria() {
    this.actualTimelapse = lastTimelapse;
    this.x = parseInt(posX.value, 10);
    this.y = parseInt(posY.value, 10);
    this.velx = 0;
    this.vely = 0;
    this.aplicarImpulso(
      parseInt(impulsoX.value, 10),
      parseInt(impulsoY.value, 10)
    );
    const parabola = new Parabola(
      this.x,
      this.y,
      this.velx,
      this.vely,
      this.gravidade
    );
    listaObjetos[1] = parabola;
  }
  draw() {
    ctx.beginPath();
    this.drawInfo();
    ctx.fillStyle = "crimson";
    ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI);
    ctx.fill();
  }
  drawInfo() {
    ctx.font = "12px serif";
    ctx.fillText(`Vx: ${this.velx ? this.velx : 0}`, 10, 15);
    ctx.fillText(`Vy: ${this.vely ? this.vely : 0}`, 10, 35);
    ctx.fillText(`x: ${this.x ? this.x : 0}`, 10, 55);
    ctx.fillText(`y: ${this.y ? this.y : 0}`, 10, 75);
    ctx.fillText(`g: ${this.gravidade ? this.gravidade : 0}`, 10, 95);
    ctx.fillText(`Time: ${this.time ? this.time : 0}`, 10, 115);
  }
  update(deltaTime) {
    this.draw();

    if (lastTimelapse - this.actualTimelapse <= parseInt(timelapse.value, 10)) {
      this.time = lastTimelapse - this.actualTimelapse;
      this.x += this.velx * deltaTime;
      this.y += this.vely * deltaTime;
      this.vely += this.gravidade * deltaTime;
      //this.tempo = lastTimelapse;
    }
  }
}

const listaObjetos = [];
listaObjetos[2] = new Bola(parseInt(posX.value, 10), parseInt(posY.value, 10), 20);


function animate(currentTime) {
  deltaTime = (currentTime - lastTimelapse) / 1000;
  lastTimelapse = currentTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const objeto of listaObjetos) {
    if (objeto) {
      objeto.update(deltaTime);
    }
  }

  requestAnimationFrame(animate);
}

animate();
