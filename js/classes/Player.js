class Player extends Sprite {
  constructor({
    position,
    collisionBlocks,
    imageSrc,
    frameRate,
    scale = 0.5,
    animations,
    platformCollisionBlocks,
  }) {
    super({ imageSrc, frameRate, scale });
    this.position = position;
    this.velocity = { x: 0, y: 1 };
    this.height = 100 / 4;
    this.width = 100 / 4;
    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;
    this.hitBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    };
    this.animations = animations;
    this.lastDirection = "right";

    for (let key in animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;
      this.animations[key].image = image;
    }

    this.cameraBox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  updateHitBox() {
    this.hitBox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 26,
      },
      width: 13,
      height: 27,
    };
  }

  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return;

    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }

  checkForHorizontalCanvasCollision() {
    if (this.hitBox.position.x + this.hitBox.width + this.velocity.x >= 576 ||
        this.hitBox.position.x + this.velocity.x <= 0){
      this.velocity.x = 0
    }
  }

  updateCameraBox(){
    this.cameraBox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  shouldPanCameraToTheLeft({ canvas, camera }) {
    const cameraBoxRightSide = this.cameraBox.position.x + this.cameraBox.width
    const scaledDownCanvasWidth = canvas.width / 4

    if (cameraBoxRightSide >= 576) return

    if (
      cameraBoxRightSide >=
      scaledDownCanvasWidth + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x
    }
  }

  shouldPanCameraToTheRight({ canvas, camera }) {
    if (this.cameraBox.position.x <= 0) return

    if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x
    }
  }
  shouldPanCameraToTheDown({ canvas, camera }) {
    if (this.cameraBox.position.y + this.velocity.y <= 0) return
    if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y
    }
  }

  shouldPanCameraToTheUp({ canvas, camera }) {
    if (
      this.cameraBox.position.y + this.cameraBox.height + this.velocity.y <=
      0
    )
      return;
    if (this.cameraBox.position.y + this.cameraBox.height >= Math.abs(camera.position.y) +
        canvas.height/4) {
      camera.position.y -= this.velocity.y
    }
  }

  update() {
    this.updateFrames()
    this.updateHitBox()

    this.updateCameraBox()

    this.draw()

    this.position.x += this.velocity.x
    this.updateHitBox()
    this.checkForHorizontalCollision()
    this.applyGravity()
    this.updateHitBox()
    this.checkForVerticalCollision()
  }

  checkForHorizontalCollision() {
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      if (
        collision({
          object1: this.hitBox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset =
            this.hitBox.position.x - this.position.x + this.hitBox.width;

          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }
        if (this.velocity.x < 0) {
          this.velocity.x = 0;

          const offset = this.hitBox.position.x - this.position.x;

          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollision() {
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      if (
        collision({
          object1: this.hitBox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;

          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitBox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    // FOR PLATFORM COLLISION BLOCKS
    for (let i = 0; i < platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = platformCollisionBlocks[i];

      if (
        platformCollision({
          object1: this.hitBox,
          object2: platformCollisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;

          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}