const canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 700;
const ctx = canvas.getContext("2d");

class b2Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Player {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.width = 50;
    this.height = 50;
    this.position = new b2Vec2(400, 100);
    this.velocity = new b2Vec2(0, 4);
    this.static = false;
    this.quoficiente = 1;
    this.draw();
    document.addEventListener("keydown", this.keydown.bind(this));
    document.addEventListener("keyup", this.keyup.bind(this));
  }
  keydown(event) {
    let key = event.key;
    console.log(key);
    if (key === "ArrowUp" || key === "w") {
      this.up = true;
      this.down = false;
      this.velocity.y = -11;
    } else if (key === "ArrowLeft" || key === "a") {
      this.left = true;
      this.right = false;
    } else if (key === "ArrowRight" || key === "d") {
      this.left = false;
      this.right = true;
    }
  }
  keyup(event) {
    let key = event.key;
    if (key === "ArrowUp" || key === "w") {
      this.up = false;
    } else if (key === "ArrowLeft" || key === "a") {
      this.left = false;
    } else if (key === "ArrowRight" || key === "d") {
      this.right = false;
    }
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.position.x, this.position.y);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }
  update() {
    this.draw();
    if (this.left) {
      this.velocity.x = -6;
    } else if (this.right) {
      this.velocity.x = 6;
    }
  }
}

class Body {
  constructor(x, y, width, height, s = true) {
    this.width = width;
    this.height = height;
    this.position = new b2Vec2(x,y);
    this.velocity = new b2Vec2(0, 0);
    this.static = s;
    this.quoficiente = 0.7;
    this.draw();
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.position.x, this.position.y);
    ctx.fillStyle = "brown";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }
  update() {
    this.draw();
  }
}

class World {
  constructor() {
    this.objectsList = [];
    this.gravity = 1;
  }
  createObject(object) {
    this.objectsList.push(object);
  }
  applyPhysic() {
    for (let objeto of this.objectsList) {
      if (!objeto.static) {
        objeto.velocity.y += 1;

        for (let yy = Math.abs(objeto.velocity.y); yy > 0; yy--) {
          const continuar = true;

          for (let body of this.objectsList) {
            if (body !== objeto) {
              if (objeto.velocity.y > 0) {
                if (
                  objeto.position.y + objeto.height + 1 > body.position.y &&
                  objeto.position.y <= body.position.y + body.height / 2 &&
                  objeto.position.x >= body.position.x &&
                  objeto.position.x <= body.position.x + body.width
                ) {
                  objeto.velocity.y = -(objeto.velocity.y * 0.2);
                  objeto.velocity.x = (objeto.velocity.x * objeto.quoficiente) * body.quoficiente;
                }
              }
              if (objeto.velocity.y < 0) {
                if (
                  objeto.position.y - 1 < body.position.y + body.height &&
                  objeto.position.y >= body.position.y - body.height / 2 &&
                  objeto.position.x >= body.position.x &&
                  objeto.position.x <= body.position.x + body.width
                ) {
                  objeto.velocity.y = -(objeto.velocity.y * 0.2);
                  objeto.velocity.x = (objeto.velocity.x * objeto.quoficiente) * body.quoficiente;
                }
              }
            }
          }

          if (Math.abs(objeto.velocity.y) > 1) {
            if (objeto.velocity.y > 0) {
              objeto.position.y += 1;
            } else if (objeto.velocity.y < 0) {
                objeto.position.y -= 1;
            }
          }
        }

        objeto.position.x += objeto.velocity.x;

        if (objeto.position.y >= 650) {
          objeto.velocity.x *= 0.9;
          objeto.position.y = 650;
          objeto.velocity.y *= -0.2;
        }
      }
      objeto.update();
    }
  }
  drawWorld() {}
}

const world = new World();
world.createObject(new Player());
world.createObject(new Body(20, 650, 200, 40));
world.createObject(new Body(60, 400, 400, 5, false));
world.createObject(new Body(20, 650, 200, 40));

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  world.applyPhysic();
  requestAnimationFrame(animate);
}

animate();
