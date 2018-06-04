var soundsController = {
  sounds: [],
  musics: [],

  init: function() {
    console.log('soundsController init');
    soundsController.preload()

  },
  preload: function() {
    let arrayToPush;
    let loopType;


    //Browse all sounds and mucics with curent path in data.js and  preload it into soundsController.sounds[]
    $.each(data.sounds, function(i, snd) {
      if (snd.type === 'sound') {
        arrayToPush = 'soundsController.sounds';
        loopType = false;
      } else if (snd.type === 'music') {
        loopType = true;
        arrayToPush = 'soundsController.musics';
      }
      $.each(snd.sounds, function(j, sndName) {
        let sound = {
          sound: new Howl({
            src: [snd.path + sndName + '.ogg'],
            preload: true,
            loop: loopType,
          }),
          name: sndName,
        }
        //push in soundsController.sound or soundsController.music
        eval(arrayToPush).push(sound);
      })
    })
    console.log('preload sounds and musics done');
  },
  playMusic: function(name) {
    let found = false
    for (var index = 0; index < soundsController.musics.length; index++) {
      if (soundsController.musics[index].name === name) {
        found = true;
        soundsController.musics[index].sound.play();
      }
      if (!found) {
        console.warn('music  ' + name + '  not found');
      }
    }

  },

  play: function(name) {
    let found = false
    for (var index = 0; index < soundsController.sounds.length; index++) {
      if (soundsController.sounds[index].name === name) {
        found = true;
        soundsController.sounds[index].sound.play();
      }
    }
    if (!found) {
      console.warn('sound  ' + name + '  not found');
    }
  },

  setVolume: function() {

  },

  setMuted: function(type = 'all', value) {
    switch (type) {
      case 'all':
        Howler.mute(value);
        break;
      case 'musics':
        soundsController.musics.forEach(function(elem) {
          elem.sound.mute(value)
        })
        break;
      case 'sounds':
        soundsController.sounds.forEach(function(elem) {
           elem.sound.mute(value)
        })
        break;
    }
  },
}
