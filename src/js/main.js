import {A,B,C,D} from '../assets/*.wav'
const gameBoard = document.getElementById('colors-container')
const colors = Array.from(gameBoard.children)
const form = document.getElementById('ingame-form')
const playersList = document.getElementById('players-list')
const match = []
const playerPlay = []
const getRandom = () => Math.floor(Math.random() * 4)
const logout = document.getElementById('logout')
const audioA = new Audio(A)
const audioB = new Audio(B)
const audioC = new Audio(C)
const audioD = new Audio(D)

const audioPlay = (colorClicked) => {
  switch (colorClicked) {
    case 0:
      audioA.currentTime = 0
      audioA.play()
      break
    case 1:
      audioB.currentTime = 0
      audioB.play()
      break
    case 2:
      audioC.currentTime = 0
      audioC.play()
      break
    case 3:
      audioD.currentTime = 0
      audioD.play()
      break
  }
}


const testPlayers = [
 {
    player: 'xXJuanXx',
    difficulty: 'maniac',
    score: 1500,
    time: new Date('2020-07-06T12:43:09')
  },
  {
    player: '_Alex_',
    difficulty: 'hard',
    score: 800,
    time: new Date('2020-12-13T13:33:09')
  },
  {
    player: 'Bot96',
    difficulty: 'normal',
    score: 500,
    time: new Date('2020-10-28T17:50:09')
  },
  {
    player: 'Player123',
    difficulty: 'hard',
    score: 300,
    time: new Date('2020-01-15T22:07:09')
  },
  {
    player: 'Vegetta777',
    difficulty: 'maniac',
    score: 150,
    time: new Date('2020-02-03T10:30:09')
  },
  {
    player: 'Clementine',
    difficulty: 'normal',
    score: 100,
    time: new Date('2020-11-14T04:43:09')
  },
  {
    player: 'Albedo',
    difficulty: 'hard',
    score: 100,
    time: new Date('2020-07-25T08:40:09')
  },
  {
    player: 'Nabe',
    difficulty: 'normal',
    score: 50,
    time: new Date('2020-04-17T10:00:09')
  },
  {
    player: 'Shalltear',
    difficulty: 'normal',
    score: 50,
    time: new Date('2020-08-01T01:09:09')
  },
  {
    player: 'OoLeiaoO',
    difficulty: 'normal',
    score: 50,
    time: new Date('2020-01-13T04:43:09')
  }
]

const setPlayerData = (player, diff, time) => {
  const playerData = getPlayerData()

  if(player) playerData.player = player
  if(diff) playerData.difficulty = diff
  if(time) playerData.time = time

  sessionStorage.setItem('simonPlayer', JSON.stringify(playerData))
}

const sumScore = (score) => {
  const playerData = getPlayerData()

  if(score) playerData.score+=score
  else playerData.score = 0

  sessionStorage.setItem('simonPlayer', JSON.stringify(playerData))
}

const getPlayerData = () => {
  const playerData = sessionStorage.getItem('simonPlayer')

  if (playerData) return JSON.parse(playerData)
  else {
    const newSession = {
      player: '',
      difficulty: '',
      score: 0,
      time: '',
    }
    sessionStorage.setItem('simonPlayer', JSON.stringify(newSession))
    return newSession
  }
}

const setRanking = () => {
  const savedPlayers = getSavedRanking()
  const playerData = getPlayerData()
  const allPlayers = [...savedPlayers, playerData]
  const orderedPlayers = allPlayers.sort((a, b)=> b.score - a.score)
  const topPlayers = orderedPlayers.slice(0,10)

  localStorage.setItem('simonRanking', JSON.stringify(topPlayers))
}

//Busca los datos almacenados y de no encontrarlos almacena los de prueba
const getSavedRanking = () => {
  const dataJson = localStorage.getItem('simonRanking')

  if(dataJson) return JSON.parse(dataJson)
  else {
    const orderedPlayers = testPlayers.sort((a, b)=> b.score - a.score)
    localStorage.setItem('simonRanking', JSON.stringify(orderedPlayers))
    return orderedPlayers
  }
}

const showRanking = () => {
  const players = getSavedRanking()
  const fragment = document.createDocumentFragment()

  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit'
  }
  const dateOptions = {
    month: "short",
    day: "numeric"
  }
  let playerDate
  if(sessionStorage.getItem('simonPlayer')){
    playerDate = getPlayerData().time
  }

  players.forEach((v,i)=> {
    const tr = document.createElement('tr')
    const tdRank = document.createElement('td')
    const tdPlayer = document.createElement('td')
    const tdDiff = document.createElement('td')
    const tdScore = document.createElement('td')
    const tdTime = document.createElement('td')
    tdRank.textContent = `#${i+1}`
    tdPlayer.textContent = v.player
    tdDiff.textContent = v.difficulty
    tdScore.textContent = v.score
    tdTime.textContent = `${new Date(v.time).toLocaleTimeString(undefined, timeOptions)} ${new Date(v.time).toLocaleDateString(undefined, dateOptions)}`
    tr.classList.add('ranking__body--rows')
    if(playerDate === v.time) tr.classList.add('active-row')
    tdRank.classList.add('ranking__body')
    tdPlayer.classList.add('ranking__body')
    tdDiff.classList.add('ranking__body')
    tdScore.classList.add('ranking__body')
    tdTime.classList.add('ranking__body')

    tr.append(tdRank, tdPlayer, tdDiff, tdScore, tdTime)
    fragment.appendChild(tr)
  })

  playersList.innerHTML = ''
  playersList.appendChild(fragment)
}

const clear = async (what) => {
  if (what === 'round') {
    removeClickListener()
    playerPlay.splice(0)
    await new Promise((res) => setTimeout(()=> res(), 600))
    await animateCPU()
    addClickListener()
  } else if (what === 'match') {
    playerPlay.splice(0)
    match.splice(0)
    sumScore()
  }
}

const nextRound = () => {
  const playsLeft = playerPlay < match ? true : false

  if (playsLeft) return
  else {
    switch(getPlayerData().difficulty){
      case 'normal':
        match.push(getRandom())
        sumScore(50)
        break
      case 'hard':
        match.push(getRandom(), getRandom())
        sumScore(100)
        break
      case 'maniac':
        match.push(getRandom(), getRandom(), getRandom())
        sumScore(150)
    }
    clear('round')
  }
}

const animateCPU = async () => {
  const animate = (index) => {
    return new Promise((resolve) => {
        colors[index].addEventListener('transitionend', ()=> {
          colors[index].classList.remove('game__color--active')
          audioPlay(index)
          setTimeout(resolve, 300)
        }, {once: true})
      
        colors[index].classList.add('game__color--active')
    })
  }
  for (const v of match) {
    await Promise.resolve(animate(v))
  }
}

const goodClick = (clicked) => {
  const selectedByNum = colors.indexOf(clicked)
  audioPlay(selectedByNum)
  playerPlay.push(selectedByNum)
  const pass = playerPlay.every((v, i) => v === match[i])
  pass ? nextRound() : youLose()
}

const youLose = () => {
  setPlayerData(undefined, undefined, new Date())
  setRanking()
  showRanking()
  play()
}

const handleClick = (e) => {
  if(e.target.classList.contains('game__color')){
    goodClick(e.target)
    colors.forEach((v,i)=> i<4 && v.classList.remove('game__color--player-turn'))
  }
}

const addClickListener = () => gameBoard.addEventListener('click', handleClick)
const removeClickListener = () => gameBoard.removeEventListener('click', handleClick)

const start = async () => {
  clear('match')
  switch (getPlayerData().difficulty) {
    case 'hard':
      match.push(getRandom(), getRandom())
      break
    case 'maniac':
      match.push(getRandom(), getRandom(), getRandom())
      break
    case 'normal':
    default:
      match.push(getRandom())
  }
  await animateCPU()
  addClickListener()
}

const play = () => {
  if(!getPlayerData().difficulty) logout.click()
  form.difficulty.value = getPlayerData().difficulty
  form.submit.textContent = 'PLAY'
  form.submit.removeAttribute('disabled')
  form.difficulty.forEach(r=> r.removeAttribute('disabled'))

  const handleChange = () => {
    const diff = form.difficulty.value
    if(diff === 'hard' || diff === 'maniac'){
      setPlayerData(undefined, diff)      
    }else {
      form.difficulty.value = 'normal'
      setPlayerData(undefined, 'normal')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    form.submit.setAttribute('disabled', 'true')
    form.difficulty.forEach(r=> r.setAttribute('disabled', 'true'))
    removeChangeEvent()
    removeSubmitEvent()
    start()
  }
  
  form.addEventListener('change', handleChange)
  form.addEventListener('submit', handleSubmit)

  const removeChangeEvent = () => form.removeEventListener('change', handleChange)
  const removeSubmitEvent = () => form.removeEventListener('submit', handleSubmit)

  logout.addEventListener('click', ()=> {
    removeChangeEvent()
    removeSubmitEvent()
  })
}

const userRegister = () => {
  form.reset()
  form.difficulty.forEach(r=> r.removeAttribute('disabled'))
  form.submit.textContent = 'Save'
  form.submit.setAttribute('disabled', 'true')
  const validate = {
    name: "",
    diff: ""
  }

  const handleChange = () => {
    const playerName = form.player.value
    const diff = form.difficulty.value

    if (playerName) {
      if (playerName.length < 10) {
        validate.name = playerName
      } else {
        console.log('Name too long')
        validate.name = ''
      }
    } else {
      validate.name = ''
    }

    if (diff === 'normal' || diff === 'hard' || diff === 'maniac') {
      validate.diff = diff
    } else {
      validate.diff = ''
    }

    if (validate.name && validate.diff) {
      form.submit.removeAttribute('disabled')
    } else {
      form.submit.setAttribute('disabled', 'true')
    }
  }  

  const handleSubmit = (e) => {
    e.preventDefault()
    setPlayerData(validate.name, validate.diff)
    form.children[0].innerHTML = `<p class="form__player-name">${getPlayerData().player}<p>`
    removeChangeEvent()
    showLogout()
    play()
  }

  const removeChangeEvent = () => form.removeEventListener('change', handleChange)
  form.addEventListener('change', handleChange)
  form.addEventListener('submit', handleSubmit, {once: true})
}

const clonedEl = form.children[0].cloneNode(true)

const showLogout = () => {
  logout.classList.remove('logout--disabled')
  logout.addEventListener('click', ()=> {
    sessionStorage.removeItem('simonPlayer')
    form.children[0].replaceWith(clonedEl.cloneNode(true))
    logout.classList.add('logout--disabled')
    removeClickListener()
    showRanking()
    userRegister()
  }, {once: true})
}

if(sessionStorage.getItem('simonPlayer')){
  form.children[0].innerHTML = 
    `<p class="form__player-name">${getPlayerData().player}<p>`
  showLogout()
  play()

}else {
  userRegister()
}

showRanking()

//Mensajes al perder o la animacion al score
//dev dependencies parcel no está :O
