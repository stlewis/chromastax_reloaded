AFRAME.registerComponent('chromastack', {
  schema: {
    sphereTimer:        { type: 'number', default: 3000 },
    maximumStackHeight: { type: 'number', default: 12 },
    shapes:             { type: 'array',  default: ['box', 'cone', 'sphere'] }
  },

  init: function() {
    this.state        = this.el.sceneEl.systems.state.state;
    this.throttledAdd = AFRAME.utils.throttle(this.addOrb, this.data.sphereTimer, this)
    this.el.sceneEl.addEventListener('orbsSwapped', this.handleOrbSwap.bind(this));
  },

  testAnimation: function(e) {
    console.log(e.detail)
  },

  tick: function() {
    this._removeAdjacentOrbs();
    if(this.getOrbs().length <= 5) {
      this.throttledAdd()
    }
  },

  handleOrbSwap: function() {
    this._removeAdjacentOrbs();
  },

  createOrb: function(shape) {
    let referenceEntitySelector = '#' + shape + '-template'
    let referenceEntity = document.querySelector(referenceEntitySelector)



    const orb = document.createElement('a-entity');
    orb.setAttribute('class', 'orb ' + shape);
    orb.setAttribute('data-clickable', {});
    orb.setAttribute('data-orb', {});
    orb.setAttribute('geometry', referenceEntity.getAttribute('geometry'));
    orb.setAttribute('position', {x: 0, y: -0.6, z: 0});

    orb.setAttribute('material', referenceEntity.getAttribute('material'));

    return orb
  },

  addOrb: function(shape) {
    if(!this.state.gamePlaying) return false;

    const shapeList = Array.from(this.el.children).map(function(s) { return s.components['geometry'].data.primitive; })
    const lastShape = shapeList[0];

    const validShapes  = lastShape ? this.data.shapes.filter(function(k){  return k != lastShape; }) : this.data.shapes;
    shape              = shape ? shape : validShapes[Math.floor(Math.random() * validShapes.length)];

    let orb = this.createOrb(shape);
    this.el.prepend(orb);
    this._calculateOrbPositions();
  },

  _calculateOrbPositions: function() {
    let orbs = this.getOrbs();

    // From bottom to top
    for(let i = 0;  i < orbs.length; i++) {
      const currentOrb   = orbs[i]
      const objectOffset =  i == 0 ? 0 : 0.055
      const orbPos       = currentOrb.object3D.position;
      const orbY         = objectOffset + (0.5) + (0.5 * i)

      currentOrb.setAttribute('animation', {property: 'position', dur: 500, to: {x: orbPos.x, y: orbY, z: orbPos.z } })
    }

    if(orbs.length > this.data.maximumStackHeight) {
      this.el.emit("gameOver", { stack: this });
    }
  },

  _removeAdjacentOrbs: function() {
    let orbs = this.getOrbs();
    if(orbs.length <= 1) return false;

    let currentlyAdjacent = [];

    for(let i = 0; i < orbs.length; i++) {
      let orb = orbs[i]

      if(currentlyAdjacent.length == 0) {
        currentlyAdjacent.push(orbs[i]);
        continue;
      }

      let currentOrbGeoType     = orbs[i].getObject3D('mesh').geometry.metadata.type;
      let lastAdjacent          = currentlyAdjacent[currentlyAdjacent.length - 1];
      let lastAdjacentGeoType   = null;

      if(lastAdjacent){
        lastAdjacentGeoType = lastAdjacent.getObject3D('mesh').geometry.metadata.type;
      }

      if(currentOrbGeoType == lastAdjacentGeoType) {
        currentlyAdjacent.push(orbs[i]);

        if(currentlyAdjacent.length >= 5) { // No longer than 5 at any event
          this.removeObjects(currentlyAdjacent);
          orbs = this.getOrbs();
        }

      }else{

        if(currentlyAdjacent.length >= 3) {
          this.removeObjects(currentlyAdjacent);
        }

        currentlyAdjacent = []
        currentlyAdjacent.push(orbs[i])
        orbs = this.getOrbs();
      }
    }

    if(currentlyAdjacent.length >= 3) {
      this.removeObjects(currentlyAdjacent);
      orbs = this.getOrbs();
    }

  },

  removeObjects: function(objects){
    if(objects.length == 0) return true;

    this.el.sceneEl.emit('increaseScore', { objectCount: objects.length })

    for(let j = 0; j < objects.length; j++) {
      let orb = objects[j];
      if(orb.parentNode) {
        orb.setAttribute('matched');
        orb.removeAttribute('data-clickable')
      }
    }

    let orbs = this.getOrbs();


    for(let a = 0; a < orbs.length; a++) {
      console.log("What da heck?")
      const orb  = orbs[a];
      const currentPos = orb.getAttribute('position');
      const threePos   = orb.object3D.position

      const newY =  (0.54 * a) + 0.54
      const positionTo = { x: currentPos.x, y: newY, z: currentPos.z }

      orb.setAttribute('animation__shrinkOrbs', { property: 'position', dur: 500, to: positionTo });
      this.removeMarkedObjects();
    }

    const removeSound = document.querySelector('#remove-sound');
    removeSound.components.sound.playSound();
  },

  removeMarkedObjects: function(e) {
    const toRemove = document.querySelectorAll('[matched]');

    for(let i = 0; i < toRemove.length; i++) {
      const orb = toRemove[i];
      orb.parentNode.removeChild(orb);
    }
  },

  getOrbs: function() {
    const  orbs = Array.from(this.el.querySelectorAll('[data-orb]'));
    return orbs;
  }

});
