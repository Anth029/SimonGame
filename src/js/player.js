import {
  gameBoard,
  colors,
  match,
  oneMoreRound,
  playerPlay,
  doTheMovement,
} from './globals'
// import { cpuMain } from './cpu'

const complete = () => {
  return playerPlay.length === match.length
}

const nextLevel = () => {
  oneMoreRound()
  playerPlay.splice(0)
  setTimeout(cpuMain, 500)
}

const keepPlaying = () => {}

const sucess = (num) => {
  colors[num].classList.add('active')
  if (complete()) {
    console.log('Ganaste!')
    nextLevel()
  } else {
    setTimeout(playerMain(), 1000)
  }
}

const fail = () => {
  if (confirm('¡Fallaste! \n ¿Jugar otra vez?')) {
    playerPlay.splice(0)
    cpuMain()
  } else {
    alert('Hasta la próxima!')
  }
}

const colorSelected = (el) => {
  playerPlay.push(el)
  const wellPlayed = playerPlay.every((v, i) => v === match[i])
  wellPlayed ? sucess(el) : fail()
}
