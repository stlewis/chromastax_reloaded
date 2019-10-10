AFRAME.registerComponent('game-controls', {

  init: function() {
    if (AFRAME.utils.device.isMobileVR()) {
      return this.attachLaser();
    }

    if(this.el.sceneEl.is('vr-mode')) {
      return this.attachCursor();
    }

    if(AFRAME.utils.device.isMobile()){
      return this.attachTouch();
    }

    return this.attachCursor();
  },

  attachLaser: function() {
    const laser = document.createElement('a-entity');
    laser.setAttribute('raycaster', { showLine: true, objects: '[data-clickable]' })
    laser.setAttribute('line', {color: 'blue'});
    laser.setAttribute('orb-picker', '');
    laser.setAttribute('laser-controls', '');

    document.querySelector('#rig').appendChild(laser)
  },

  attachTouch: function() {
    const cursor = document.createElement('a-entity')
    cursor.setAttribute('cursor', {rayOrigin: 'mouse', fuse: false})
    cursor.setAttribute('raycaster', {objects: '[data-clickable]'})
    cursor.setAttribute('orb-picker', '');

    document.querySelector('[camera]').appendChild(cursor)
  },

  attachCursor: function() {
    const cursor = document.createElement('a-entity');
    cursor.setAttribute('geometry', { primitive: 'ring', radiusInner: 0.02, radiusOuter: 0.03 });
    cursor.setAttribute('material', { color: 'black', shader: 'flat' });
    cursor.setAttribute('position', { x: 0, y: 0, z: -1 });

    cursor.setAttribute('cursor', { fuse: false });
    cursor.setAttribute('raycaster', { objects: '[data-clickable]' })
    cursor.setAttribute('orb-picker', '');

    document.querySelector('[camera]').appendChild(cursor)
  }

});
