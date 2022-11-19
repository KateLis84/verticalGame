class Sprite{
    constructor({position, imageSrc, frameRate = 1, frameBuffer = 5, scale=1}){
        this.position = position;
        this.scale = 1;
        this.loaded = false;
        this.image = new Image();
        this.image.src = imageSrc;
        this.image.onload = ()=>{
            this.width = (this.image.width / this.frameRate) * scale
            this.height = this.image.height * scale
            this.loaded = true;
        }
        this.frameRate = frameRate
        this.currentFrame = 0;
        this.frameBuffer = frameBuffer;
        this.elapsedFrame = 0;
    }

    draw(){
        if(!this.image) return;
        const cropbox = {
            position: {
                x: this.currentFrame * (this.image.width / this.frameRate), 
                y: 0
            },
            width: this.image.width / this.frameRate,
            height: this.image.height
        }

        c.drawImage(
          this.image,
          cropbox.position.x,
          cropbox.position.y,
          cropbox.width,
          cropbox.height,
          this.position.x,
          this.position.y,
          this.width,
          this.height
        );
    }

    update(){
        this.draw();
        this.updateFrames();
    }

    updateFrames(){
        this.elapsedFrame++;
        
        if(this.elapsedFrame%this.frameBuffer === 0){
            if(this.currentFrame < this.frameRate - 1) this.currentFrame++;
            else this.currentFrame = 0;
        }
    }
}