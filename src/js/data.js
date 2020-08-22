const testPlayers = [
  {
    player: 'xXJuanXx',
    difficulty: 'maniac',
    score: 1500,
    time: new Date('2020-07-06T12:43:09'),
  },
  {
    player: '_Alex_',
    difficulty: 'hard',
    score: 800,
    time: new Date('2020-12-13T13:33:09'),
  },
  {
    player: 'Bot96',
    difficulty: 'normal',
    score: 500,
    time: new Date('2020-10-28T17:50:09'),
  },
  {
    player: 'Player123',
    difficulty: 'hard',
    score: 300,
    time: new Date('2020-01-15T22:07:09'),
  },
  {
    player: 'Vegetta777',
    difficulty: 'maniac',
    score: 150,
    time: new Date('2020-02-03T10:30:09'),
  },
  {
    player: 'Clementine',
    difficulty: 'normal',
    score: 100,
    time: new Date('2020-11-14T04:43:09'),
  },
  {
    player: 'Albedo',
    difficulty: 'hard',
    score: 100,
    time: new Date('2020-07-25T08:40:09'),
  },
  {
    player: 'Nabe',
    difficulty: 'normal',
    score: 50,
    time: new Date('2020-04-17T10:00:09'),
  },
  {
    player: 'Shalltear',
    difficulty: 'normal',
    score: 50,
    time: new Date('2020-08-01T01:09:09'),
  },
  {
    player: 'OoLeiaoO',
    difficulty: 'normal',
    score: 50,
    time: new Date('2020-01-13T04:43:09'),
  }
]

export const getPlayerData = () => {
  const playerData = sessionStorage.getItem('simonPlayer')

  if (playerData) return JSON.parse(playerData)
  else {
    const newSession = {
      player: '',
      difficulty: '',
      score: 0,
      time: '',
    }
    sessionStorage.setItem('simonPlayer', JSON.stringify(newSession))
    return newSession
  }
}
 
export const setPlayerData = (player, diff, time) => {
  const playerData = getPlayerData()

  if(player) playerData.player = player
  if(diff) playerData.difficulty = diff
  if(time) playerData.time = time

  sessionStorage.setItem('simonPlayer', JSON.stringify(playerData))
}

//Busca los datos almacenados y de no encontrarlos almacena los de prueba
export const getRanking = () => {
  const dataJson = localStorage.getItem('simonRanking')

  if(dataJson) return JSON.parse(dataJson)
  else {
    const orderedPlayers = testPlayers.sort((a, b)=> b.score - a.score)
    localStorage.setItem('simonRanking', JSON.stringify(orderedPlayers))
    return orderedPlayers
  }
}

export const setRanking = () => {
  const savedPlayers = getRanking()
  const playerData = getPlayerData()
  const allPlayers = [...savedPlayers, playerData]
  const orderedPlayers = allPlayers.sort((a, b)=> b.score - a.score)
  const topPlayers = orderedPlayers.slice(0,10)

  localStorage.setItem('simonRanking', JSON.stringify(topPlayers))
}

export const sumScore = (score) => {
  const playerData = getPlayerData()

  if(score) playerData.score+=score
  else playerData.score = 0

  sessionStorage.setItem('simonPlayer', JSON.stringify(playerData))
}