/**
 * Projet-RPG
 * Created by Olivier Malige (Arknoid)
 * Licensed under The MIT License.
 *
 */
  import data from 'src/js/data';
  import {Howl, Howler} from 'howler';
  // import $ from 'jquery';

  class SoundsController {

    constructor(){
      this.musicsMuted = false;
      this.soundsMuted = false;
      this.allMuted = false;
    };

     init() {
      console.log('soundsController init');
      this.preload()
      
    };

    preload() {
      this.musics= [];
      this.sounds =[];
      let arrayToPush;
      let loopType;
      let self = this;
  
      //Browse all sounds and mucics with curent path in data.js and  preload it into this.sounds[]
      $.each(data.sounds, function(i, snd) {
        if (snd.type === 'sound') {
          arrayToPush = 'sounds';
          loopType = false;
        } else if (snd.type === 'music') {
          loopType = true;
          arrayToPush = 'musics';
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
          //push in this.sound or this.music
          eval('self.'+arrayToPush).push(sound);
        })
      })
      console.log('preload sounds and musics done');
    };

    playMusic(name) {
      let found = false
      for (var index = 0; index < this.musics.length; index++) {
        if (this.musics[index].name === name) {
          found = true;
          this.musics[index].sound.play();
        }
        if (!found) {
          console.warn('music  ' + name + '  not found');
        }
      }
  
    };
  
    play(name) {
      let found = false
      for (var index = 0; index < this.sounds.length; index++) {
        if (this.sounds[index].name === name) {
          found = true;
          this.sounds[index].sound.play();
        }
      }
      if (!found) {
        console.warn('sound  ' + name + '  not found');
      }
    };
  
    setVolume(value) {
  
      Howler.volume(value/100)
    };
  
    toggleMuted(type = 'all') {
  
      switch (type) {
        case 'musics':
         this.musicsMuted = !this.musicsMuted;
         this.musics.forEach((elem) => elem.sound.mute(this.musicsMuted));
          break;
        case 'sounds':
          this.soundsMuted = !this.soundsMuted;
          this.sounds.forEach((elem) => elem.sound.mute(this.soundsMuted));
          break;
      }
    };

  }

export default SoundsController