const gameBoard = document.getElementById('colors-container')
const colors = Array.from(gameBoard.children)
const playButton = document.getElementById('play')
const table = document.getElementById('ranking-table')
const playersList = document.getElementById('players-list')
const form = document.getElementById('form')
const match = []
const playerPlay = []
const getRandom = () => Math.floor(Math.random() * 4)

const testPlayers = [
 {
    player: 'xXJuanXx',
    difficulty: 'maniac',
    score: 1500,
    time: new Date('2020-07-13T04:43:09')
  } ,
  {
    player: '_Alex_',
    difficulty: 'hard',
    score: 800,
    time: new Date('2020-11-13T04:43:09')
  },
  {
    player: 'Bot96',
    difficulty: 'normal',
    score: 500,
    time: new Date('2020-10-13T04:43:09')
  },
  {
    player: 'Player123',
    difficulty: 'hard',
    score: 300,
    time: new Date('2020-01-13T04:43:09')
  },
  {
    player: 'Vegetta777',
    difficulty: 'maniac',
    score: 150,
    time: new Date('2020-02-13T04:43:09')
  },
  {
    player: 'Clementine',
    difficulty: 'normal',
    score: 100,
    time: new Date('2020-11-13T04:43:09')
  },
  {
    player: 'Albedo',
    difficulty: 'hard',
    score: 100,
    time: new Date('2020-07-13T04:43:09')
  },
  {
    player: 'Nabe',
    difficulty: 'normal',
    score: 50,
    time: new Date('2020-04-17T10:43:09')
  },
  {
    player: 'Shalltear Bloodfallen',
    difficulty: 'normal',
    score: 50,
    time: new Date('2020-08-13T01:00:09')
  },
  {
    player: 'OoLeiaoO',
    difficulty: 'normal',
    score: 50,
    time: new Date('2020-01-13T04:43:09')
  }
]

const setPlayerData = (player, diff) => {
  const playerData = getPlayerData()

  playerData.player = player
  playerData.difficulty = diff

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
      time: new Date(),
    }
    sessionStorage.setItem('simonPlayer', JSON.stringify(newSession))
    return newSession
  }
}

const setRanking = () => {
  const savedPlayers = getSavedRanking()
  const playerData = getPlayerData()
  playerData.time = new Date()
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

    tr.classList.add('ranking__body--rows')
    tdRank.classList.add('ranking__body')
    tdPlayer.classList.add('ranking__body', 'ranking__body--bold')
    tdDiff.classList.add('ranking__body')
    tdScore.classList.add('ranking__body', 'ranking__body--bold')
    tdTime.classList.add('ranking__body')

    tr.append(tdRank, tdPlayer, tdDiff, tdScore, tdTime)
    fragment.appendChild(tr)
  })

  playersList.innerHTML = ''
  playersList.appendChild(fragment)
}

showRanking()

const clear = async (what) => {
  if (what === 'round') {
    playerPlay.splice(0)
    await animateCPU()
    addClickEvent()
  } else if (what === 'match') {
    sumScore()
    playerPlay.splice(0)
    match.splice(0)
  }
}

const nextRound = () => {
  const playsLeft = playerPlay < match ? true : false

  if (playsLeft) addClickEvent()
  else {
    switch (getPlayerData().difficulty) {
      case 'hard':
        match.push(getRandom(), getRandom())
        sumScore(100)
        break
      case 'maniac':
        match.push(getRandom(), getRandom(), getRandom())
        sumScore(150)
        break
      case 'normal':
      default:
        match.push(getRandom())
        sumScore(50)
    }

    clear('round')
  }
}

const animateCPU = async () => {
  for (const v of match) {
    await Promise.resolve(animate(v))
  }
}

const goodClick = async (clicked) => {
  const selectedByNum = colors.indexOf(clicked)
  playerPlay.push(selectedByNum)
  const pass = playerPlay.every((v, i)=> v === match[i])

  if(pass){
    await animate(selectedByNum)
    nextRound()
    
  }else {
    youLose()
  }
}


const animate = (index) => {
  return new Promise((resolve) => {

      colors[index].addEventListener('transitionend', ()=> {
        colors[index].classList.remove('colors--active')
        setTimeout(resolve, 200)
      }, {once: true})
    
      colors[index].classList.add('colors--active')
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

  playButton.addEventListener('click', async ()=> {
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

    playButton.setAttribute('disabled', 'true')
    addClickEvent()
  }, {once: true})
}

const formEvent = () => {
  form.classList.remove('form--hidden')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    setPlayerData(e.target.player.value, e.target.difficulty.value)
    e.target.classList.add('form--hidden')
    start()
  })
}

if(sessionStorage.getItem('simonPlayer')){
  start()
}else {
  formEvent()
}

//Bienvenida con el form
//Mensajes al perder o la animacion al score
//dev dependencies parcel no está :O
