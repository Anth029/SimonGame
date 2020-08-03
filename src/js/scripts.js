import { playerPlay, addListener } from './player'
const app = document.getElementById('app')
const gameBoard = document.getElementById('colors-container')
const colors = Array.from(gameBoard.children)

const removeClasses = () => {
  colors.forEach(el => el.classList.remove('active'))
}

const setClass = (index) => {
  gameBoard.children[index].classList.add('active')
}

const getRandom = () => {
  return Math.floor(Math.random()*4)
}

const match = [getRandom(), getRandom()]

const oneMoreRound = () => {
  match.push(getRandom(), getRandom())
}

let index = 0

const draw = () => {
  setClass(match[index]) 

  setTimeout(() => {
    if(index === match.length -1){
      removeClasses()
      addListener()
      return
    } else {
      removeClasses()
      setTimeout(() => {
        index++
        draw()
      }, 300);
    }
    
  }, 2000);

}

draw()

export { colors, match, draw, setClass, removeClasses, oneMoreRound }