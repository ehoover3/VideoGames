// // game/Quest.js
// export default class Quest {
//   constructor(config) {
//     this.id = config.id;
//     this.title = config.title;
//     this.description = config.description;
//     this.objectives = config.objectives.map((obj) => ({
//       ...obj,
//       completed: false,
//     }));
//     this.reward = config.reward;
//     this.isCompleted = false;
//   }

//   updateObjective(objectiveId, progress) {
//     const objective = this.objectives.find((obj) => obj.id === objectiveId);
//     if (objective) {
//       objective.progress = progress;
//       objective.completed = progress >= objective.required;
//       this.checkCompletion();
//     }
//   }

//   checkCompletion() {
//     this.isCompleted = this.objectives.every((obj) => obj.completed);
//   }
// }

// // Example usage:
// const sampleQuest = {
//   id: "dog_training",
//   title: "Dog Training",
//   description: "Help train the hospital's therapy dog",
//   objectives: [
//     {
//       id: "fetch",
//       description: "Play fetch with the dog 3 times",
//       required: 3,
//       progress: 0,
//     },
//     {
//       id: "treats",
//       description: "Give treats to the dog",
//       required: 1,
//       progress: 0,
//     },
//   ],
//   reward: {
//     items: ["dog_treat_bag"],
//     experience: 100,
//   },
// };
