window.alert('Mover o quadrado usando as teclas W,A,S,D.')

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;
const ctx = canvas.getContext("2d");

window.addEventListener("resize", (e) => {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.8;
});

//classe pra criar um quadrado genérico
class Square {
  constructor(x, y, width, height) {
    this.velx = 0;
    this.vely = 0;
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotation = 0;
    this.draw();
    document.addEventListener("keydown", this.keydown.bind(this));
    document.addEventListener("keyup", this.keyup.bind(this));
  }
  keydown(e) {
    let tecla = e.key;
    if (tecla == "w") {
      this.up = true;
      this.down = false;
    } else if (tecla == "d") {
      this.right = true;
      this.left = false;
    } else if (tecla == "a") {
      this.left = true;
      this.right = false;
    } else if (tecla == "s") {
      this.down = true;
      this.up = false;
    }
  }
  keyup(e) {
    let tecla = e.key;
    if (tecla == "w") {
      this.up = false;
    } else if (tecla == "d") {
      this.right = false;
    } else if (tecla == "a") {
      this.left = false;
    } else if (tecla == "s") {
      this.down = false;
    }
  }

  recalcRotation() {
    return ((-90 + this.rotation) * Math.PI) / 180;
  }

  //função para desenhar o Square baseado nos valores atuais das propriedades
  draw() {
    //salva os valores atuais do ctx
    ctx.save();

    //move o ponto de referência do ctx pra posição do objeto
    ctx.translate(this.x + this.width / 2, this.y + this.height);
    //converte de graus pra radiano e define como valor de rotação do ctx
    ctx.rotate((this.rotation * Math.PI) / 180);

    //cria o quadrado principal
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillRect(0 - this.width / 2, 0 - this.height, this.width, this.height);

    //cria um outro quadrado de enfeite
    let winWidth = this.width * (80 / 100);
    let winHeight = this.height * (20 / 100);
    let winX = 0 - this.width / 2 + (this.width - winWidth) / 2;
    ctx.fillStyle = "crimson";
    ctx.fillRect(winX, 0 - this.height + 5, winWidth, winHeight);

    //restaura os valores anteriores do ctx;
    ctx.restore();

    //cria um texto mostrando a rotação atual
    ctx.fillStyle = "white";
    ctx.font = "20px serif";
    let tamanho = ctx.measureText(`Rotation: ${this.rotation}`);
    ctx.fillText(`Rotation: ${this.rotation}`, 0, 0 + 20);
    
    //libera o ctx
    ctx.restore();
  }
  update() {
    //renderiza o objeto
    this.draw();

    //sistema primitivo de velocidade
    this.x += this.velx;
    this.y += this.vely;

    //adiciona fricção às velocidades, multiplicando por 0.2
    this.velx *= 0.2;
    this.vely *= 0.2;

    //move o objeto pra frente baseado na rotação atual
    if (this.up) {
      //calcula o quanto irá mover na horizontal calculando o conseno da rotação
      let x = 1 * Math.cos(this.recalcRotation());
      //calcula o quanto irá mover na vertical calculando o seno da rotação
      let y = 1 * Math.sin(this.recalcRotation());
      this.velx = 2 * x;
      this.vely = 2 * y;
    }

    //move o objeto pra trás baseado na rotação atual
    if (this.down) {
      
      let x = 1 * Math.cos(this.recalcRotation());
      let y = 1 * Math.sin(this.recalcRotation());
      this.velx = -2 * x;
      this.vely = -2 * y;
    }

    //sistema primitivo pra rotacionar o objeto baseado na velocidade atual e na direação
    let rotate = 0;
    if (Math.abs(this.velx) >= Math.abs(this.vely)) {
      rotate = (Math.abs(this.velx) * 100) / 3;
    } else {
      rotate = (Math.abs(this.vely) * 100) / 3;
    }
    rotate = Math.round(rotate);
    rotate = 1 * (rotate / 100);

    if (this.left) {
      if (this.up) {
        this.rotation -= rotate;
      } else if (this.down) {
        this.rotation += rotate;
      }
    }

    if (this.right) {
      if (this.up) {
        this.rotation += rotate;
      } else if (this.down) {
        this.rotation -= rotate;
      }
    }
  }
}

let objectsList = [];
objectsList.push(new Square(100, 301, 70, 100));


//função que limpa o palco e atualiza os objetos
const animate = function () {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const obj of objectsList) {
    obj.update();
  }
  requestAnimationFrame(animate);
};

animate();
