// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Run = require('./models/Trails');
const User = require('./models/User');
const Video = require('./models/Videos');
const Condition = require('./models/Conditions');
const run_data = require('./run_data');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server started on ' + port);

// attempt to connect to MongoDB
mongoose.connect('mongodb+srv://longguan:LONGGUAN1031@cluster0.v0mpiiu.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Database Connection Successfull");
    })
    .catch((err) => { console.log("Database Connect Unsuccessful, Received an Error", err) })

// import run data if it is not in database
async function importRunData(run_data) {
    console.log(run_data);
    const runData = await Run.find({}).exec();
    if (runData.length === 0) {
        for (let data of run_data) {
            const run = new Run ({
                id: data["name"],
                title: data["title"],
                category: data["category"],
            })
            await run.save()
        }
    } else {
        console.log("RunData/Documents already added!")
    }
}

// Create a new Run
router.post('/runs', async (req, res) => {
    const { id, title, category } = req.body;
    try {
        const run = new Run ({id, title, category});
        await run.save();
        res.send(run);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

// Get all Runs
router.get('/runs', async (req, res) => {
    try {
        const runs = await Run.find({});
        res.send(runs);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// create new user
router.post('/user', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User ({ username, password });
        await user.save();
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

// add a video to a run
router.post('/video', async (req, res) => {
    const { src, run_id, username, created_at} = req.body;
    try {
        const video = new Video ({src, run_id, username, created_at});
        await video.save();
        res.send(video);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

// add a condition to a run
router.post('/condition', async (req, res) => {
    const { run_id, username, snow_condition, trail_feature, date, comment, created_at } = req.body;
    try {
        const condition = new Condition({run_id, username, snow_condition, trail_feature, date, comment, created_at});
        await condition.save();
        res.send(condition);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
})

importRunData(run_data);
