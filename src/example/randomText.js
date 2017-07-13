const texts = [
  'The sky was cloudless and of a deep dark blue.',
  'Waves flung themselves at the blue evening.',
  'All their equipment and instruments are alive.',
  'A red flair silhouetted the jagged edge of a wing.',
  'I watched the storm, so beautiful yet terrific.'
]

const rndText = () => {
  return texts[Math.floor(Math.random() * texts.length)]
}

export default rndText
