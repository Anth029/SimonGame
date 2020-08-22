import { getPlayerData, setPlayerData, getRanking, setRanking, sumScore } from './data'
import { colorAudioPlay, sectionAudioPlay } from './audio'

const gameBoard = document.getElementById('colors-container')
const colors = Array.from(gameBoard.children)
const form = document.getElementById('ingame-form')
const playersList = document.getElementById('players-list')
const match = []
const playerPlay = []
const getRandom = () => Math.floor(Math.random() * 4)
const logout = document.getElementById('logout')
const clonedEl = form.children[0].cloneNode(true)

const main = () => {
  if(sessionStorage.getItem('simonPlayer')){
    form.children[0].innerHTML = 
      `<p class="form__player-name">${getPlayerData().player}<p>`
    showLogout()
    play()
  } else userRegister()

  showRanking()
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

//Función para que el usuario pueda cambiar dificultad entre partidas
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

const start = async () => {
  try{
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
  }catch(error){
    console.log(error)
  }
}

//Resuelve promesas al finalizar cada animación. Al acabar con todas, se resuelve la promesa contenedora
const animateCPU = async () => {
  const animate = (index) => {
    return new Promise((resolve, reject) => {
        colors[index].addEventListener('transitionend', ()=> {
          colors[index].classList.remove('game__color--active')
          colorAudioPlay(index)
          if(logout.classList.contains('logout--disabled')) reject('User has logged out')
          else setTimeout(resolve, 300)
        }, {once: true})
      
        colors[index].classList.add('game__color--active')
    })
  }
  for (const v of match) {
    await Promise.resolve(animate(v))
  }
}

const handleClick = (e) => {
  if(e.target.classList.contains('game__color')){
    removeClickListener()
    goodClick(e.target)
  }
}

const addClickListener = () => {
  gameBoard.addEventListener('click', handleClick)
  colors.forEach((v, i) => i < 4 && v.classList.add('game__color--player-turn'))
}

const removeClickListener = () => {
  gameBoard.removeEventListener('click', handleClick)
  colors.forEach((v, i) => i < 4 && v.classList.remove('game__color--player-turn'))
}

const goodClick = (clicked) => {
  const selectedByNum = colors.indexOf(clicked)
  colorAudioPlay(selectedByNum)
  playerPlay.push(selectedByNum)
  const pass = playerPlay.every((v, i) => v === match[i])
  pass ? nextRound() : youLose()
}

const nextRound = () => {
  const playsLeft = playerPlay < match ? true : false

  if (playsLeft) addClickListener()
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
    sectionAudioPlay(1)
    clear('round')
  }
}

const youLose = () => {
  sectionAudioPlay(0)
  setPlayerData(undefined, undefined, new Date())
  setRanking()
  showRanking()
  play()
}

const clear = async (what) => {
  try {
    if (what === 'round') {
      playerPlay.splice(0)
      await new Promise((res) => setTimeout(()=> res(), 600))
      await animateCPU()
      addClickListener()
    } else if (what === 'match') {
      playerPlay.splice(0)
      match.splice(0)
      sumScore()
    }
  }catch(error){
    console.log(error)
  }
}

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

const showRanking = () => {
  const players = getRanking()
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

main()