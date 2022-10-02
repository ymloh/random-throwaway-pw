const f = () => Math.random().toString(36).substring(2)

const pwGen = function*(charset) {
  const length = 10
  const randomValues = new Uint8Array(length)
  let randomValuesArr = []
  while (true) {
    if (randomValuesArr.length == 0) {
      crypto.getRandomValues(randomValues)
      randomValuesArr = Array.from(randomValues)
    }
    yield charset[randomValuesArr.pop() % charset.length]
  }
}

const charRange = function(fromChar, toChar) {
  range = ""
  from = fromChar.charCodeAt(0)
  to = toChar.charCodeAt(0)
  if (from > to) [from, to] = [to, from]
  while (from <= to) range += String.fromCharCode(from++)
  return range
}

const charsets = new Map([
  ["Lowercase Alphabet", charRange('a', 'z')],
  ["Uppercase Alphabet", charRange('A', 'Z')],
  ["Numbers", charRange('0', '9')],
  ["Symbols", "`~!@#$%^&*()-_=+[]';.,/\\|"]
])

window.addEventListener('load', () => {
  const form = document.querySelector("#generator-form")
  const formButton = document.querySelector("#form-button")

  const getGenerator = function() {
    const getChosenCharset = () => {
      let charset = ""
      for (const checkbox of form.querySelectorAll("input:checked")) {
        charset += charsets.get(checkbox.id)
      }
      return charset
    }
    let currentCharset = getChosenCharset()
    let currentGenerator = pwGen(currentCharset)
    return () => {
      const thisCharset = getChosenCharset()
      if (currentCharset !== thisCharset) {
        currentCharset = thisCharset
        currentGenerator = pwGen(currentCharset)
      }
      return currentGenerator
    }
  }()

  for (const labelText of charsets.keys()) {
    const div = document.createElement("div")
    const label = document.createElement("label")
    const input = document.createElement("input")
    const i = document.createElement("i")

    input.id = `${labelText}`
    
    div.classList.add("input-group")
    
    label.classList.add("form-switch")
    label.nodeValue = labelText
    
    input.type = "checkbox"
    input.setAttribute('checked', null)
    i.classList.add("form-icon")

    label.insertBefore(input, null)
    label.insertBefore(i, null)
    div.insertBefore(label, null)

    label.innerHTML += labelText
    form.insertBefore(div, formButton)
  }

  generateButton = document.querySelector("#form-button")
  generateButton.addEventListener("click", function(evt) {
    evt.preventDefault()
    const gen = getGenerator()
    let length = parseInt(form.querySelector("#input-length input").value)
    let generated = ""
    while (length-- > 0) {
      generated += gen.next().value
    }
    console.log(generated)
    navigator.clipboard.writeText(generated)
    
  })
})


