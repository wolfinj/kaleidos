//////////////////////
///// Selectors //////
//////////////////////

const blur = document.querySelector('.blur');
const controlPanel = document.querySelector('.control-panel');
const controls = document.querySelector('.controls');

const inputKid = document.querySelector('#kid');
const inputTime = document.querySelector('#time');

const counter = document.querySelector('.counter');
const letterTop = document.querySelector('.letter--top');
const letterBot = document.querySelector('.letter--bot');

const btnConfig = document.querySelector('.config');
const btnSubmit = document.querySelector('#submit');
const btnPause = document.querySelector('.pause');
const btnResume = document.querySelector('.resume');
const btnReset = document.querySelector('.reset');
const btnStart = document.querySelector('.start');
const btnCheckAlert = document.querySelector('.alert');
const btnCheckSound = document.querySelector('.sound');

const soundStart = new Audio('resources/announcement-sound-4-21464.mp3');
const soundOwertime = new Audio('resources/ding-ding-sound-effect.mp3');
const soundEnd = new Audio('resources/glad-piano-logo-13394.mp3');
const soundClock = new Audio('resources/ticking-clock_1-27477.mp3');
//////////////////////
///// Variables //////
//////////////////////

const abcLV = [
  'A',
  'Ā',
  'B',
  'C',
  'Č',
  'D',
  'E',
  'Ē',
  'F',
  'G',
  'Ģ',
  'H',
  'I',
  'Ī',
  'J',
  'K',
  'Ķ',
  'L',
  'Ļ',
  'M',
  'N',
  'Ņ',
  'O',
  'P',
  'R',
  'S',
  'Š',
  'T',
  'U',
  'Ū',
  'V',
  'Z',
  'Ž',
];

const diacritic = ['Ā', 'Č', 'Ē', 'Ī', 'Š', 'Ū', 'Ž'];

let timeBase = 120;
let timeKid = 0;
let time = 0;
let pause = false;
let sound = true;
let alert = true;
let count;

inputTime.value = timeBase;
inputKid.value = timeKid;
if (!alert) btnCheckAlert.classList.add('check--off');
else btnCheckAlert.classList.remove('check--off');
if (!sound) btnCheckSound.classList.add('check--off');
else btnCheckSound.classList.remove('check--off');

//////////////////////
///// Functions //////
//////////////////////

function showEl(elem) {
  elem.classList.remove('hidden');
}

function hideEl(elem) {
  elem.classList.add('hidden');
}
function closeCtrl() {
  if (btnStart.classList.contains('hidden')) {
    hideEl(blur);
    showEl(controls);
    showEl(counter);
  }
  hideEl(controlPanel);
}

function stopAudio(audio) {
  audio.pause();
  audio.currentTime = 0;
}

function openCtrl() {
  showEl(blur);
  showEl(controlPanel);
  hideEl(controls);
  hideEl(counter);
}

function timeFormat(seconds) {
  const min = Math.trunc(seconds / 60).toString();
  const sec = (seconds % 60).toString();
  return `${'0'.repeat(2 - min.length) + min}:${
    '0'.repeat(2 - sec.length) + sec
  }`;
}

function timeDiv(timeString) {
  return `
  <div>${timeString[0]}</div>
  <div>${timeString[1]}</div>
  <div>${timeString[2]}</div>
  <div>${timeString[3]}</div>
  <div>${timeString[4]}</div>
  `;
}

function reset() {
  time = timeBase + timeKid;
  counter.innerHTML = timeDiv(timeFormat(time));
  hideEl(letterBot);
  hideEl(letterTop);
  clearInterval(count);
  stopAudio(soundClock);
}

function playPause() {
  if (btnResume.classList.contains('hidden')) {
    showEl(btnResume);
    hideEl(btnPause);
    pause = true;
    soundClock.pause();
  } else {
    hideEl(btnResume);
    showEl(btnPause);
    pause = false;
    if (
      (time <= 10 && time > 0) ||
      (time <= timeKid + 10 && time > timeKid && alert)
    )
      soundClock.play();
  }
}

function countDown() {
  count = setInterval(timer, 1000);
  function timer() {
    if (!pause) {
      time = time - 1;
      if (((time === 11 + timeKid && timeKid) || time === 11) && alert && sound)
        soundClock.play();
      // if (time === 11 + timeKid && timeKid) soundClock.play();
      if (time === timeKid && timeKid && sound) soundOwertime.play();

      if (time === timeKid) stopAudio(soundClock);
      if (sound && time === 0) {
        soundEnd.play();
        stopAudio(soundClock);
      }

      if (time < 0) {
        // clearInterval(count);
        reset();
        showEl(btnStart);
        showEl(blur);
        hideEl(controls);
        hideEl(counter);
        return;
      }

      counter.innerHTML = timeDiv(timeFormat(time));
    }
  }
}

function rngLetter(abc) {
  // return abc[14];
  return abc[Math.floor(Math.random() * abc.length)];
}

//////////////////////
/// Event listeners //
//////////////////////

blur.addEventListener('click', closeCtrl);
btnConfig.addEventListener('click', openCtrl);

controlPanel.addEventListener('click', (e) => {
  if (e.target.closest('button')?.classList.contains('decrese-count')) {
    if (e.target.closest('.time')) inputTime.stepDown();
    if (e.target.closest('.kid')) inputKid.stepDown();
    return;
  }
  if (e.target.closest('button')?.classList.contains('increse-count')) {
    if (e.target.closest('.time')) inputTime.stepUp();
    if (e.target.closest('.kid')) inputKid.stepUp();
    return;
  }

  if (e.target.closest('svg')?.classList.contains('check')) {
    e.target.closest('svg').classList.toggle('check--off');
    if (e.target.closest('svg').classList.contains('sound')) {
      e.target.closest('svg').classList.contains('check--off')
        ? (sound = false)
        : (sound = true);
    }
    if (e.target.closest('svg').classList.contains('alert')) {
      e.target.closest('svg').classList.contains('check--off')
        ? (alert = false)
        : (alert = true);
    }
    return;
  }
  if (e.target.id === 'submit') {
    timeBase = Number.parseInt(inputTime.value);
    timeKid = Number.parseInt(inputKid.value);

    closeCtrl();
    reset();
    showEl(btnStart);
    showEl(blur);
    hideEl(controls);
    hideEl(counter);
  }
});

controls.addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (
    !btn?.classList.contains('pause') &&
    !btn?.classList.contains('resume') &&
    !btn?.classList.contains('reset')
  )
    return;
  if (btn.classList.contains('pause') || btn.classList.contains('resume')) {
    playPause();
  }
  if (btn?.classList.contains('reset')) {
    reset();
    showEl(btnStart);
    showEl(blur);
    hideEl(controls);
    hideEl(counter);
  }
});

btnStart.addEventListener('click', (event) => {
  hideEl(btnStart);
  hideEl(blur);
  showEl(controls);
  showEl(counter);
  reset();

  const roundLetter = rngLetter(abcLV);

  letterBot.classList.remove('diacritic');
  letterTop.classList.remove('diacritic');

  if (diacritic.includes(roundLetter)) {
    console.log(roundLetter);
    letterBot.classList.add('diacritic');
    letterTop.classList.add('diacritic');
  }

  letterTop.textContent = roundLetter;
  letterBot.textContent = roundLetter;
  showEl(letterTop);
  showEl(letterBot);
  letterTop.classList.add('animate--top');
  letterBot.classList.add('animate--bot');

  if (sound) soundStart.play();

  setTimeout(countDown, 3000);
});
