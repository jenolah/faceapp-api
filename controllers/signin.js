const handleSignin = async (req, res, db, bcrypt) => {
  const { email, password } = req.body
  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  if (!email || !password) {
    return res.status(400).json('credentials empty')
  } else if (!emailRegex.test(email)) {
    return res.status(400).json('invalid email format')
  }

  try {
    const data = await db
      .select('email', 'hash')
      .from('login')
      .where('email', '=', email)

    try {
      //does it make sense to use a try-catch here? is there a better way of ensuring that data has a value?
      var isPassValid = await bcrypt.compare(password, data[0].hash)
    } catch {
      return res.status(400).json('invalid credentials')
    }

    if (isPassValid) {
      const user = await db
        .select('*')
        .from('users')
        .where('email', '=', email)

      const rankedUsers = await db('users')
        .select('id', 'entries', 'name')
        .rank('rank', db.raw('order by ?? desc', ['entries']))

      user[0].rank = rankedUsers.find(usr => usr.id === user[0].id).rank
      res.json(user[0])
    } else {
      res.status(400).json('invalid credentials')
    }
  } catch (err) {
    res.status(400).json('unable to get user')
    console.log(err)
  }
}

module.exports = {
  handleSignin,
}
