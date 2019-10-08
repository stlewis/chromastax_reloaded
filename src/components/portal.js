AFRAME.registerComponent('portal', {

  init: function() {
    const self =  this;
    let portalsUpSound = null;

    if(!document.querySelector('#portals-up-sound')) {
      portalsUpSound = document.createElement('a-entity');

      portalsUpSound.setAttribute('sound', { src: './sounds/lights-up.wav' })
      portalsUpSound.setAttribute('id', 'portals-up-sound')
      portalsUpSound.setAttribute('position', {x: 0, y: 0, z: 0})

      document.querySelector('[camera]').appendChild(portalsUpSound);
    }


    this.el.addEventListener('animationcomplete', function(e){

      switch(e.detail.name) {
        case "animation__portalsUp":
          self.el.sceneEl.emit("startStacks");
          break;
      }

    });

    this.el.addEventListener('animationbegin', function(e){

      switch(e.detail.name) {
        case "animation__portalsUp":
          const  portalsUpSound = document.querySelector("#portals-up-sound");
          portalsUpSound.components.sound.playSound();
          break;
      }

    });

  }

});
