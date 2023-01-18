class StaticTarget {
    constructor({
        position,
        imageSrc,
        scale = 1,
    }) {
        this.position = position;
        this.scale = scale;
        this.loaded = false;
        this.image = new Image();
        this.image.onload = () => {
            this.width = this.image.width * this.scale;
            this.height = this.image.height * this.scale;
            this.loaded = true;
        }
        this.image.src = imageSrc;
    }

    draw() {
        if (!this.image) return;
        c.drawImage(this.image, this.position.x, this.position.y);
        //c.fillStyle = 'rgba(255, 0, 0, 0.5)';
        //c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.checkingForHits();
    }

    checkingForHits() {
        window.addEventListener('mousedown', (event) => {
            if (
                staticTargetsCollisionRight({
                    a: player.Attack1Hitbox.right,
                    b: this,
                }) && player.lastDirection === 'right') {
                console.log('hitright');
                setTimeout(() => {
                    this.image.src = './img/StaticTarget/DummyHitted.png';
                }, 250);
                setTimeout(() => {
                    this.image.src = './img/StaticTarget/DummyRed.png';
                }, 500);
                return;
            } else if (staticTargetsCollisionLeft({
                    a: player.Attack1Hitbox.left,
                    b: this,
                }) && player.lastDirection === 'left') {
                console.log('hitleft');
                setTimeout(() => {
                    this.image.src = './img/StaticTarget/DummyHitted.png';
                }, 250);
                setTimeout(() => {
                    this.image.src = './img/StaticTarget/DummyRed.png';
                }, 500);
                return;
            } else console.log('nohit');
        })
    }
}