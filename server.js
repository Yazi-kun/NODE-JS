const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.status(200).render('index');
})

app.post('/register', (req, res) => {
    console.log(req.body);
    fs.readFile(`${__dirname}/database.txt`, (err, data) => {
        if(err) throw err;

        console.log(data);
        const users = JSON.parse(data.toString());
        users.push(req.body);
        
        fs.writeFile(__dirname+'/database.txt', JSON.stringify(users), (err) => {
            if(err) throw err;
            console.log('Livre ajouté')
            res.redirect('/user');
        })
    })
})

app.get('/user', (req, res) => {
    fs.readFile(__dirname+'/database.txt', (err, data) => {
        if(err) throw err;

        const users = JSON.parse(data.toString());
        
        res.status(200).render('user', {
            users: users
        })
    }) 
})
app.get('/signin', (req, res) => {
    res.status(200).render('signin');
})
app.post('/signin', (req, res) => {

    console.log(req.body);
    fs.readFile('./database2.txt', (err, data) => {
        if(err) throw err;
        const users = JSON.parse(data);

        //1er methode
        const user = users.find((user) => user.email == req.body.email)
        if(user){
            
            res.status(200).json('User already exist');
        }
        else
        {
            users.push(req.body)
            fs.writeFile('./database2.txt', JSON.stringify(users), (err) => {
                if(err) throw err;
                res.status(200).send('User added successfuly');
            })
        }
    })
})


app.get('/user/:isbn', (req,res) => {
    fs.readFile(`${__dirname}/database.txt`, (err, data) => {
        if(err) throw err

        const users = JSON.parse(data.toString());
        const user = users.find((user, index) => user.isbn == req.params.isbn); 
        console.log(user);
        res.status(200).render('profil', {
            user: user //l'auteur trouvé en utilisant find est
        })
    })
})

app.listen(3000, () => {
    console.log('Server opened on port 3000');
})