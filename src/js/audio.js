import { A, B, C, D, sectionpass, sectionfail } from '../assets/sound/*.mp3'

const colorsAudio = [
  {audio: new Audio(A)},
  {audio: new Audio(B)},
  {audio: new Audio(C)},
  {audio: new Audio(D)}
]

export const colorAudioPlay = (colorClicked) => {
  colorsAudio.forEach(a=>a.audio.pause())
  colorsAudio.forEach(a=>a.audio.currentTime = 0)
  colorsAudio[colorClicked].audio.play()
}

const sectionAudio = [
  {audio: new Audio(sectionfail)},
  {audio: new Audio(sectionpass)}
]

export const sectionAudioPlay = (index) => {
  sectionAudio[index].audio.play()
}
