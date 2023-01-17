class Sprite {
    constructor({
        position,
        imageSrc,
        frameRate = 1,
        frameBuffer = 8,
        scale = 1,
        loop = true,
        autoplay = true,
        animations
    }) {
        this.position = position;
        this.scale = scale;
        this.loaded = false;
        this.image = new Image();
        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate) * this.scale;
            this.height = this.image.height * this.scale;
            this.loaded = true;
        }
        this.image.src = imageSrc;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.frameBuffer = frameBuffer;
        this.elapsedFrames = 0;
        this.loop = loop;
        this.autoplay = autoplay;
        this.animations = animations;
        this.currentAnimation;

        if (this.animations) {
            for (let key in this.animations) {
                const image = new Image();
                image.src = this.animations[key].imageSrc
                this.animations[key].image = image;
            }
        }
    }

    draw() {
        if (!this.image) return;

        const cropbox = {
            position: {
                x: this.currentFrame * (this.image.width / this.frameRate),
                y: 0,
            },
            width: this.image.width / this.frameRate,
            height: this.image.height,
        }

        c.drawImage(this.image, cropbox.position.x, cropbox.position.y, cropbox.width, cropbox.height, this.position.x, this.position.y, this.width, this.height);

        this.updateFrames();
    }

    update() {
        this.draw();
    }

    play() {
        this.autoplay = true;
    }

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return

        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;
        this.loop = this.animations[key].loop;
    }

    updateFrames() {
        if (!this.autoplay) return

        this.elapsedFrames++;

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
            else if (this.loop) this.currentFrame = 0;
        }

        if(this.currentAnimation?.onComplete){
            if (this.currentFrame === this.frameRate - 1 && !this.currentAnimation.isActive){
            this.currentAnimation.onComplete(); 
            this.currentAnimation.isActive = true;
            }
            
        }
    }
}