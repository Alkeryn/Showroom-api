const root=process.cwd()
const database = require(root+"/database.json")

const { Client } = require('pg')
const client = new Client(database)
var test = async function(){
    const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    console.log(res.rows[0].message) // Hello world!
    await client.end()
}
test()
