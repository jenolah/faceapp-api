const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body
  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  if (!email || !password) {
    return res.status(400).json('credentials empty')
  }

  //   else if (emailRegex.test(email) || password.length < 3) {
  //     return res.status(400).json('invalid credentials')
  //   }
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => {
            var rank = 0
            db('users')
              .select('id', 'entries', 'name')
              .rank('rank', db.raw('order by ?? desc', ['entries']))
              .then(rankedUsers => {
                rank = rankedUsers.find(usr => usr.id === user[0].id).rank
                user[0].rank = rank
                res.json(user[0])
              })
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('invalid credentials')
      }
    })
    .catch(err => res.status(400).json('invalid credentials'))
}

module.exports = {
  handleSignin,
}
