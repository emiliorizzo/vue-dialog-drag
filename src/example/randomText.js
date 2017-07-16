const texts = [
  'Your muffins smell like shit, so do your ideas. Erlich Bachman',
  'One of you is the least attractive person I’ve ever seen, and I’m not going to say who. Erlich Bachman',
  'I don\'t trust anyone. It\'s a huge part of my belief system. Gilfoyle',
  'I spilled coffee on it. I\'m a nerd. Gilfoyle',
  'I know, in the fable, Pied Piper led all the children into darkness, but now we\'re doing it. Jared'
]

const rndText = () => {
  return texts[Math.floor(Math.random() * texts.length)]
}

export default rndText
