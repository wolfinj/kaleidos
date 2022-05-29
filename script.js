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

let timeBase = 20;
let timeKid = 13;
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

function increse(event) {
  event.previousElementSibling.stepUp();
}

function decrese(event) {
  event.nextElementSibling.stepDown();
}

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

function check(node) {
  node.classList.toggle('check--off');
  if (node.classList.contains('sound')) {
    node.classList.contains('check--off') ? (sound = false) : (sound = true);
  }
  if (node.classList.contains('alert')) {
    node.classList.contains('check--off') ? (alert = false) : (alert = true);
  }
}

function timeFormat(seconds) {
  const min = Math.trunc(seconds / 60).toString();
  const sec = (seconds % 60).toString();
  return `${'0'.repeat(2 - min.length) + min}:${
    '0'.repeat(2 - sec.length) + sec
  }`;
}

function reset() {
  time = timeBase + timeKid;
  counter.textContent = timeFormat(time);
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

      if (time < 0) {
        if (sound) soundEnd.play();
        stopAudio(soundClock);
        clearInterval(count);
        return;
      }

      counter.textContent = timeFormat(time);
    }
  }
}

function rngLetter(abc) {
  return abc[Math.floor(Math.random() * abc.length)];
}

//////////////////////
/// Event listeners //
//////////////////////

blur.addEventListener('click', closeCtrl);
btnConfig.addEventListener('click', openCtrl);

btnSubmit.addEventListener('click', (event) => {
  timeBase = Number.parseInt(inputTime.value);
  timeKid = Number.parseInt(inputKid.value);

  closeCtrl();
  reset();
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

  letterTop.textContent = roundLetter;
  letterBot.textContent = roundLetter;
  showEl(letterTop);
  showEl(letterBot);
  letterTop.classList.add('animate--top');
  letterBot.classList.add('animate--bot');

  if (sound) soundStart.play();

  setTimeout(countDown, 3000);
});
