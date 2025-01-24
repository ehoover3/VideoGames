// game/quests/DogBallQuest.js
import Quest from "../Quest.js";
import { STATES } from "../../config/constants.js";

export default class DogBallQuest extends Quest {
  constructor() {
    super({
      id: "give_dog_ball",
      title: "A Dog's Best Friend",
      description: "Find a tennis ball and give it to the therapy dog.",
      objectives: [
        {
          id: "find_ball",
          description: "Find and pick up the tennis ball",
          required: 1,
          progress: 0,
        },
        {
          id: "give_ball",
          description: "Give the ball to the dog",
          required: 1,
          progress: 0,
        },
      ],
      reward: {
        items: ["dog_treat"],
        experience: 50,
      },
    });

    this.questStates = {
      NOT_STARTED: "NOT_STARTED",
      BALL_FOUND: "BALL_FOUND",
      COMPLETED: "COMPLETED",
    };

    this.currentState = this.questStates.NOT_STARTED;
    this.dialogueOptions = this.setupDialogue();
  }

  setupDialogue() {
    return {
      [this.questStates.NOT_STARTED]: "Woof! *The dog looks longingly at the tennis ball in the distance*",
      [this.questStates.BALL_FOUND]: "Woof woof! *The dog's tail wags excitedly at the sight of the ball*",
      [this.questStates.COMPLETED]: "Woof! *The dog happily plays with the ball*",
    };
  }

  handleInteraction(player, dog, gameState) {
    const inventory = window.gameInstance?.getInventory();
    if (!inventory) return null;

    const hasBall = inventory.items.some((item) => item.name === "Tennis Ball");

    switch (this.currentState) {
      case this.questStates.NOT_STARTED:
        if (!hasBall) {
          this.updateObjective("find_ball", 0);
          return this.dialogueOptions[this.questStates.NOT_STARTED];
        } else {
          this.currentState = this.questStates.BALL_FOUND;
          this.updateObjective("find_ball", 1);
          return this.dialogueOptions[this.questStates.BALL_FOUND];
        }

      case this.questStates.BALL_FOUND:
        if (hasBall) {
          // Find and remove the ball from inventory
          const ballIndex = inventory.items.findIndex((item) => item.name === "Tennis Ball");
          if (ballIndex !== -1) {
            inventory.items.splice(ballIndex, 1);

            // Complete the quest
            this.currentState = this.questStates.COMPLETED;
            this.updateObjective("give_ball", 1);
            this.completeQuest(player);

            return "You gave the ball to the dog. The dog seems overjoyed!";
          }
        }
        return this.dialogueOptions[this.questStates.BALL_FOUND];

      case this.questStates.COMPLETED:
        return this.dialogueOptions[this.questStates.COMPLETED];

      default:
        return "Woof?";
    }
  }

  getProgress() {
    return {
      title: this.title,
      description: this.description,
      objectives: this.objectives.map((obj) => ({
        description: obj.description,
        progress: obj.progress,
        required: obj.required,
        completed: obj.completed,
      })),
      completed: this.isCompleted,
    };
  }

  completeQuest(player) {
    this.isCompleted = true;

    // Add reward to inventory
    const inventory = window.gameInstance?.getInventory();
    if (inventory) {
      // You could create a new dog treat item here
      // inventory.addItem(new Item({ ...dogTreatConfig }));
    }
  }
}
