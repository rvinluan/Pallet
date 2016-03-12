var playing = false;

var pads = new Tone.PolySynth(4, Tone.SimpleSynth).toMaster();

//drums
var kick = new Tone.DrumSynth().toMaster();
var snare = new Tone.NoiseSynth().toMaster();

Tone.Transport.timeSignature = 3;
Tone.Transport.loop = true;
Tone.Transport.loopEnd = "4m";

function scheduleBasicBeat() {
  for(var i = 0; i < 4; i++) {
    Tone.Transport.schedule(function (time) {
      kick.triggerAttackRelease("C2", "8n", time);
      snare.triggerAttackRelease("4n", "+4n");
      snare.triggerAttackRelease("4n", "+4n + 4n");
    }, i + "m");
  }
}

function scheduleFourMeasureComp(key, progression) {
  for(var i = 0; i < 4; i++) {
    let chord = teoria.chord(progression[i]),
      chordNotes = chord.simple();
    Tone.Transport.schedule(function (time) {
      
      for(var j = 0; j < chordNotes.length; j++) {
        pads.triggerAttackRelease(chordNotes[j] + "4", "2n");
      }

    }, i + "m");
  }
}

scheduleBasicBeat();
scheduleFourMeasureComp("C", ["Cmaj7", "Dm7", "Am7", "G7"]);

document.body.addEventListener("keydown", function (e) {
  if(e.which === 32) {
    if(playing) {
      Tone.Transport.pause();
      playing = false;
    } else {
      Tone.Transport.start();
      playing = true;
    }
  }
})


