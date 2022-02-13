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
  }

  create() {
    console.log("START create");
    this.createBackground();
    this.createText();
    this.createCards();
    this.start();
  }

  start() {
    console.log("START game");
    this.openCard = null;
    this.openCardsCount = 0;
    this.initCards();
  }

  initCards() {
    const positions = this.getCardPositions();

    this.cards.forEach((card) => {
      let { x, y } = positions.pop();

      card.close();
      card.setPosition(x, y);
    });
  }

  createText() {
    this.timeoutText = this.add.text(10, 330, "Time:", {
      font: "36px FuturaHandwritten",
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

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        positions.push({
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
      }
    }
    return Phaser.Utils.Array.Shuffle(positions);
  }
}
