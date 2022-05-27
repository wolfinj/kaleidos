//////////////////////
///// Selectors //////
//////////////////////

const blur = document.querySelector('.blur');
const controlPanel = document.querySelector('.control-panel');
const controls = document.querySelector('.controls');

const inputKid = document.querySelector('#kid');
const inputTime = document.querySelector('#time');

const counter = document.querySelector('.counter');

const btnConfig = document.querySelector('.config');
const btnSubmit = document.querySelector('#submit');
const btnPause = document.querySelector('.pause');
const btnResume = document.querySelector('.resume');
const btnReset = document.querySelector('.reset');
const btnStart = document.querySelector('.start');

//////////////////////
///// Variables //////
//////////////////////

let timeBase = 120;
let timeKid = 60;
let time = 0;
let pause = false;
let sound = true;
let alert = true;
let count;

//////////////////////
///// Functions //////
//////////////////////

function increse(event) {
  event.previousElementSibling.stepUp();
}

function decrese(event) {
  event.nextElementSibling.stepDown();
}

function toggleHide(elem) {
  elem.classList.toggle('hidden');
}
function closeCtrl() {
  blur.classList.add('hidden');
  controlPanel.classList.add('hidden');
}

function openCtrl() {
  blur.classList.remove('hidden');
  controlPanel.classList.remove('hidden');
}

function check(node) {
  node.classList.toggle('check--off');
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

  clearInterval(count);
}

function playPause() {
  if (btnResume.classList.contains('hidden')) {
    btnResume.classList.remove('hidden');
    btnPause.classList.add('hidden');
    pause = true;
  } else {
    btnResume.classList.add('hidden');
    btnPause.classList.remove('hidden');
    pause = false;
  }
  console.log(pause);
}

function countDown() {
  count = setInterval(timer, 1000);
  console.log(counter, time);
  function timer() {
    if (!pause) {
      //do something if not paused
      time = time - 1;
      if (time < 0) {
        clearInterval(count);
        return;
      }

      counter.textContent = timeFormat(time);
    }
  }
}
console.log(counter.textContent);
//////////////////////
/// Event listeners //
//////////////////////

blur.addEventListener('click', closeCtrl);
btnConfig.addEventListener('click', openCtrl);

btnSubmit.addEventListener('click', (event) => {
  closeCtrl();
  timeBase = Number.parseInt(inputTime.value);
  timeKid = Number.parseInt(inputKid.value);

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
    toggleHide(btnStart);
  }
});

btnStart.addEventListener('click', (event) => {
  toggleHide(btnStart);

  reset();
  countDown();
});
