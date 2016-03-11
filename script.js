var synth = new Tone.PolySynth(4, Tone.SimpleSynth).toMaster();

Tone.Transport.timeSignature = 3;
Tone.Transport.loop = true;
Tone.Transport.loopEnd = "4m";
Tone.Transport.start();

fourMeasureComp(undefined, undefined, 0);

function fourMeasureComp(key, progression) {
  for(var i = 0; i < 4; i++) {
    Tone.Transport.schedule(function (time) {
      synth.triggerAttackRelease("C4", "8n", time);
      synth.triggerAttackRelease("E4", "8n", "+4n");
      synth.triggerAttackRelease("G4", "8n", "+4n");
      synth.triggerAttackRelease("E4", "8n", "+2n");
      synth.triggerAttackRelease("G4", "8n", "+2n");
    }, i + "m");
  }
}
