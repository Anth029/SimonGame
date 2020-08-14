const gameBoard = document.getElementById('colors-container')
const colors = Array.from(gameBoard.children)
const playButton = document.getElementById('play')
const table = document.getElementById('ranking-table')
const playersList = document.getElementById('players-list')
const form = document.getElementById('form')
let cont = 0

const playerData = {
  player: '',
  difficulty: '',
  score: 0,
  time: new Date()
}

const testPlayers = [
  {
    player: 'Momonga',
    difficulty: 'maniac',
    score: 1500,
    time: new Date()
  },
  {
    player: 'Narberal',
    difficulty: 'normal',
    score: 100,
    time: new Date()
  },
  {
    player: 'Momon',
    difficulty: 'hard',
    score: 500,
    time: new Date()
  },
  {
    player: 'Albedo',
    difficulty: 'normal',
    score: 500,
    time: new Date()
  },
  {
    player: 'Demiurge',
    difficulty: 'maniac',
    score: 300,
    time: new Date()
  }
]

//Busca los datos almacenados y de no encontrarlos almacena los de prueba
const getRanking = () => {
  try {
    const dataJson = localStorage.getItem('simonRanking')
    if(!dataJson) throw Error('Key not found')
    return JSON.parse(dataJson)
  } catch (error) {
    console.log(error)
    const orderedPlayers = testPlayers.sort((a, b)=> b.score - a.score)
    localStorage.setItem('simonRanking', JSON.stringify(orderedPlayers))
    const dataJson = localStorage.getItem('simonRanking')
    return JSON.parse(dataJson)
  }
}

const setRanking = () => {
  const savedPlayers = getRanking()
  const allPlayers = [...savedPlayers, playerData]
  const orderedPlayers = allPlayers.sort((a, b)=> b.score - a.score)
  const topPlayers = orderedPlayers.slice(0,10)

  localStorage.setItem('simonRanking', JSON.stringify(topPlayers))
}

const showRanking = () => {
  const players = getRanking()
  const fragment = document.createDocumentFragment()
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
    tdTime.textContent = v.time
    tr.append(tdRank, tdPlayer, tdDiff, tdScore, tdTime)
    fragment.appendChild(tr)
  })
  playersList.innerHTML = ''
  playersList.appendChild(fragment)
}

showRanking()

const getRandom = () => Math.floor(Math.random() * 4)

const match = []
const playerPlay = []

const nextRound = () => {
  const playsLeft = playerPlay<match ? true : false
  if(playsLeft){
    addClickEvent()
  }else {
    switch (playerData.difficulty) {
      case 'normal':
        playerData.score += 50
        match.push(getRandom())
        break
      case 'hard':
        playerData.score += 100
        match.push(getRandom())
        match.push(getRandom())
        break
      case 'maniac':
        playerData.score += 150
        match.push(getRandom())
        match.push(getRandom())
        match.push(getRandom())
        break
    }
    playerPlay.splice(0)   
    console.log(match)
    addClickEvent()
  }
}

const goodClick = async (clicked) => {
  const selectedByNum = colors.indexOf(clicked)
  playerPlay.push(selectedByNum)
  const pass = playerPlay.every((v, i)=> v === match[i])

  if(pass){
    await animate(clicked)
    nextRound()
    
  }else {
    youLose()
  }
}


const animate = (clicked) => {
  return new Promise((resolve) => {

    clicked.addEventListener('transitionend', ()=> {
    clicked.classList.remove('active')
    resolve()
  }, {once: true})

  clicked.classList.add('active')
  })
}

const youLose = () => {
  setRanking()
  showRanking()
  start()
}

const handleClick = (e) => {
  const clicked = e.target
    if(clicked.classList.contains('colors')){
      goodClick(clicked)
      removeClickEvent()
    }
}

const addClickEvent = () => {
  gameBoard.addEventListener('click', handleClick)
}

const removeClickEvent = () => {
  gameBoard.removeEventListener('click', handleClick)
}

const start = () => {
  playButton.removeAttribute('disabled')
  playButton.addEventListener('click', ()=> {
    playerData.score = 0
    playerPlay.splice(0)
    match.splice(0)
    match.push(getRandom(), getRandom())
    console.log(match)
    playButton.setAttribute('disabled', 'true')
    addClickEvent()
  }, {once: true})
}

const formEvent = () => {
  form.classList.remove('form--hidden')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    playerData.player = form.player.value
    playerData.difficulty = form.difficulty.value
    sessionStorage.setItem('simonPlayer', form.player.value)
    form.classList.add('form--hidden')
    start()
  })
}

if(sessionStorage.getItem('simonPlayer')){
  playerData.player = sessionStorage.getItem('simonPlayer')
  start()
}else {
  formEvent()
}
