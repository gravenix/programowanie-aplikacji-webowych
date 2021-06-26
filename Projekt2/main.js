const KEY_MAP = {
    q: 'hihat.wav',
    w: 'boom.wav',
    e: 'clap.wav',
    a: 'kick.wav',
    s: 'openhat.wav',
    d: 'ride.wav',
}

class Drumkit {
    body;
    audio = {};

    constructor() {
        this.body = document.getElementsByTagName('body')[0];
        this.body.addEventListener('keydown', (e) => this.playSound(e.key));
        this.prepareAudio();
    }

    prepareAudio = () => Object.keys(KEY_MAP).forEach(key => this.audio[key] = new Audio('./audio/' + KEY_MAP[key]));

    playSound(key) {
        if (!this.audio.hasOwnProperty(key)) return;
        this.audio[key].play();
    }
}

document.addEventListener('DOMContentLoaded', () => new Drumkit());