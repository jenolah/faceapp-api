const handleProfileGet = (req, res, db) => {
  const { id } = req.params
  db.select('*')
    .from('users')
    .where({ id: id })
    .then(user => {
      if (user.length) {
        db('users')
          .select('id', 'entries', 'name')
          .rank('rank', db.raw('order by ?? desc', ['entries']))
          .then(rankedUsers => {
            user[0].rank = rankedUsers.find(usr => usr.id === user[0].id).rank
            res.json(user[0])
          })
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('Error getting user'))
}

module.exports = {
  handleProfileGet,
}
