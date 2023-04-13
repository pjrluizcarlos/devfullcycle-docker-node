const express = require('express')
const mysql = require('mysql')

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}

const app = express()

app.get('/', (req, res) => {
    const connection = mysql.createConnection(config)

    return insert(connection)
        .then(() => findAll(connection))
        .then(results => res.send(toResponse(results)))
        .finally(() => connection.end())
})

app.get('/health', (req, res) => {
    res.send({ status: 'OK' })
})

const port = 3000

app.listen(port, () => {
    console.log(`Running on [${port}]`)
})

const findAll = (connection) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * from people', (error, results) => {
            return error ? reject(error) : resolve(results)
        })
    })
}

const insert = (connection) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO people (name) values ('Luiz Carlos')", (error) => {
            return error ? reject(error) : resolve()
        })
    })
}

const toResponse = (people) => {
    const mappedPeople = people.map(value => `<p>- ${value['name']}</p>`).join('')
    return `<h1>Full Cycle Rocks!</h1>${mappedPeople}`
}
