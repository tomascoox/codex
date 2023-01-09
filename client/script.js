import bot from './assets/bot.svg'
import user from './assets/user.svg'

const documentHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
 }
 window.addEventListener('resize', documentHeight)

 documentHeight()

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        element.textContent += '.'

        if (element.textContent === '....') {
            element.textContent = ''
        }
    }, 300)
}

function typeText(element, text) {
  let index = 0

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index)
      index++
    } else {
      clearInterval(interval)
    }
  }, 20)
}

function generateUniqueId () {
  const timestamp = Date.now()
  const randomNumber = Math.random()
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexadecimalString}`
}

function chatStripe (isAi, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id="${uniqueId}">${value}</div>
        </div>
      </div>
    `
  )
}



function showAd() {
  let div = document.getElementById('ad_position');
  div.innerHTML = ''
  var s1 = document.createElement('script');
  s1.type = 'text/javascript';
  s1.innerHTML = `atOptions = {
    key: "269887737618ed5548ed6ec90a0b85cf",
    format: "iframe",
    height: 50,
    width: 320,
    params: {}
  };`;

  var s2 = document.createElement( 'script' );
  s2.type = 'text/javascript';
  s2.src = "//www.effectivecreativeformat.com/269887737618ed5548ed6ec90a0b85cf/invoke.js";
  div.appendChild( s1 );
  div.appendChild( s2 );
}



const handleSubmit = async (e) => {
  e.preventDefault()

  // showAd()

  const data = new FormData(form)

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

  form.reset()

  // bot's chatstripe
  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId)

  chatContainer.scrollTop = chatContainer.scrollHeight

  const messageDiv = document.getElementById(uniqueId)

  loader(messageDiv)

  // fetch data from the server-> bot's response

  const response = await fetch('https://codex-deup.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval)
  messageDiv.innerHTML = ''

  if (response.ok) {
    const data = await response.json()
    const parsedData = data.bot.trim()

    typeText(messageDiv, parsedData)
  } else {
    const err = await response.text()

    messageDiv.innerHTML = 'Something went wrong'

    alert(err)

  }
  }


form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    handleSubmit(e)
  }
})

