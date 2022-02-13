class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, value, position) {
    super(scene, 0, 0, "card");
    this.scene = scene;
    this.value = value;
    this.scene.add.existing(this);
    this.setInteractive();
    this.opened = false;
    // this.flip();
  }

  flip() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      easy: "Linear",
      duration: 150,
      onComplete: () => this.show(),
    });
  }

  show() {
    let texture = this.opened ? `card${this.value}` : "card";
    this.setTexture(texture);

    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      easy: "Linear",
      duration: 150,
    });
  }

  open() {
    this.opened = true;
    this.flip();
  }

  close() {
    if (this.opened) {
      this.opened = false;
      this.flip();
    }
  }
}
