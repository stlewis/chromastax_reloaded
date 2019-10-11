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
  },

  meshType: function() {
    let mesh = this.el.getObject3D('mesh');
    let geo  = null
    if(mesh) {
      geo = mesh.geometry
    }

    if(geo && geo.metadata) return geo.metadata.type

    return null;
  }

});
