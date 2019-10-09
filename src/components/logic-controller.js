/*
 * The logic-controller component is responsible for controlling the 'flow'
 * of the game. It starts and ends a game and handles any updates required
 * during level changes.
*/

AFRAME.registerComponent('logic-controller', {

  init: function() {
    this.state = this.el.sceneEl.systems.state.state;

    this.el.addEventListener('levelChanged', this.refreshUI.bind(this));
    this.el.addEventListener('gameOver', this.endGame.bind(this));
    this.el.sceneEl.addEventListener('gameStart', this.startGame.bind(this));
  },

  startGame: function() {
    console.log("Ready Player One!");
    this._initSounds();
    this._setInitialState();
    this._disableStartUI();
  },

  _setInitialState: function() {
    this.el.sceneEl.emit('changeLevel', { level: 0 })
    this.el.sceneEl.emit('setScore', { score: 0 })
  },

  _disableStartUI: function() {
    const startHelpText = document.querySelector('#start-help-text')

    document.querySelector('#game-start-button').removeAttribute('data-clickable');
    startHelpText.setAttribute('visible', false);
  },

  _initSounds: function() {
    const moveSound      = document.createElement('a-entity');
    const removeSound    = document.createElement('a-entity');
    const pickSound      = document.createElement('a-entity');
    const gameOverSound  = document.createElement('a-entity');

    moveSound.setAttribute('sound', { src: './sounds/glass-tink.flac' })
    moveSound.setAttribute('id', 'move-sound')
    moveSound.setAttribute('position', {x: 0, y: 0, z: 0})

    removeSound.setAttribute('sound', { src: './sounds/orb-removal.wav' })
    removeSound.setAttribute('id', 'remove-sound')
    removeSound.setAttribute('position', {x: 0, y: 0, z: 0})

    pickSound.setAttribute('sound', { src: './sounds/orb-select.wav' })
    pickSound.setAttribute('id', 'pick-sound')
    pickSound.setAttribute('position', {x: 0, y: 0, z: 0})

    gameOverSound.setAttribute('sound', { src: './sounds/orb-select.wav' })
    gameOverSound.setAttribute('id', 'game-over-sound')
    gameOverSound.setAttribute('position', {x: 0, y: 0, z: 0})

    document.querySelector('[camera]').appendChild(moveSound);
    document.querySelector('[camera]').appendChild(removeSound);
    document.querySelector('[camera]').appendChild(pickSound);
    document.querySelector('[camera]').appendChild(gameOverSound);

  },

  refreshUI: function() {
    this._renderStacks();
    this._renderRoof();
    this._engagePreset(this.state.levelData.preset);
  },

  _engagePreset(presetName) {
    const presetData = this.el.sceneEl.components.environment.presets[presetName];
    this.el.sceneEl.setAttribute('environment', presetData)
    const sky = document.querySelector('a-sky')
    sky.setAttribute('material', {side: 'back'})
  },

  _renderStacks: function() {
    this._removeStacks(this.state.levelData);

    for(let i = 0; i < this.state.levelData.activeStacks.length; i++){

      const activeStack = this.state.levelData.activeStacks[i];
      const portal      = document.querySelector("#platform" + activeStack);
      const self        = this
      const stack       = this._buildStack();

      portal.setAttribute('animation__portalsUp', { property: 'material.emissiveIntensity', dur: 5000, from: 0, to: 1 })
      portal.appendChild(stack);
    }

  },

  _buildStack: function() {
    const stack = document.createElement('a-entity');
    stack.setAttribute('chromastack', {
      sphereTimer: this.state.levelData.timer,
      shapes: this.state.levelData.shapes,
      maximumStackHeight: this.state.levelData.maxHeight
    });

    stack.setAttribute('rotation', '90 0 0')

    return stack;
  },

  _renderRoof: function() {
    // The height of the roof is a function of how high the stacks are allowed to go. allowedHeight * (standardCircumfrence + offset)

    const yHeight      = this.state.levelData.maxHeight * (0.5 + 0.055)
    const existingRoof = document.querySelector('#the-roof')

    if(existingRoof) {
      existingRoof.setAttribute('position', { x: 0, y: yHeight, z: 0 });
    } else {
      const theRoof = document.createElement('a-entity');

      theRoof.setAttribute("id", 'the-roof');
      theRoof.setAttribute('geometry', { primitive: 'circle', radius: 3 });
      theRoof.setAttribute('material', { src: "#platform-floor", repeat: "15 15" })
      theRoof.setAttribute('position', {x: 0, y: yHeight, z: 0 });
      theRoof.setAttribute('rotation', {x: 90, y: 0, z: 0});

      document.querySelector('#the-stage').appendChild(theRoof);
    }

  },

  _removeStacks: function(levelData) {
    const stacks = document.querySelectorAll('[chromastack]');

    for(let p = 0; p < stacks.length; p++) {
        stacks[p].parentNode.removeChild(stacks[p])
    }

    for(let i = 0; i < levelData.activeStacks.length; i++){
      const activeStack = levelData.activeStacks[i];

      const portal = document.querySelector("#platform" + activeStack);
      portal.removeAttribute('animation__portalsUp');

      portal.setAttribute("material", { emissiveIntensity: 0.2 })
    }


  },

  endGame: function() {
    this._removeStacks(this.state.levelData);

    const gameOverSound = document.querySelector('#game-over-sound');
    gameOverSound.components.sound.playSound();

    const startHelpText = document.querySelector('#start-help-text')

    document.querySelector('#game-start-button').setAttribute('data-clickable');
    startHelpText.setAttribute('visible', true);

    this._engagePreset('starry');
  }

})
