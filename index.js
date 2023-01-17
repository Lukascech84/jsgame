const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;


let floorCollisionsVar = floorCollisionsL1;
let platformCollisionsVar = platformCollisionsL1;


let background;
let doors;
let goToLevel;


const floorCollisions2D = []
for (let i = 0; i < floorCollisionsVar.length; i += 36) {
    floorCollisions2D.push(floorCollisionsVar.slice(i, i + 36));
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            collisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                })
            )
        }
    })
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisionsVar.length; i += 36) {
    platformCollisions2D.push(platformCollisionsVar.slice(i, i + 36));
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                    height: 10,
                })
            )
        }
    })
})


const player = new Player({
    position: {
        x: 100,
        y: 300,
    },
    imageSrc: './img/warrior/Idle.png',
    frameRate: 8,
    loop: true,
    animations: {
        Idle: {
            imageSrc: './img/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 16,
            loop: true,
        },
        IdleLeft: {
            imageSrc: './img/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 16,
            loop: true,
        },
        Run: {
            imageSrc: './img/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 9,
            loop: true,
        },
        RunLeft: {
            imageSrc: './img/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 9,
            loop: true,
        },
        Jump: {
            imageSrc: './img/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 10,
            loop: true,
        },
        JumpLeft: {
            imageSrc: './img/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 10,
            loop: true,
        },
        Fall: {
            imageSrc: './img/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 10,
            loop: true,
        },
        FallLeft: {
            imageSrc: './img/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 10,
            loop: true,
        },
        EnteringDoors: {
            imageSrc: './img/warrior/EnteringDoors.png',
            frameRate: 8,
            frameBuffer: 10,
            loop: false,
            onComplete: () => {
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level = goToLevel;
                        levels[level].init();
                        player.switchSprite('Idle');
                        player.preventInput = false;
                        gsap.to(overlay, {
                            opacity: 0
                        })
                    }
                })
                return;
            },
        },
    }
});



let level = 1;
let levels = {
    1: {
        init: () => {
            floorCollisionsVar = floorCollisionsL1;
            platformCollisionsVar = platformCollisionsL1;
            player.collisionBlocks = collisionBlocks;
            player.platformCollisionBlocks = platformCollisionBlocks;
            if(player.currentAnimation) player.currentAnimation.isActive = false;
            player.position.x = 120;
            player.position.y = 350;
            goToLevel = 2;
            

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/backgroundL1.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 150,
                        y: 372
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 2,
                    scale: 0.25,
                    loop: false,
                    autoplay: false,
                    /*
                    animations: {
                        DoorOpen: {
                            imageSrc: './img/doorOpen.png',
                            frameRate: 5,
                            frameBuffer: 2,
                            loop: false,
                        }, 
                        DoorHighlight: {
                            imageSrc: './img/doorHighlight.png',
                            frameRate: 2,
                            frameBuffer: 1,
                            loop: false,
                            autoplay: false,
                        }, 
                    }
                    */
                })
            ]
        }
    },
    2: {
        init: () => {
            floorCollisionsVar = floorCollisionsL2;
            platformCollisionsVar = platformCollisionsL2;
            player.collisionBlocks = collisionBlocks;
            player.platformCollisionBlocks = platformCollisionBlocks;
            if(player.currentAnimation) player.currentAnimation.isActive = false;
            player.position.x = 170;
            player.position.y = 350;
            goToLevel = 1;

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: './img/backgroundL2.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 200,
                        y: 372
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 2,
                    scale: 0.25,
                    loop: false,
                    autoplay: false,
                    /*
                    animations: {
                        DoorOpen: {
                            imageSrc: './img/doorOpen.png',
                            frameRate: 5,
                            frameBuffer: 2,
                            loop: false,
                        }, 
                        DoorHighlight: {
                            imageSrc: './img/doorHighlight.png',
                            frameRate: 2,
                            frameBuffer: 1,
                            loop: false,
                            autoplay: false,
                        }, 
                    }
                    */
                })
            ]
        }
    }
}

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}


const left = 'a';
const right = 'd';
const down = 's';
const up = 'w';
const mapa = 'm';
const use = 'e';


const fps = 1000;


const gravity = 0.2;



let isGrounded = false;
let jumps = 0;

const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
    down: {
        pressed: false,
    },
    mapa: {
        pressed: false,
    },
    use: {
        pressed: false,
    },

}

const minimap = new Sprite({
    position: {
        x: player.position.x,
        y: player.position.y,
    },
    imageSrc: './img/minimap.png',
})

const minimapCharacter = new Sprite({
    position: {
        x: player.position.x - 14,
        y: player.position.y + 98.5,
    },
    imageSrc: './img/minimapCharacter.png',
    scale: 0.25,
})

const camera = {
    position: {
        x: 0,
        y: -432 + scaledCanvas.height,
    },
}

const overlay = {
    opacity: 0
}

function animate() {

    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / fps);

    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.save();
    c.scale(4, 4);
    c.translate(camera.position.x, camera.position.y);

    background.update();

    doors.forEach((door) => {
        door.draw();
    })

    /*

            if(collision({
                object1: player.hitbox,
                object2: doors[0]
            })){
                console.log("Highlight");
                doors[0].switchSprite('DoorHighlight');
                return;
            } else {
                doors[0].switchSprite('DoorOpen');
            }

    */

    collisionBlocks.forEach(CollisionBlock => {
        CollisionBlock.update();
    })

    platformCollisionBlocks.forEach(block => {
        block.update();
    })
    player.checkForHorizontalCanvasCollision();
    player.update();

    player.handleInput(keys);

    if (player.velocity.y < 0) {
        player.shouldPanCameraToTheDown({
            canvas,
            camera
        });
        if (player.lastDirection === 'right') {
            player.switchSprite('Jump');
        } else {
            player.switchSprite('JumpLeft');
        }
    } else if (player.velocity.y > 0) {
        player.shouldPanCameraToTheUp({
            canvas,
            camera
        });
        if (player.lastDirection === 'right') player.switchSprite('Fall');
        else player.switchSprite('FallLeft');
    }
    if (keys.mapa.pressed) {
        minimap.update();
        minimapCharacter.update();
    }
    c.restore();

    c.save()
    c.globalAlpha = overlay.opacity;
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.restore();
}
levels[level].init();
animate();

window.addEventListener('keydown', (event) => {
    if (player.preventInput) return
    switch (event.key) {

        case right:
            if (keys.mapa.pressed) return
            keys.right.pressed = true;
            break;

        case left:
            if (keys.mapa.pressed) return
            keys.left.pressed = true;
            break;

        case up:
            if (keys.mapa.pressed) return
            if (jumps < 2) {
                isGrounded = false;
                jumps++;
                player.velocity.y = -5;
            }
            break;

        case down:
            if (keys.mapa.pressed) return
            keys.down.pressed = true;
            break;

        case mapa:
            if (keys.left.pressed || keys.down.pressed || keys.right.pressed || player.velocity.y != 0) return
            keys.mapa.pressed = !keys.mapa.pressed;
            break;

        case use:
            for (let i = 0; i < doors.length; i++) {
                const door = doors[i];

                if (
                    doorCollision({
                        object1: player.hitbox,
                        object2: door,
                    })) {
                    player.velocity.x = 0;
                    player.velocity.y = 0;
                    player.preventInput = true;
                    player.switchSprite('EnteringDoors');
                    door.play();
                    return
                }
            }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {

        case right:
            keys.right.pressed = false;
            break;

        case left:
            keys.left.pressed = false;
            break;

        case down:
            keys.down.pressed = false;
            break;
    }
})