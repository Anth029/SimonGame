const gameBoard = document.getElementById('colors-container')
const colors = Array.from(gameBoard.children)
const playButton = document.getElementById('play')
let cont = 0

//Los datos que serán guardados
const playerData = {
  username: 'Antho',
  round: 1,
  difficulty: 2
}

const getRandom = () => Math.floor(Math.random() * 4)

//Movimientos del jugador y del juego, para luego ser comparados
const match = [getRandom(), getRandom()]
const playerPlay = []
console.log(match)

const nextRound = () => {
  const playsLeft = playerPlay<match ? true : false
  if(playsLeft){
    player()
  }else {
    playerData.round+=1
    playerPlay.splice(0)
    //Las partidas avanzarán de acuerdo a la dificultad
    for (let i = 0; i < playerData.difficulty; i++) {
      match.push(getRandom())
    }
    console.log(match)
    player()
  }
}

const goodClick = async (clicked) => {
  const selectedByNum = colors.indexOf(clicked)
  playerPlay.push(selectedByNum)
  const pass = playerPlay.every((v, i)=> v === match[i])
  console.log(clicked)
  console.log(playerPlay)
  console.log(pass)

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
  if(playerData.round>1){
    alert(`Has llegado a la ronda ${playerData.round} en la dificultad ${playerData.difficulty}`)
    start()
  }else alert('¡Oh!, eso debió ser un error, ¿Cierto?')
}

const player = () => {
  gameBoard.addEventListener('click', (e)=> {
    const clicked = e.target
    console.log(clicked)
    if(clicked.classList.contains('colors')){
      goodClick(clicked)
    }
  }, {once: true})
}

const start = () => {
  playButton.removeAttribute('disabled')
  playButton.addEventListener('click', ()=> {
    playButton.setAttribute('disabled', 'true')
    
    player()
  }, {once: true})
}

start()

// window.addEventListener('click', e=> {
//   console.log(playerPlay)
// })