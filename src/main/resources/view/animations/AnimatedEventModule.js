
import * as utils from '../core/utils.js';
import {assets} from '../assets.js';
import { WIDTH, HEIGHT } from '../core/constants.js';

export class AnimatedEventModule {
  constructor(assets) {
    this.globalData = {
    	sounds: {}
    };
    this.lastProgress = 1;
    this.lastFrame = 0;

    this.eventAnimators = {
      Sound: SoundPlayer
    };
    this.activeAnimators = [];
  }

  static get name() {
    return 'animations';
  }

  launchAnimation(event) {
    if (this.eventAnimators.hasOwnProperty(event.id)) {
      const layer = new PIXI.Container();
      const animator = new this.eventAnimators[event.id](event, layer, this.globalData);
      this.activeAnimators.push({ animator, layer });
      this.container.addChild(layer);
    }
  }

  updateScene(previousData, currentData, progress) {
    const frame = currentData.number;

    for (const event of currentData.events) {
      if (frame === this.lastFrame && event.t > this.lastProgress && event.t <= progress) {
        this.launchAnimation(event);
      } else if (this.lastFrame === previousData.number && event.t < progress) {
        this.launchAnimation(event);
      }
    }

    this.lastProgress = progress;
    this.lastFrame = frame;
  }

  handleFrameData(frameInfo, frameData) {
    return { events: frameData, number: frameInfo.number};
  }

  reinitScene(container, canvasData) {
    this.container = container;
    this.activeAnimators = [];
  }

  animateScene(delta) {
    for (const animatorData of this.activeAnimators) {
      animatorData.animator.animate(delta);
    }
    this.activeAnimators = this.activeAnimators.reduce((stillActive, animatorData) => {
      const animator = animatorData.animator;
      if (animator.isActive()) {
        return [...stillActive, animatorData];
      } else {
        animatorData.layer.parent.removeChild(animatorData.layer);
        return stillActive;
      }
    }, []);
  }

  handleGlobalData(players, globalData) {
    this.globalData.players = players;
    const width = globalData.width;
    const height = globalData.height;
    this.globalData.coeff = utils.fitAspectRatio(width, height, WIDTH, HEIGHT);
  }

}


class SoundPlayer {
  constructor(event, layer, globalData) {
    const realPath = (assets.baseUrl ? assets.baseUrl : '') + assets.images[event.params.path]
  	var audio = globalData.sounds[event.params.path];
  	if(!audio) {
  		audio = new Audio(realPath);
//  		audio.loop = true;
  		globalData.sounds[event.params.path] = audio;
  	}
  	
  	if(!audio.playing) {
	    audio.play();
  	}
  }

  animate(delta) {
    
  }

  isActive() {
    return false
  }
}
