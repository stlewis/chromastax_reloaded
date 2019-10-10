AFRAME.registerComponent('orb', {

  init: function() {
    this.el.addEventListener('animationcomplete', this.handleLower.bind(this))
    this.state        = this.el.sceneEl.systems.state.state;
  },

  handleLower: function(e) {
    switch(e.detail.name) {
      case 'animation__shrinkAway':
        this.el.parentNode.removeChild(this.el)
        break;
    }
  }

});
