var a = Math.pow(2, 1/12);

var bgPlaying = false;
var leadPlaying = false;
var currentLeadNote;
var lowerLimitCoordinate, upperLimitCoordinate,
    playableScale = teoria.Scale(teoria.note("C3"), "major"),
    lowerLimitFrequency = playableScale.tonic.fq(), upperLimitFrequency = lowerLimitFrequency * 2;

Tone.Master.volume.value = -20;

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

function findClosestDiatonic(freq, scale) {
  for(var i = 0; i < scale.notes().length; i++) {
    var thisFreq = scale.notes()[i].fq(),
        nextFreq = scale.notes()[i+1] ? scale.notes()[i+1].fq() : scale.notes()[0].fq()*2;
    if( thisFreq < freq && freq < nextFreq ) {
      if( freq - thisFreq < nextFreq - freq ) {
        return thisFreq;
      } else {
        return nextFreq;
      }
    }
  }
  //found nothing;
  return freq;
}

document.body.addEventListener("keydown", function (e) {
  if(e.which === 32) {
    if(bgPlaying) {
      Tone.Transport.pause();
      bgPlaying = false;
    } else {
      Tone.Transport.start();
      bgPlaying = true;
    }
  } else
  if(e.which === 70) {
    if(leadPlaying) {
      lead.triggerAttack(currentLeadNote);
    } else {
      currentLeadNote = findClosestDiatonic(currentLeadNote, playableScale);
      lead.triggerAttack(currentLeadNote);
    }
    leadPlaying = true;
  }
})

document.body.addEventListener("keyup", function (e) {
  if(e.which === 70) {
    lead.triggerRelease();
    leadPlaying = false;
  }
})

document.body.addEventListener("mousedown", function (e) {
  lead.triggerAttack(currentLeadNote);
  leadPlaying = true;
})
document.body.addEventListener("mouseup", function (e) {
  lead.triggerRelease();
  leadPlaying = false;
})

document.body.addEventListener("mousemove", function (e) {
  var mouseValue = e.x;
  if(mouseValue < lowerLimitCoordinate)
    mouseValue = lowerLimitCoordinate;
  if(mouseValue > upperLimitCoordinate)
    mouseValue = upperLimitCoordinate;
  currentLeadNote = map(mouseValue, lowerLimitCoordinate, upperLimitCoordinate, lowerLimitFrequency, upperLimitFrequency);
})

function setup() {
  lowerLimitCoordinate = windowWidth/6;
  upperLimitCoordinate = windowWidth - lowerLimitCoordinate;
  createCanvas(windowWidth, windowHeight);
  textSize(32);
  textAlign(CENTER);
}

function draw() {
  clear();
  line(lowerLimitCoordinate, windowHeight/2, upperLimitCoordinate, windowHeight/2);
  //draw semitones
  applyMatrix();
  translate(0, windowHeight/2);
  var lineHeight = 30;
  for (var i = 0; i < playableScale.notes().length; i++) {
    let nextNoteFrequency = playableScale.notes()[i].fq();
    let xc = map(nextNoteFrequency, lowerLimitFrequency, upperLimitFrequency, lowerLimitCoordinate, upperLimitCoordinate);
    line(xc, -lineHeight/2, xc, lineHeight/2);
  }
  //last one
  line(upperLimitCoordinate, -lineHeight/2, upperLimitCoordinate, lineHeight/2);
  stroke("black");
  resetMatrix();
  // if(currentLeadNote)
  //   text(currentLeadNote.toFixed(3), mouseX, windowHeight/2 - radius);
  noFill();
  var radius = map(lead.envelope.value, 0, 1, 20, 200);
  ellipse(mouseX, windowHeight/2, radius, radius);
  var noteXc = map(currentLeadNote, lowerLimitFrequency, upperLimitFrequency, lowerLimitCoordinate, upperLimitCoordinate);
  ellipse(noteXc, windowHeight/2, 5, 5);
}


