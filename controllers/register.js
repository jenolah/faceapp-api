const handleRegister = async (req, res, db, bcrypt) => {
  const { email, name, password } = req.body
  const saltRounds = 10

  // sync -- if I do sync, then no need to do it all in the callback
  //   const hash = bcrypt.hashSync(password, saltRounds)

  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,63}$/
  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

  if (!email || !name || !password) {
    return res.status(400).json('credentials cannot be empty')
  } else if (name.length < 3) {
    return res.status(400).json('name cannot be shorter than 3 characters')
  } else if (!emailRegex.test(email)) {
    return res.status(400).json('invalid email')
  } else if (!passwordRegex.test(password)) {
    return res.status(400).json('invalid password')
  }
  const hash = await bcrypt.hash(password, saltRounds)

  try {
    db.transaction(async trx => {
      const loginEmail = await trx
        .insert({
          hash: hash,
          email: email,
        })
        .into('login')
        .returning('email')

      const newUser = await trx('users')
        .insert({
          name: name,
          email: loginEmail[0],
          joined: new Date(),
        })
        .returning('*')

      const rankedUsers = await trx('users')
        .select('id', 'entries', 'name')
        .rank('rank', db.raw('order by ?? desc', ['entries']))

      newUser[0].rank = rankedUsers.find(usr => usr.id === newUser[0].id).rank

      res.json(newUser[0])
    })
  } catch (err) {
    console.log(err)
    res.status(400).json('Unable to register')
  }
}

module.exports = {
  handleRegister,
}
