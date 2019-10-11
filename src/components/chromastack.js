AFRAME.registerComponent('chromastack', {
  schema: {
    sphereTimer:        { type: 'number', default: 3000 },
    maximumStackHeight: { type: 'number', default: 12 },
    shapes:             { type: 'array',  default: ['box', 'cone', 'sphere'] }
  },

  init: function() {
    this.state            = this.el.sceneEl.systems.state.state;
    this.throttledAdd     = AFRAME.utils.throttle(this.addOrb, this.data.sphereTimer, this)
    this.el.sceneEl.addEventListener('orbsSwapped', this.handleOrbSwap.bind(this))
  },

  tick: function() {
    this.throttledAdd();
    this._calculateOrbPositions();
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
    orb.setAttribute('orb', {});
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
  },

  _calculateOrbPositions: function() {
    let orbs = this.getOrbs();

    // From bottom to top
    for(let i = 0;  i < orbs.length; i++) {
      const currentOrb   = orbs[i]
      const objectOffset =  i == 0 ? 0 : 0.055
      const orbY         = objectOffset + (0.5) + (0.5 * i)

      currentOrb.setAttribute('animation__liftOrb', {property: 'object3D.position.y', dur: 500, to: orbY, isRawProperty: true })
    }

    if(orbs.length > this.data.maximumStackHeight) {
      this.el.emit("gameOver", { stack: this });
    }
  },

  _removeAdjacentOrbs: function() {
    if(this.isRemoving === true) return true
    this.isRemoving = true;

    let orbs     = this.getOrbs();
    let adjacent = []

    for(let i = 0; i < orbs.length; i++) {

      if(adjacent.length === 0) {
        adjacent.push(orbs[i])
      }

      let currOrb  = orbs[i]
      let prevOrb  = adjacent[adjacent.length - 1];
      let prevMesh = prevOrb.components.orb.meshType();
      let currMesh = currOrb.components.orb.meshType();

      if(prevMesh === currMesh) {
        adjacent.push(orbs[i])

        if(adjacent.length >= 3) {
          let idx4 = i + 1
          let idx5 = i + 2

          if(orbs[idx4] && orbs[idx4].components.orb.meshType() === orbs[i].components.orb.meshType()) {
            adjacent.push(orbs[idx4])

            if(orbs[idx5] && orbs[idx5].components.orb.meshType() === orbs[i].components.orb.meshType()) {
              adjacent.push(orbs[idx5])
            }
          }

          this.removeObjects(adjacent)
          adjacent = []
        }

      } else {
        adjacent = [orbs[i]]
      }

    }
    adjacent        = []
    this.isRemoving = false;
  },

  removeObjects: function(objects){
    console.log("How many times?", objects.map((o) => { return o.components.orb.meshType() }))
    if(objects.length < 3) return true;
    if(this.getOrbs().length < 3) return true

    for(let j = 0; j < objects.length; j++) {
      let orb = objects[j];
      if(orb.getAttribute('matched')) continue;
      if(orb.parentNode) {
        orb.setAttribute('matched');
        orb.removeAttribute('data-clickable')
        orb.setAttribute('animation__shrinkAway', {property: 'scale', to: {x: 0, y: 0, z: 0}, dur: 500 })
      }
    }

    this.el.sceneEl.emit('increaseScore', { objectCount: objects.length })
    const removeSound = document.querySelector('#remove-sound').components.sound;
    removeSound.playSound();
  },

  getOrbs: function() {
    const  orbs = Array.from(this.el.querySelectorAll('[orb]'));
    return orbs;
  }

});
