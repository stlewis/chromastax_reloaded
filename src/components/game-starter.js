AFRAME.registerComponent('game-starter', {

  init: function() {
    this.el.addEventListener('click', this.startGame.bind(this));
  },

  startGame: function() {
    this.el.sceneEl.emit('gameStart')
  }

});

