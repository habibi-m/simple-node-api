const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const user = require('./user')
var cors = require('cors');


const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());


app.get('/api', async (req, res, next) => {
    res.status(200).json({ app_info: "Mock rest api", api_version: "1.0.1" });
});

app.get('/api/users', user.getUsers);
app.get('/api/users/:id', user.getUserById)
app.post('/api/users', user.createUser)
app.put('/api/users/:id', user.updateUser)
app.delete('/api/users/:id', user.deleteUser)


const port = process.env.PORT || 8070
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
