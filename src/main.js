const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  cols: 5,
  rows: 2,
  cards: [1, 2, 3, 4, 5],
  timeout: 30,
  scene: new GameScene(),
};

const game = new Phaser.Game(config);
