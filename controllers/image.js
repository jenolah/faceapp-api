const Clarifai = require('clarifai')

const app = new Clarifai.App({
  apiKey: 'b02e488ec3dd437ea01d8dfcd3d4db60',
})

const handleApiCall = async (req, res) => {
  try {
    const data = await app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      req.body.input
    )
    res.json(data)
  } catch (err) {
    res.status(400).json('unable to work with api')
  }
}

const handleImage = async (req, res, db) => {
  const { id } = req.body
  try {
    const entries = await db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')

    if (entries.length) {
      const rankedUsers = await db('users')
        .select('id', 'entries', 'name')
        .rank('rank', db.raw('order by ?? desc', ['entries']))
      res.json(rankedUsers.find(user => user.id === id).rank)
    } else {
      res.status(400).json('User not found')
    }
  } catch (err) {
    res.status(400).json('Error updating entries')
    console.log(err)
  }
}

module.exports = {
  handleImage,
  handleApiCall,
}
