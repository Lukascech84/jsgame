//Vytvoření classy pro hráče

class Player extends Sprite {
    constructor({
        position,
        collisionBlocks,
        platformCollisionBlocks,
        imageSrc,
        frameRate,
        scale = 0.5,
        animations,
        loop
    }) {
        super({
            imageSrc,
            frameRate,
            scale
        }); 
        //Nastavení základních proměnných, statistik, hitboxů, atd... hráče
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1,
        }

        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = platformCollisionBlocks;
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 10,
            height: 10
        }

        this.Attack1Hitbox = {
            right: {
            position: {
                x: this.hitbox.position.x,
                y: this.hitbox.position.y
            },
            width: 40,
            height: this.hitbox.height
        },
            left: {
                position: {
                    x: this.hitbox.position.x + this.hitbox.width/1.35,
                    y: this.hitbox.position.y
                },
                width: -40,
                height: this.hitbox.height
            }
            }

        this.animations = animations;
        this.lastDirection = 'right';

        for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;

            this.animations[key].image = image;
        }
        this.camerabox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        }
    }

    //Měnění animací
    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return

        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;
        this.loop = this.animations[key].loop;
        this.currentAnimation = this.animations[key];
    }

    updateCamerabox() {
        this.camerabox = {
            position: {
                x: this.position.x - this.camerabox.width / 3 + this.hitbox.width / 2,
                y: this.position.y - this.hitbox.height / 2,
            },
            width: canvas.width/5,
            height: canvas.height/5,
        }
    }

    checkForHorizontalCanvasCollision() {
        if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= background.width || this.hitbox.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0;
        }
    }

    shouldPanCameraToTheLeft({
        canvas,
        camera
    }) {
        const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;

        if (cameraboxRightSide >= background.width) return

        if (cameraboxRightSide >= scaledCanvas.width + Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x;
        }
    }

    shouldPanCameraToTheRight({
        canvas,
        camera
    }) {
        if (this.camerabox.position.x <= 0) return

        if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x;
        }
    }

    shouldPanCameraToTheDown({
        canvas,
        camera
    }) {
        if (this.camerabox.position.y + this.velocity.y <= 0) return

        if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y;
        }
    }

    shouldPanCameraToTheUp({
        canvas,
        camera
    }) {
        if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 432) return

        if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaledCanvas.height) {
            camera.position.y -= this.velocity.y;
        }
    }

    jumpResseting() {
        if (isGrounded) {
            if (jumps != 0) jumps = 0;
        }
    }

    numberOfJumps() {
        c.fillStyle = 'rgba(255, 255, 255, 1)';
        c.fillText(Math.abs(jumps - 2), Math.abs(camera.position.x) + 230, Math.abs(camera.position.y) + 20);
    }

    minimapMovement() {
        minimap.position.x = Math.abs(camera.position.x) - 162;
        minimap.position.y = Math.abs(camera.position.y) - 145;
    }

    minimapCharacterMovement() {
        minimapCharacter.position.x = player.hitbox.position.x / 4 + 52 + Math.abs(camera.position.x);
        minimapCharacter.position.y = player.hitbox.position.y / 4 + 17 + Math.abs(camera.position.y);
    }

    //Stará se o vstupy a co s nimi udělat
    handleInput(keys) {
        if (this.preventInput) return
        this.velocity.x = 0;
        if (keys.right.pressed) {
            this.switchSprite('Run');
            this.velocity.x = 2;
            this.lastDirection = 'right';
            this.shouldPanCameraToTheLeft({
                canvas,
                camera
            });
        } else if (keys.left.pressed) {
            this.switchSprite('RunLeft');
            this.velocity.x = -2;
            this.lastDirection = 'left';
            this.shouldPanCameraToTheRight({
                canvas,
                camera
            });
        } else {
            if (this.lastDirection === 'right') this.switchSprite('Idle');
            else this.switchSprite('IdleLeft')
        }
    }

    //Funkce pro útok
    attack(){
        if(isAttacking && (keys.right.pressed || keys.left.pressed) && this.velocity.y === 0){
            this.velocity.x = 0;
            if(this.lastDirection === 'right') this.switchSprite('Attack1');
            else this.switchSprite('Attack1Left');
            this.preventInput = true;
            return;
        }
    }

    attack1HitboxRendering(){
        if(isAttacking){
        c.fillStyle = 'rgba(255, 0, 0, 0.25)';
        if(this.lastDirection === 'right') c.fillRect(this.Attack1Hitbox.right.position.x,this.Attack1Hitbox.right.position.y, this.Attack1Hitbox.right.width, this.Attack1Hitbox.right.height);
        else c.fillRect(this.Attack1Hitbox.left.position.x,this.Attack1Hitbox.left.position.y, this.Attack1Hitbox.left.width, this.Attack1Hitbox.left.height);
        }
    }


    update() {
        //this.attack1HitboxRendering();
        this.attack();
        this.minimapCharacterMovement();
        this.minimapMovement();
        this.numberOfJumps();
        this.jumpResseting();
        this.updateFrames();
        this.updateHitbox();
        this.updateCamerabox();
       /*
                //Camerabox
                c.fillStyle = 'rgba(0, 0, 255, 0.25)';
                c.fillRect(this.camerabox.position.x,this.camerabox.position.y, this.camerabox.width, this.camerabox.height);
                //Celý hráč
                c.fillStyle = 'rgba(0, 255, 0, 0.25)';
                c.fillRect(this.position.x,this.position.y, this.width, this.height);
                //Hitbox
                c.fillStyle = 'rgba(255, 0, 0, 0.25)';
                c.fillRect(this.hitbox.position.x,this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
        */

        this.draw();

        this.position.x += this.velocity.x;
        this.updateHitbox();
        this.checkForHorizontalCollisions();
        this.applyGravity();
        this.updateHitbox();
        this.updateAttack1Hitbox();
        this.checkForVerticalCollisions();
    }
    //Updatování hitboxů
    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 35,
                y: this.position.y + 26
            },
            width: 14,
            height: 27
        }
    }

    updateAttack1Hitbox() {
        this.Attack1Hitbox = {
            right: {
                position: {
                    x: this.hitbox.position.x,
                    y: this.hitbox.position.y
                },
                width: 40,
                height: this.hitbox.height
            },
                left: {
                    position: {
                        x: this.hitbox.position.x + this.hitbox.width/1.35,
                        y: this.hitbox.position.y
                    },
                    width: -40,
                    height: this.hitbox.height
                }
    }
}
    //Hlídání horizontálních, vertikálních a platformových kolizí 
    checkForHorizontalCollisions() {
        for (let i = 0; i < Object.keys(this.collisionBlocks).length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock
                })
            ) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0;

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;

                    this.position.x = collisionBlock.position.x - offset - 0.01;
                    break;
                }
                if (this.velocity.x < 0) {
                    this.velocity.x = 0;

                    const offset = this.hitbox.position.x - this.position.x;

                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                    break;
                }
            }
        }
    }

    applyGravity() {
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
    }

    checkForVerticalCollisions() {

        for (let i = 0; i < Object.keys(this.collisionBlocks).length; i++) {
            const collisionBlock = this.collisionBlocks[i];

            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock
                })
            ) {
                if (this.velocity.y > 0) {
                    isGrounded = true;
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                    this.position.y = collisionBlock.position.y - offset - 0.01;
                    break;
                }
                if (this.velocity.y < 0) {
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y;
                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                    break;
                }
            }
        }

        //platformy
        for (let i = 0; i < Object.keys(this.platformCollisionBlocks).length; i++) {

            const platformCollisionBlock = this.platformCollisionBlocks[i];
            if (

                platformCollision({
                    object1: this.hitbox,
                    object2: platformCollisionBlock
                })
            ) {
                if (this.velocity.y > 0) {

                    if (!keys.down.pressed) {
                        isGrounded = true;
                        this.velocity.y = 0;
                        const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                        this.position.y = platformCollisionBlock.position.y - offset - 0.01;
                        break;
                    }
                }
            }
        }
    }
}
