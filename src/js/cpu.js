// import {gameBoard, colors, cont, match, oneMoreRound} from './globals'
// import { playerPlay, playerMain } from './player'

const addClass = (num) => {
  colors[num].classList.add('active')
}

const cpuMain = () => {
  if (cont < match.length) {
    addCPUEvents()
    setTimeout(addClass(match[cont]), 300)
    cont++
  }else {
    cont = 0
    playerMain()
  } 
}

const handleCPUEvents = (e) => {
  console.log('cpu')
  e.target.classList.remove('active')
  setTimeout(cpuMain, 100)
}

const addCPUEvents = () => {
  gameBoard.addEventListener('animationend', handleCPUEvents, {once: true})
}

// const removeCPUEvents = () => {
//   gameBoard.removeEventListener('animationend', handleCPUEvents)
// }

window.addEventListener('load', ()=> {
  cpuMain()
})

// export { cpuMain }
