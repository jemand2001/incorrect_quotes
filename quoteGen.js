const promptsPromise = fetch("./prompts.json").then(r => r.json());

function disableChars(e) {
  console.log(e);
  const inputs = [...document.getElementById('charInputs').children];
  const val = Number.parseInt(e.target.value);
  for (let i = 0; i < val; i++) {
    inputs[i].disabled = false;
  }
  for (let i = val; i < 6; i++) {
    inputs[i].disabled = true;
    inputs[i].value = "";
  }
}

async function generatePrompt(e) {
  e.stopPropagation()
  e.preventDefault()

  const prompts = await promptsPromise;

  const characterA = e.target["character1"].value;
  const characterB = e.target["character2"].value;
  const characterC = e.target["character3"].value;
  const characterD = e.target["character4"].value;
  const characterE = e.target["character5"].value;
  const characterF = e.target["character6"].value;

  const chosen = prompts[Number.parseInt(e.target["characters"].value)];
  const str = choice(chosen);
  const result = str.replace(/{A}/g, characterA)
                    .replace(/{B}/g, characterB)
                    .replace(/{C}/g, characterC)
                    .replace(/{D}/g, characterD)
                    .replace(/{E}/g, characterE)
                    .replace(/{F}/g, characterF);
  document.getElementById("output").innerHTML = result;     
}

function copyContent(e) {
  navigator.permissions.query({name: "clipboard-write"}).then(result => {
    if (result.state == "granted" || result.state == "prompt") {
      navigator.clipboard.writeText(e.target.innerText);
      const m = document.getElementById("copyMessage")
      m.classList.add("visible")
    }
  });
}

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
