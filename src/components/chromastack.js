AFRAME.registerComponent('chromastack', {
  schema: {
    sphereTimer:        { type: 'number', default: 3000 },
    maximumStackHeight: { type: 'number', default: 12 },
    shapes:             { type: 'array',  default: ['box', 'cone', 'sphere'] }
  },

  init: function() {
    this.state        = this.el.sceneEl.systems.state.state;

    this.throttledAdd = AFRAME.utils.throttle(this.addOrb, this.data.sphereTimer, this)

    this.shapeParams = {
      box:          { primitive: 'box', width: 0.4, height: 0.4, depth: 0.4 },
      cone:         { primitive: 'cone', radiusBottom: 0.25, radiusTop: 0, height: 0.4 },
      octahedron:   { primitive: 'octahedron', radius: 0.28 },
      sphere:       { primitive: 'sphere', radius: 0.25, segmentsHeight: 9, segmentsWidth: 18 },
      tetrahedron:  { primitive: 'tetrahedron', radius: 0.4 },
      dodecahedron: { primitive: 'dodecahedron', radius: 0.25 }
    }

    this.shapeColors = {
      box:          'blue',
      cone:         'yellow',
      sphere:       'purple',
      tetrahedron:  'orange',
      octahedron:   'green',
      cylinder:     'red',
      dodecahedron: 'pink',
    }

    this.el.sceneEl.addEventListener('orbsSwapped', this.handleOrbSwap.bind(this));
    this.el.addEventListener('animationcomplete', this.removeMarkedObjects.bind(this))
  },

  tick: function() {
    this._removeAdjacentOrbs();
    this.throttledAdd()
  },

  handleOrbSwap: function() {
    this._removeAdjacentOrbs();
  },

  createOrb: function(shape) {
    const orb = document.createElement('a-entity');
    orb.setAttribute('class', 'orb ' + shape);
    orb.setAttribute('data-clickable', {});
    orb.setAttribute('geometry', this.shapeParams[shape]);
    orb.setAttribute('position', {x: 0, y: -0.6, z: 0});

    orb.setAttribute('material', {color: this.shapeColors[shape], metalness: 0.5, roughness: 0.2, opacity: 1});

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

      currentOrb.setAttribute('animation', {property: 'position', dur: 1000, to: {x: orbPos.x, y: orbY, z: orbPos.z } })
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

      let currentOrbPrimitive   = orbs[i].getAttribute('geometry').primitive;
      let lastAdjacent          = currentlyAdjacent[currentlyAdjacent.length - 1];
      let lastAdjacentPrimitive = null;

      if(lastAdjacent){
        lastAdjacentPrimitive = lastAdjacent.getAttribute('geometry').primitive;
      }

      if(currentOrbPrimitive == lastAdjacentPrimitive) {
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
      const orb  = orbs[a];
      const currentPos = orb.getAttribute('position');
      const newY =  (0.54 * a) + 0.54
      const positionTo = { x: currentPos.x, y: newY, z: currentPos.z }

      orb.setAttribute('animation__shrinkOrbs', { property: 'position', dur: 1000, to: positionTo });
    }

    const removeSound = document.querySelector('#remove-sound');
    removeSound.components.sound.playSound();
  },

  removeMarkedObjects: function(e) {
    if(e.detail.name != "animation__shrinkOrbs") return false



    const toRemove = document.querySelectorAll('[matched]');


    for(let i = 0; i < toRemove.length; i++) {
      const orb = toRemove[i];
      orb.parentNode.removeChild(orb);
    }
  },

  getOrbs: function() {
    const  orbs = Array.from(this.el.querySelectorAll('[data-clickable]'));
    return orbs;
  }

});
