const promptsPromise = fetch("./prompts.json").then(r => r.json());
const numChars = 6;

function disableChars(e) {
  console.log(e);
  const inputs = [...document.getElementById('charInputs').children];
  const val = Number.parseInt(e.target.value);
  for (let i = 0; i < numChars; i++) {
    inputs[i].disabled = i >= val;
  }
  // for (let i = val; i < 6; i++) {
  //   inputs[i].disabled = true;
  // }
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
      const m = document.getElementById("copyMessage")
      m.classList.add("visible")
      setTimeout(() => m.classList.remove("visible"), 1000);
    }
  });
}

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
