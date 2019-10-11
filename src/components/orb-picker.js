AFRAME.registerComponent('orb-picker', {

  init: function() {

    this.firstOrb  = null;
    this.secondOrb = null;
    this.el.addEventListener('click', this.handleOrbClick.bind(this))

    this.el.sceneEl.addEventListener('levelChanged', this.clearSelections.bind(this));
    this.el.sceneEl.addEventListener('gameOver', this.clearSelections.bind(this));
  },

  clearSelections: function() {
    this.firstOrb = null;
    this.secondOrb = null;
    this.clearBoundSphere();
  },

  handleOrbClick: function(e) {

    const orb = e.detail.intersectedEl;

    if(orb == document.querySelector('#bounding-box')){
      this.firstOrb = null;
      this.clearBoundSphere();
      return false;
    }

    if(this.firstOrb && orb.classList.contains('orb')) {
      this.secondOrb = orb;

      this.swapOrbs();
      this.clearBoundSphere();

    } else if(orb.classList.contains('orb')) {
      this.firstOrb = orb;
      this.boundSphere(orb);

      const pickSound = document.querySelector('#pick-sound');
      pickSound.components.sound.playSound();
    }

  },

  swapOrbs: function() {
    if(!this.firstOrb || !this.secondOrb) return   false;

    const firstOrbKind  = this.firstOrb.getAttribute('geometry').primitive
    const secondOrbKind = this.secondOrb.getAttribute('geometry').primitive

    const firstOrbReferenceSelector  = "#" + firstOrbKind + '-template'
    const secondOrbReferenceSelector = "#" + secondOrbKind + '-template'

    const firstOrbReference  = document.querySelector(firstOrbReferenceSelector)
    const secondOrbReference = document.querySelector(secondOrbReferenceSelector)

    this.firstOrb.setAttribute('material', secondOrbReference.getAttribute('material'))
    this.secondOrb.setAttribute('material', firstOrbReference.getAttribute('material'))

    this.firstOrb.setAttribute('geometry', secondOrbReference.getAttribute('geometry'))
    this.secondOrb.setAttribute('geometry', firstOrbReference.getAttribute('geometry'))

    // Play the swap sound
    const swapSound = document.querySelector('#move-sound');
    swapSound.components.sound.playSound();

    // Let the stacks know an orb swap has occurred
    this.el.emit("orbsSwapped")
  },


  boundSphere: function(orb) {
    const orbGeometry = orb.getAttribute('geometry');

    const boundingBox = document.createElement('a-entity');

    boundingBox.setAttribute('id', 'bounding-box');
    boundingBox.setAttribute('material', { color: 'black', opacity: 0.25 });

    let boundingGeometry = null;

    // To figure out our geometry, we need to know what kind of primitive this is, and make our dimensional attributes slightly larger.
    switch(orbGeometry.primitive) {
      case "box":
        boundingGeometry = { primitive: orbGeometry.primitive, height: 0.45, width: 0.45, depth: 0.45 };
        break;
      case "cone":
        boundingGeometry = { primitive: orbGeometry.primitive, height: 0.45, radiusBottom: 0.3 };
          break;
      case "octahedron":
        boundingGeometry = { primitive: orbGeometry.primitive, radius: 0.32 };
        break;
      case "sphere":
        boundingGeometry = { primitive: orbGeometry.primitive, radius: 0.28 };
        break;
      case "tetrahedron":
        boundingGeometry = { primitive: orbGeometry.primitive, radius: 0.45 };
        break;
      case "dodecahedron":
        boundingGeometry = { primitive: orbGeometry.primitive, radius: 0.28 };
        break;
      case "icosahedron":
        boundingGeometry = { primitive: orbGeometry.primitive, radius: 0.28 };
    }

    boundingBox.setAttribute('geometry', boundingGeometry, true);
    orb.appendChild(boundingBox);
  },

  clearBoundSphere: function() {
    const bounding = document.querySelector('#bounding-box');
    if(bounding) bounding.parentNode.removeChild(bounding);
    this.firstOrb = null;
    this.secondOrb = null;
  },

});
