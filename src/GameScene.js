class GameScene extends Phaser.Scene {
  constructor() {
    super("Memory");
  }

  preload() {
    console.log("START preload");
    this.load.image("bg", "assets/sprites/bg.png");
    this.load.image("card", "assets/sprites/card.png");

    for (let cardNumber of config.cards) {
      this.load.image(
        `card${cardNumber}`,
        `assets/sprites/card${cardNumber}.png`
      );
    }

    this.load.audio("card", "assets/sounds/card.mp3");
    this.load.audio("theme", "assets/sounds/theme.mp3");
    this.load.audio("complete", "assets/sounds/complete.mp3");
    this.load.audio("success", "assets/sounds/success.mp3");
    this.load.audio("timeout", "assets/sounds/timeout.mp3");
  }

  create() {
    console.log("START create");
    this.timeout = config.timeout;
    this.createTimer();
    this.createSounds();
    this.createBackground();
    this.createText();
    this.createCards();
    this.start();
  }

  start() {
    console.log("START game");
    this.timeout = config.timeout;
    this.openCard = null;
    this.openCardsCount = 0;
    this.initCards();
    this.showCards();
  }

  onTimerTick() {
    this.timeoutText.setText(`Text: ${this.timeout}`);

    if (this.timeout <= 0) {
      this.start();
    } else {
      --this.timeout;
    }
  }

  createTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true,
    });
  }

  initCards() {
    const positions = this.getCardPositions();

    this.cards.forEach((card) => {
      card.init(positions.pop());
    });
  }

  showCards() {
    this.cards.forEach((card) => {
      card.move({
        x: card.position.x,
        y: card.position.y,
        delay: card.position.delay,
      });
    });
  }

  createSounds() {
    this.sounds = {
      card: this.sound.add("card"),
      theme: this.sound.add("theme"),
      complete: this.sound.add("complete"),
      success: this.sound.add("success"),
      timeout: this.sound.add("timeout"),
    };

    this.sounds.theme.play({
      volume: 0.1,
    });
  }

  createText() {
    this.timeoutText = this.add.text(10, 330, "", {
      font: "30px FuturaHandwritten",
      fill: "#fff",
    });
  }

  createBackground() {
    this.add.sprite(0, 0, "bg").setOrigin(0, 0);
  }

  createCards() {
    this.cards = [];
    const positions = this.getCardPositions();
    Phaser.Utils.Array.Shuffle(positions);

    for (let value of config.cards) {
      for (let i = 0; i < 2; i++) {
        this.cards.push(new Card(this, value, positions.pop()));
      }
    }

    this.input.on("gameobjectdown", this.onCardClicked, this);
  }

  onCardClicked(pointer, card) {
    if (card.opened) return false;

    this.sounds.card.play({ volume: 0.5 });

    const { openCard } = this;
    if (openCard) {
      if (openCard.value === card.value) {
        this.openCard = null;
        ++this.openCardsCount;
      } else {
        this.openCard.close();
        this.openCard = card;
      }
    } else {
      this.openCard = card;
    }

    card.open();
    if (this.openCardsCount === config.cards.length) {
      this.start();
    }
  }

  getCardPositions() {
    let positions = [];
    let cardTexture = this.textures.get("card").getSourceImage();

    let cardWidth = cardTexture.width + 4;
    let cardHeight = cardTexture.height + 4;
    let offsetX =
      (this.sys.game.config.width - cardWidth * config.cols) / 2 +
      cardWidth / 2;
    let offsetY =
      (this.sys.game.config.height - cardHeight * config.rows) / 2 +
      cardHeight / 2;

    let id = 0;
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        ++id;
        positions.push({
          delay: id * 100,
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
      }
    }
    return Phaser.Utils.Array.Shuffle(positions);
  }
}
