const gameBoard = document.getElementById('colors-container')
const colors = Array.from(gameBoard.children)
let cont = 0
let round = 0
let difficulty = 1

const getRandom = () => {
  return Math.floor(Math.random() * 4)
}

const match = [getRandom(), getRandom()]
console.log(match)
const playerPlay = []

const oneMoreRound = () => {
  match.push(...Array(difficulty).fill(getRandom()))
}

const wellPlayed = (clicked) => {
  switch(clicked.classList[1]){
    case 'color-a': playerPlay.push(0)
    break
    case 'color-b': playerPlay.push(1)
    break
    case 'color-c': playerPlay.push(2)
    break
    case 'color-d': playerPlay.push(3)
    break
  }
  
  return playerPlay.every((v, i)=> v === match[i])
}

const contin = () => {
  if(playerPlay<match) {
    player()
  }else{
    round++
    oneMoreRound()
    console.log(match)
    playerPlay.splice(0)
    player()
  }
}


const animate = (clicked) => {
  clicked.addEventListener('animationend', ()=> {
    clicked.classList.remove('active')
    contin()
  }, {once: true})
  clicked.classList.add('active')
}

const youLose = (round, difficulty) => {
  if(round>0){
    console.log(`Has llegado a la ronda ${round} en la dificultad ${difficulty}`)
  }else {
    console.log('Ohh, muy mal. ¡Concéntrate!')
  }
}

const player = () => {
  gameBoard.addEventListener('click', (e)=> {
    const clicked = e.target
    if(clicked.classList.contains('colors')){
      if(wellPlayed(clicked)){
        animate(clicked)
      }else {
        youLose(round, difficulty)
      }
    }
  }, {once: true})
}

player()