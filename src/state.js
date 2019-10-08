AFRAME.registerState({
  nonBindedStateKeys: ['levels'],

  initialState: {
    score: 0,
    level: 0,
    levelData: {},
    gamePlaying: false,
    levels: [

      { levelName: "Level 1",
        stackCount: 3,
        activeStacks: [1, 2, 12],
        shapes: ['box', 'cone', 'sphere'],
        points: 0,
        preset: 'forest',
        levelColor: '#1E8449',
        maxHeight: 12,
        timer: 3000 } ]

  },

  handlers: {

    increaseScore: function(state, action) {
      const clearedCount = action.objectCount;
      const baseOrbValue = 10;
      let  points        = 0;
      let multiplier     = 1;

      if(!clearedCount) return false

      points += clearedCount * baseOrbValue;

      switch(clearedCount) {
        case 4:
          multiplier = 1.5
          break;
        case 5:
          multiplier = 2;
          break;
      }

      points      *= multiplier

      state.score += points;

      const  possibleLevels = state.levels.filter(function(l){ return (l.points <= state.score); });
      const  newLevel       = state.levels.indexOf(possibleLevels[possibleLevels.length -1 ]);

      if(newLevel && newLevel != state.level) {
        this.stopStacks(state);
        this.changeLevel(state, { level: newLevel });
      }
    },

    changeLevel: function(state, action) {
      state.level     = action.level;
      state.levelData = state.levels[state.level];
      document.querySelector('a-scene').emit('levelChanged', {foo: 'bar'})
    },

    setScore: function(state, action){
      state.score = action.score;
    },

    startStacks: function(state, action) {
      state.gamePlaying = true;
    },

    stopStacks: function(state, action) {
      state.gamePlaying = false;
    }


  },





})
