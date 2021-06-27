var KEY_MAP = {
    q: 'hihat.wav',
    w: 'boom.wav',
    e: 'clap.wav',
    a: 'kick.wav',
    s: 'openhat.wav',
    d: 'ride.wav',
};
var Drumkit = /** @class */ (function () {
    function Drumkit() {
        var _this = this;
        this.audio = {};
        this.sessions = [];
        this.playing = [];
        this.getSession = function (i) { return _this.sessions.find(function (session) { return session.channel === i; }); };
        this.getPlaying = function (i) { return _this.playing.find(function (playing) { return playing.channel === i; }); };
        this.prepareAudio = function () { return Object.keys(KEY_MAP).forEach(function (key) { return _this.audio[key] = new Audio('./audio/' + KEY_MAP[key]); }); };
        this.body = document.getElementsByTagName('body')[0];
        this.body.addEventListener('keydown', function (e) { return _this.playSound(e.key); });
        this.prepareAudio();
        this.renderRecordingChannels();
    }
    Drumkit.prototype.renderRecordingChannels = function () {
        for (var i = 0; i < 4; i++) {
            this.body.appendChild(this.renderRecordChannel(i));
        }
    };
    Drumkit.prototype.renderRecordChannel = function (i) {
        var div = document.createElement('div');
        var start = document.createElement('button');
        start.innerHTML = 'Start Recording';
        start.className = "toggle-recording-" + i;
        start.onclick = this.onToggleRecording(i);
        div.appendChild(start);
        var play = document.createElement('button');
        play.innerHTML = 'Play';
        play.className = "toggle-playing-" + i;
        play.onclick = this.onTogglePlay(i);
        div.appendChild(play);
        var progress = document.createElement('progress');
        progress.max = 10000;
        progress.value = 0;
        progress.className = "progress-" + i;
        div.appendChild(progress);
        return div;
    };
    Drumkit.prototype.onToggleRecording = function (i) {
        var _this = this;
        return function () {
            var button = document.getElementsByClassName("toggle-recording-" + i)[0];
            var progress = document.getElementsByClassName("progress-" + i)[0];
            if (button.innerHTML === 'Start Recording') {
                button.innerHTML = 'Stop Recording';
                _this.startRecording(i);
            }
            else {
                button.innerHTML = 'Start Recording';
                var session = _this.getSession(i);
                if (typeof session !== 'undefined') {
                    session.stopRecord();
                    session.isRecording = false;
                }
            }
        };
    };
    Drumkit.prototype.onTogglePlay = function (i) {
        var _this = this;
        return function () {
            var session = _this.getSession(i);
            if (!session) {
                alert('this session is not recorded');
                return;
            }
            var button = document.getElementsByClassName("toggle-playing-" + i)[0];
            var progress = document.getElementsByClassName("progress-" + i)[0];
            if (button.innerHTML === 'Play') {
                var items = session.events.map(function (event) { return setTimeout(function () { return _this.playSound(event.key); }, event.time); });
                var duration = session.events[session.events.length - 1].time;
                items.push(setInterval(function () { return button.click(); }, duration + 700));
                var startTime = Date.now();
                var intervalId = setInterval(function () {
                    progress.value = (new Date()).getTime() - startTime;
                }, 34);
                _this.playing.push({
                    timeouts: items,
                    intervalId: intervalId,
                    channel: i,
                    startTime: startTime,
                });
                button.innerHTML = 'Stop';
            }
            else {
                var playing = _this.getPlaying(i);
                playing.timeouts.forEach(function (timeout) { return clearTimeout(timeout); });
                clearInterval(playing.intervalId);
                progress.value = 0;
                _this.playing = _this.playing.filter(function (p) { return p.channel !== i; });
                button.innerHTML = 'Play';
            }
        };
    };
    Drumkit.prototype.startRecording = function (i) {
        var progress = document.getElementsByClassName("progress-" + i)[0];
        var startTime = (new Date()).getTime();
        var intervalId = setInterval(function () {
            progress.value = (new Date()).getTime() - startTime;
        }, 34);
        var timeoutId = setTimeout(function () {
            document.getElementsByClassName("toggle-recording-" + i)[0].click();
        }, 10000);
        var session = this.getSession(i);
        if (session !== null)
            this.sessions = this.sessions.filter(function (s) { return s.channel !== i; });
        session = {
            channel: i,
            events: [],
            startTime: Date.now(),
            stopRecord: function () {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                progress.value = 0;
            },
            isRecording: true,
        };
        this.sessions.push(session);
    };
    Drumkit.prototype.playSound = function (key) {
        if (!this.audio.hasOwnProperty(key))
            return;
        this.audio[key].play();
        this.sessions.forEach(function (session) {
            session.isRecording && session.events.push({
                key: key,
                time: Date.now() - session.startTime,
            });
        });
    };
    return Drumkit;
}());
document.addEventListener('DOMContentLoaded', function () { return new Drumkit(); });
