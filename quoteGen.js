const promptsPromise = fetch("./prompts.json").then(r => r.json());
const numChars = 6;

function disableChars(e) {
  const val = Number.parseInt(e.target.value);
  if (val > numChars) {
    showMessage("tooHigh");
    e.target.value = numChars;
    return;
  }
  const inputs = [...document.getElementById('charInputs').children];
  for (let i = 0; i < numChars; i++) {
    inputs[i].disabled = i >= val;
  }
}

async function generatePrompt(e) {
  e.stopPropagation()
  e.preventDefault()

  const prompts = await promptsPromise;

  const characters = Number.parseInt(e.target["characters"].value);
  const chosen = prompts[characters];

  let result = choice(chosen);
  for (let i = 0; i < characters; i++) {
    const c = String.fromCharCode(65 + i);
    result = result.replaceAll(`{${c}}`, e.target[`character${i+1}`].value);
  }

  document.getElementById("output").innerHTML = result;     
}

function copyContent(e) {
  navigator.permissions.query({name: "clipboard-write"}).then(result => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(e.target.innerText);
      showMessage("copyMessage")
    }
  });
}

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function setMax(e) {
  console.log(e);
  e.target.max = numChars;
}

function showMessage(id) {
  const m = document.getElementById(id);
  m.classList.remove("invisible");
  setTimeout(() => m.classList.add("invisible"), 1000);
}
