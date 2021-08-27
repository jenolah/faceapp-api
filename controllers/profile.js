const handleProfileGet = async (req, res, db) => {
  const { id } = req.params
  try {
    const user = await db
      .select('*')
      .from('users')
      .where({ id: id })

    if (user.length) {
      const rankedUsers = await db('users')
        .select('id', 'entries', 'name')
        .rank('rank', db.raw('order by ?? desc', ['entries']))

      user[0].rank = rankedUsers.find(usr => usr.id === user[0].id).rank
      res.json(user[0])
    } else {
      res.status(400).json('Not found')
    }
  } catch (err) {
    res.status(400).json('Error getting user')
    console.log(err)
  }
}

module.exports = {
  handleProfileGet,
}
