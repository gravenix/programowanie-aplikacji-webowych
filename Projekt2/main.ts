const KEY_MAP = {
    q: 'hihat.wav',
    w: 'boom.wav',
    e: 'clap.wav',
    a: 'kick.wav',
    s: 'openhat.wav',
    d: 'ride.wav',
}

interface Playing {
    channel: number,
    timeouts: number[],
    intervalId: number,
    startTime: number,
}

interface PlayEvent {
    key: string,
    time: number,
}

interface RecordSession {
    channel: number,
    events: PlayEvent[],
    startTime: number,
    stopRecord: () => void,
    isRecording: boolean,
}

class Drumkit {
    private body :HTMLBodyElement;
    private audio = {};
    private sessions :RecordSession[] = [];
    private playing :Playing[] = [];

    constructor() {
        this.body = document.getElementsByTagName('body')[0];
        this.body.addEventListener('keydown', (e) => this.playSound(e.key));
        this.prepareAudio();
        this.renderRecordingChannels();
    }

    private renderRecordingChannels() {
        for (let i = 0; i<4; i++) {
            this.body.appendChild(this.renderRecordChannel(i));
        }
    }

    private renderRecordChannel(i :number): HTMLDivElement {
        let div = document.createElement('div');

        let start = document.createElement('button');
        start.innerHTML = 'Start Recording';
        start.className = `toggle-recording-${i}`;
        start.onclick = this.onToggleRecording(i);
        div.appendChild(start);

        let play = document.createElement('button');
        play.innerHTML = 'Play';
        play.className = `toggle-playing-${i}`;
        play.onclick = this.onTogglePlay(i);
        div.appendChild(play);

        let progress = document.createElement('progress');
        progress.max = 10000;
        progress.value = 0;
        progress.className = `progress-${i}`;
        div.appendChild(progress);

        return div;
    }

    private getSession = (i: number) => this.sessions.find((session :RecordSession) => session.channel === i);

    private getPlaying = (i: number) => this.playing.find((playing :Playing) => playing.channel === i);
    
    onToggleRecording(i :number) {
        return () => {
            let button = <HTMLButtonElement>document.getElementsByClassName(`toggle-recording-${i}`)[0];
            const progress = <HTMLProgressElement>document.getElementsByClassName(`progress-${i}`)[0];
            if (button.innerHTML === 'Start Recording') {
                button.innerHTML = 'Stop Recording';
                this.startRecording(i);
            } else {
                button.innerHTML = 'Start Recording';
                let session = this.getSession(i);
                if (typeof session !== 'undefined') {
                    session.stopRecord();
                    session.isRecording = false;
                }
            }
        };
    }

    onTogglePlay(i: number) {
        return () => {
            var session = this.getSession(i);
            if (!session) {
                alert('this session is not recorded');
                return;
            }
            var button = <HTMLButtonElement>document.getElementsByClassName(`toggle-playing-${i}`)[0];
            var progress = <HTMLProgressElement>document.getElementsByClassName(`progress-${i}`)[0];
            if (button.innerHTML === 'Play') {
                var items = session.events.map(event => setTimeout(
                    () => this.playSound(event.key),
                    event.time
                ));
                var duration = session.events[session.events.length - 1].time;
                items.push(setInterval(() => button.click(), duration+700));
                var startTime = Date.now();
                var intervalId = setInterval(() => {
                    progress.value = (new Date()).getTime() - startTime;
                }, 34);
                this.playing.push({
                    timeouts: items,
                    intervalId: intervalId,
                    channel: i,
                    startTime: startTime,
                });
                button.innerHTML = 'Stop';
            } else {
                var playing = this.getPlaying(i);
                playing.timeouts.forEach(timeout => clearTimeout(timeout));
                clearInterval(playing.intervalId);
                progress.value = 0;
                this.playing = this.playing.filter(p => p.channel !== i);
                button.innerHTML = 'Play';
            }
        };
    }

    startRecording(i :number) {
        const progress = <HTMLProgressElement>document.getElementsByClassName(`progress-${i}`)[0];
        var startTime = (new Date()).getTime();
        var intervalId = setInterval(() => {
            progress.value = (new Date()).getTime() - startTime;
        }, 34);
        var timeoutId = setTimeout(() => {
            (<HTMLButtonElement>document.getElementsByClassName(`toggle-recording-${i}`)[0]).click();
        }, 10000);
        var session = this.getSession(i);
        if (session !== null) this.sessions = this.sessions.filter((s :RecordSession) => s.channel !== i);
        session = {
            channel: i,
            events: [],
            startTime: Date.now(),
            stopRecord: () => {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                progress.value = 0;
            },
            isRecording: true,
        };
        this.sessions.push(session);
    }

    prepareAudio = () => Object.keys(KEY_MAP).forEach(key => this.audio[key] = new Audio('./audio/' + KEY_MAP[key]));

    playSound(key :any) {
        if (!this.audio.hasOwnProperty(key)) return;
        this.audio[key].play();
        this.sessions.forEach(session => {
            session.isRecording && session.events.push({
                key: key,
                time: Date.now() - session.startTime,
            })
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new Drumkit());