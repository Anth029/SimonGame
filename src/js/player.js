import { colors, match, draw, setClass, removeClasses, oneMoreRound } from './scripts'
const gameBoard = document.getElementById('colors-container')

const playerPlay = []

const colorSelected = (el) => {
  playerPlay.push(el)
  clearListener()
  const wellPlayed = playerPlay.every((v, i) => v === match[i])
  if(wellPlayed){
    if (playerPlay.length === match.length){
      console.log('Ganaste!')
    }else {
      addListener()
    }
  }else {
    console.log('Perdiste!')
  }

}

const handleClick = (e) => {
  if (e.target.classList.contains('colors')) {
    switch (e.target.classList[1]) {
      case 'color-a':
        colorSelected(0)
        break
      case 'color-b':
        colorSelected(1)
        break
      case 'color-c':
        colorSelected(2)
        break
      case 'color-d':
        colorSelected(3)
        break
    }
  }
}

const clearListener = () => {
  colors.forEach((el) => el.classList.remove('player-turn'))
  gameBoard.removeEventListener('click', handleClick, { capture: true })
}

const addListener = () => {
  colors.forEach((el) => el.classList.add('player-turn'))
  gameBoard.addEventListener('click', handleClick, { capture: true })
}

export { playerPlay, addListener }
