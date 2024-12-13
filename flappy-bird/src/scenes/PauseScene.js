import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {
  constructor(config) {
    super("PauseScene", config);

    this.menu = [
      { scene: "PlayScene", text: "Continue" },
      { scene: "MenuScene", text: "Exit" },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const textGO = menuItem.textGO;
    textGO.setInteractive();

    textGO("pointerover", () => {
      textGO.setStyle({ fill: "$ff0" });
    });

    textGO("pointerout", () => {
      textGO.setStyle({ fill: "$fff" });
    });

    textGO("pointerup", () => {
      console.log("Clicked on an option");
    });
  }
}

export default PauseScene;
