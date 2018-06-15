/**
 * Projet-RPG
 * Created by Olivier Malige (Arknoid)
 * Licensed under The MIT License.
 *
 */

const soundsController = {
  sounds: [],
  musics: [],
  musicsMuted : false,
  soundsMuted : false,
  allMuted : false,

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

  setVolume: function(value) {

    Howler.volume(value/100)
  },

  toggleMuted: function(type = 'all') {

    switch (type) {
      case 'musics':
       soundsController.musicsMuted = !soundsController.musicsMuted;
       soundsController.musics.forEach(function(elem) {
          elem.sound.mute(soundsController.musicsMuted)
        })
        break;
      case 'sounds':
        soundsController.soundsMuted = !soundsController.soundsMuted;
        soundsController.sounds.forEach(function(elem) {
           elem.sound.mute(soundsController.soundsMuted)
        })
        break;
    }
  },
}
