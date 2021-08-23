const Clarifai = require('clarifai')

const app = new Clarifai.App({
  apiKey: 'b02e488ec3dd437ea01d8dfcd3d4db60',
})

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data)
    })
    .catch(err => res.status(400).json('unable to work with api'))
}

const handleImage = (req, res, db) => {
  const { id } = req.body

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      if (entries.length) {
        res.json(entries[0])
      } else {
        res.status(400).json('User not found')
      }
    })
    .catch(err => res.status(400).json('Error updating entries'))
}

module.exports = {
  handleImage,
  handleApiCall,
}
