import chooseGenderScene from './gameScenes/chooseGenderScene';
import chooseNameScene from './gameScenes/chooseNameScene';
import fightScene from './gameScenes/fightScene';
import fightIntroScene from './gameScenes/fightIntroScene';
import introScene from './gameScenes/introScene';
import mainMenuScene from './gameScenes/mainMenuScene';
import openingChestScene from './gameScenes/openingChestScene';
import startLevel from './gameLevels/startLevel';

import SceneSytem from './systems/SceneSystem';
import SpriteSheetSystem from './systems/SpriteSheetSystem';
import MovementSystem from './systems/MovementSystem';
import QuestSystem from './systems/QuestSystem';
import GameTimeSystem from './systems/GameTimeSystem';
import ConsoleSystem from './systems/ConsoleSystem';
import ExperiencePointsSystem from './systems/ExperiencePointsSystem';
import LevelSystem from './systems/LevelSystem';
import RenderSystem from './systems/RenderSystem';
import InputSystem from './systems/input/InputSystem';
import LocalStorageSystem from './systems/LocalStorageSystem';
import DataSystem from './systems/dataSystem/DataSystem';
import TimerSystem from './systems/TimerSystem';
import VieportSystem from './systems/VieportSystem';
import TeleportSystem from './systems/TeleportSystem';
import ChestSystem from './systems/ChestSystem';
import RandomEncounterSystem from './systems/RandomEncounterSystem';
import CollisionSystem from './systems/CollisionSystem';
import FightSystem from './systems/FightSystem';
import FloatingTextsSystem from './systems/FloatingTextsSystem';
import EquipmentSystem from './systems/equipment/EquipmentSystem';

export default function loadSystems(game) {
  // SCENE SYSTEM
  const sceneSystem = new SceneSytem();

  sceneSystem.addScene('intro', introScene);
  sceneSystem.addScene('mainMenu', mainMenuScene);
  sceneSystem.addScene('chooseName', chooseNameScene);
  sceneSystem.addScene('chooseGender', chooseGenderScene);
  sceneSystem.addScene('fightIntroScene', fightIntroScene);
  sceneSystem.addScene('fightScene', fightScene);
  sceneSystem.addScene('openingChestScene', openingChestScene);

  sceneSystem.setInitialScene('intro');

  game.addSystem('sceneSystem', sceneSystem);

  // LEVEL SYSTEM
  const levelSystem = new LevelSystem();

  levelSystem.addLevel('startLevel', startLevel);

  game.addSystem('levelSystem', levelSystem);

  // SPRITESHEET SYSTEM
  const spriteSheetSystem = new SpriteSheetSystem();

  game.addSystem('spriteSheetSystem', spriteSheetSystem);

  // RENDERER SYSTEM
  const renderSystem = new RenderSystem(960, 690, 'game')

  game.addSystem('renderSystem', renderSystem);


  // INPUT SYSTEM
  const inputSystem = new InputSystem(renderSystem.getCanvasElement());

  game.addSystem('inputSystem', inputSystem);


  // TIMER SYSTEM
  const timerSystem = new TimerSystem();

  game.addSystem('timerSystem', timerSystem);


  // LOCAL STORAGE SYSTEM
  const localStorageSystem = new LocalStorageSystem(() => {}, () => {});

  game.addSystem('localStorageSystem', localStorageSystem);


  // MOVEMENT SYSTEM
  const movementSystem = new MovementSystem();

  game.addSystem('movementSystem', movementSystem);


  // DATA SYSTEM
  const dataSystem = new DataSystem();

  game.addSystem('dataSystem', dataSystem);


  // QUEST SYSTEM
  const questSystem = new QuestSystem();

  game.addSystem('questSystem', questSystem);


  // CONSOLE SYSTEM
  const consoleSystem = new ConsoleSystem();

  game.addSystem('consoleSystem', consoleSystem);


  // EXPERIENCE POINTS SYSTEM
  const experiencePointsSystem = new ExperiencePointsSystem();

  game.addSystem('experiencePointsSystem', experiencePointsSystem);


  // GAME TIME SYSTEM
  const gameTimeSystem = new GameTimeSystem();

  game.addSystem('gameTimeSystem', gameTimeSystem);


  // VIEPORT SYSTEM
  const vieportSystem = new VieportSystem();

  game.addSystem('vieportSystem', vieportSystem);


  // TELEPORT SYSTEM
  const teleportSystem = new TeleportSystem();

  game.addSystem('teleportSystem', teleportSystem);


  // CHEST SYSTEM
  const chestSystem = new ChestSystem();

  game.addSystem('chestSystem', chestSystem);


  // RANDOM ENCOUNTER SYSTEM
  const randomEncounterSystem = new RandomEncounterSystem();

  game.addSystem('randomEncounterSystem', randomEncounterSystem);


  // COLLISION SYSTEM
  const collisionSystem = new CollisionSystem();

  game.addSystem('collisionSystem', collisionSystem);


  // FIGHT SYSTEM
  const fightSystem = new FightSystem();

  game.addSystem('fightSystem', fightSystem);


  // FLOATING TEXTS SYSTEM
  const floatingTextsSystem = new FloatingTextsSystem();

  game.addSystem('floatingTextsSystem', floatingTextsSystem);


  // EQUIPMENT SYSTEM
  const equipmentSystem = new EquipmentSystem();

  game.addSystem('equipmentSystem', equipmentSystem);
}