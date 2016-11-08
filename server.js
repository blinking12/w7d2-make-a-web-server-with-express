// Libraries
var express = require('express')
var nunjucks = require('nunjucks')
var bodyParser = require('body-parser')
var multer = require('multer')

// Setup

var port = process.env.PORT || 8080
var app = express()
// var upload = multer({ dest: 'public/uploads/' })

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

nunjucks.configure('views', {
    autoescape: true,
    express: app
})

app.post('/photos', upload.single('photo'), (req, res) => {
    res.render('photo.html', {
        photo: req.file.originalname,
        caption: req.body.caption
    })
})


app.get('/', (request, response) => {
    //console.log(request.baseUrl)
    if (request.query.api_token === '12345' && request.query.username === 'troy') {
        response.render('loggedin.html', {
            username: request.query.username,
            queryStuff: request.query,
            users: ['collin', 'jeff', 'troy']
        })
    }
    else {
        response.render('loggedout.html')
    }
})

app.get('/api/users', (req, res) => {
    var users = [
        {
            id: 1,
            name: 'Joe'
        },
        {
            id: 2,
            name: 'Sue'
        }
    ]

    res.json(users)
})


app.use(express.static('public'))



app.listen(port)
console.log('Public Server http://localhost:' + port)
console.log('Press CTRL+C To Exit')
