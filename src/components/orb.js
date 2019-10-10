AFRAME.registerComponent('orb', {

  init: function() {
    this.el.addEventListener('animationcomplete', this.handleLower.bind(this))

  },

  handleLower: function(e) {
    switch(e.detail.name) {
      case 'animation__shrinkAway':
        console.log("We doin it?", this)
        this.el.parentNode.removeChild(this.el)
        break;
    }
  }

});
