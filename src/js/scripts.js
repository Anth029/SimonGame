import { playerPlay, addPlayerListeners } from './player'
const gameBoard = document.getElementById('colors-container')
const colors = Array.from(gameBoard.children)
let index = 0
let difficult = 1
const transitionend = [false, false]

const getRandom = () => {
  return Math.floor(Math.random() * 4)
}

const match = [getRandom(), getRandom()]

const oneMoreRound = () => {
  match.push(...Array(difficult).fill(getRandom()))
}

const removeClasses = () => {
  colors.forEach((el) => el.classList.remove('active'))
}

const addClass = () => {
  if (index < match.length) {
    const magicNumber = match[index]
    colors[magicNumber].classList.add('active')
    index++
  } else {
    index = 0
    if(confirm('otra?')){
      oneMoreRound()
      addCPUEvents()
      main()
    }
    // addPlayerListeners()
  }
}

const main = () => {
  transitionend.fill(false)
  addClass()
}

const handleCPUEvents = () => {
  //First end
  if (!transitionend[0]) {
    transitionend[0] = true
    removeClasses()
  }
  //Second end
  else if (!transitionend[1]) {
    transitionend[1] = true
    main()
  }
}

const addCPUEvents = () => {
  gameBoard.addEventListener('transitionend', handleCPUEvents, {
    capture: false,
  })
  window.addEventListener('load', main, { capture: false })
}

const removeCPUEvents = () => {
  gameBoard.removeEventListener('transitionend', handleCPUEvents, {
    capture: false,
  })
  window.removeEventListener('load', main, { capture: false })
}

addCPUEvents()

export { colors, match, addCPUEvents, removeCPUEvents, oneMoreRound, main, index }
