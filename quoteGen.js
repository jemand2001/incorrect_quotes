// this was originally based on the code of https://incorrect-quotes-generator.neocities.org/
// however, I found that code so bad (sorry SP) that i had to make my own
// I think I'll comment what I (think I) improved


// i didn't like having like, *all of the prompts* right in the middle of the file,
// so i moved them out
const promptsPromise = fetch("./prompts.json").then(r => r.json());
// i guess i could have this calculated based on the length of the prompts, but eh
const numChars = 6;
let currentPrompt;

// so this disables the name inputs after the first n
function disableChars(e) {
  const val = Number.parseInt(e.target.value);
  const inputs = [...document.getElementById('charInputs').children];
  for (let i = 0; i < numChars; i++) {
    inputs[i].disabled = i >= val;
  }
  currentPrompt = undefined;
  for (const e of document.getElementsByClassName('swap-char')) {
    e.max = val;
  }
}

// this generates the prompt based on form values
async function generatePrompt(e) {
  e.stopPropagation()
  e.preventDefault()

  const prompts = await promptsPromise;

  const characters = e.target["characters"].value;
  const chosen = prompts[characters];

  currentPrompt = choice(chosen);
  const chars = [];

  for (let i = 0; i < characters; i++) {
    chars.push(e.target[`character${i+1}`].value);
  }

  renderPrompt(chars);
}

// i thought, since many people just share the text, i'd make it really easy
// so, when you click on the prompt, it's immediately copied
function copyContent(e) {
  navigator.permissions.query({name: "clipboard-write"}).then(result => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(e.target.innerText);
      showMessage("copyMessage")
    }
  });
}

// random choice, meh
function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// sets the max of a number input, meh
function setMax(e) {
  if (!e.target.max)
    e.target.max = numChars;
}

// makes one of the message boxes appear for ~1sec
function showMessage(id) {
  const m = document.getElementById(id);
  m.classList.remove("invisible");
  setTimeout(() => m.classList.add("invisible"), 1000);
}

/** 
 * actually renders the prompt
 * 
 * @param chars string[] - the names of the characters
 * @param p string - the prompt template
 */
function renderPrompt(chars) {
  // instead of a bunch of
  // if (n == "One")
  // i just go over the names and replace the corresponding template with each name
  let p = currentPrompt;
  for (let i = 0; i < chars.length; i++) {
    const c = String.fromCharCode(65 + i);
    p = p.replaceAll(`{${c}}`, chars[i]);
  }
  document.getElementById("output").innerHTML = p;
}

// changes the current prompt to reflect changes in character names (see issue #1)
function updatePrompt(e) {
  if (!currentPrompt)
    return
  // console.log(e.target);
  const form = e.target.form;
  const chars = getChars(form);

  renderPrompt(chars);
}

function getChars(form) {
  const chars = [];
  const characters = form["characters"].value;

  for (let i = 0; i < characters; i++) {
    chars.push(form[`character${i + 1}`].value);
  }
  return chars;
}

function swapInputs(e) {
  e.stopPropagation()
  e.preventDefault()

  const form = e.target;

  const char1 = parseInt(form['char1'].value);
  const char2 = parseInt(form["char2"].value);
  if (char1 == char2) {
    showMessage('sameInput')
  }
  const genForm = document.getElementById("generationForm");
  const el1 = genForm[`character${char1}`];
  const el2 = genForm[`character${char2}`];
  const name1 = el1.value;
  const name2 = el2.value;
  el1.value = name2;
  el2.value = name1;

  const chars = getChars(genForm);
  renderPrompt(chars);
}
