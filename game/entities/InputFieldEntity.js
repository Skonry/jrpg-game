import Entity from "./Entity";

export default class InputField extends Entity {
  constructor(x, y, width, height, sprite, description, validValue) {
    super(x, y, width, height);
    this.sprite = new Image();
    this.sprite.src = sprite;
    this.description = description;
    this.validValue = validValue;
    this.inputValue = '';
    this.goBackButton = new Button(40, 610, 160, 80, 'img/btn_back.png');
  }
  addCharacter(character) {
    this.inputValue += character;
    if (this.validValue === this.inputValue) {
      this.isActiv = false;
    }
  }
  removeCharacter(){
    this.inputValue = this.inputValue.slice(0, this.inputValue.length - 1);
  }
  draw(ctxHUD){
    ctxHUD.drawImage(this.sprite,this.x,this.y);
    ctxHUD.fillText(this.description,this.x+30,this.y+30);
    ctxHUD.save();
    ctxHUD.font = '35px Georgia';
    ctxHUD.fillStyle = 'rgb(0,0,0)';
    ctxHUD.fillText(this.inputValue,this.x+130,this.y+266);
    ctxHUD.restore();
    ctxHUD.drawImage(this.goBackButton.sprite,this.goBackButton.x,this.goBackButton.y);
  }
}
