var a = Math.pow(2, 1/12);

var bgPlaying = false;
var leadPlaying = false;
var currentLeadNote;
var playableScale = teoria.Scale(teoria.note("C4"), "blues");

Tone.Master.volume.value = -10;

var pads = new Tone.PolySynth(4, Tone.SimpleSynth).toMaster();
var lead = new Tone.MonoSynth({
    "oscillator" : {
      "type" : "square"
   },
   "envelope" : {
    "attack" : 0
   }
}).connect(new Tone.Vibrato().toMaster());
lead.portamento = .05; //gliiiide

var bass = new Tone.SimpleAM().toMaster();
bass.carrier.envelope.attack.value = 0;

//drums
var kick = new Tone.DrumSynth().toMaster();
var snare = new Tone.NoiseSynth().toMaster();
var hihat = new Tone.NoiseSynth().toMaster();

snare.filter.frequency.value = 1000;
snare.filter.Q.value = 10;

Tone.Transport.timeSignature = 4;
Tone.Transport.loop = true;
Tone.Transport.loopEnd = "12m";
Tone.Transport.bpm.value = 144;

function scheduleBasicBeat() {
  for(var i = 0; i < 12; i++) {
    Tone.Transport.schedule(function (time) {
      kick.triggerAttackRelease("C2", "8n", time);
      hihat.triggerAttackRelease("16n", "+4n");
      snare.triggerAttackRelease("4n", "+4n + 4n");
      hihat.triggerAttackRelease("16n", "+4n + 4n + 4n");
    }, i + "m");
  }
}

function twelveBarBlues() {
  var progression = ["C7", "C7", "C7", "C7", "F7", "F7", "F7", "F7", "G7", "F7", "C7", "C7"];
  for(var i = 0; i < progression.length; i++) {
    let chord = teoria.chord(progression[i]),
      chordNotes = chord.simple();
    Tone.Transport.schedule(function (time) {
      
      for(var j = 0; j < chordNotes.length; j++) {
        pads.triggerAttackRelease(chordNotes[j] + "4", "2n");
      }


    }, i + "m");
  }
}

function twelveBarBluesBass() {
  var progression = ["C7", "C7", "C7", "C7", "F7", "F7", "F7", "F7", "G7", "F7", "C7", "C7"],
      twoBarPattern = [1, 3, 5, 6, 7, 6, 5, 3],
      oneBarPattern = [1, 3, 5, 6];
  for(var i = 0; i < progression.length; i++) {
    let chord = teoria.chord(progression[i]),
        root = chord.notes()[0],
        mixolydian = teoria.scale(root, "mixolydian"),
        p = twoBarPattern;
    if(i == 8 || i == 9) {
      p = oneBarPattern;
    } else if( i % 2 !== 0 ) {
      continue;
    }
    Tone.Transport.schedule(function (time) {
      for(var j = 0; j < p.length; j++) {
        let note = mixolydian.simple()[p[j]-1];
        bass.triggerAttackRelease(note + "2", "4n", "+4n*"+j);
      }
    }, i + "m");
  }
}

scheduleBasicBeat();
twelveBarBlues();
twelveBarBluesBass();

document.body.addEventListener("keydown", function (e) {
  var instrumentKeys = "ZXCVBNMASDFGHJKLQWERTYUIOP".split("").map(function (elem) {
    return elem.charCodeAt(0);
  });
  var degree = instrumentKeys.indexOf(e.which);
  if(degree != -1) {
    var octave = 3 + Math.floor(degree/6);
    lead.triggerAttack(playableScale.simple()[degree % 6] + octave);
  }
})

document.body.addEventListener("keyup", function (e) {
  lead.triggerRelease()
})

Tone.Transport.start();

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
}


