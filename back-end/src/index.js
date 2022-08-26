import express from "express";
import cors from "cors";
import { user, tweets } from "./dataservise.js";

const server = express();
server.use(cors());
server.use(express.json());

// manipulação de dados
let allTweets = [];

function GET_TWEETS(numberTweets) {
    allTweets = []
    if (tweets.length > numberTweets) numberTweets = tweets.length - numberTweets;
    else numberTweets = 0

    for(let j= user.length-1; j>=0;j--) {
        for (let i = tweets.length-1; i >= numberTweets; i--) {

            if (user[j].username === tweets[i].username) {
                let tweet = tweets[i].tweet;
                allTweets.push({
                    ...user[j],
                    tweet,
                });
            }
        }
    };
    console.log('alltweets '+allTweets.length)
}

// servidor GETS
server.get("/tweets", function (req, res) {
    let query = Number(req.query.page)
    if(!query||query<1){ res.status(400).send('Informe uma página válida!'); return}
    let numberTweets = 10 * query;
    GET_TWEETS(numberTweets);
    res.send(allTweets);

});
server.get("/tweets/:USERNAME", function (req, res) {
    let user = req.params.USERNAME;
    let userTweets = allTweets.find((value) => value.username === user);
    res.send(userTweets);
});


// servidor POSTS
server.post("/sign-up", function (req, res) {
    let userSingUp = req.body;
    let conflict = user.find(value=>value.username===userSingUp.username)
    if(userSingUp.username===''||userSingUp.avatar===''||conflict){
        res.sendStatus(400)
        return
    }
    user.push({
        id: user.length +1,
        ...userSingUp
    });
    res.status(201).send("OK");
});
server.post("/tweets", function (req, res) {
    let newTweets = req.body;
    let _username = req.headers.user;
    let authenticate = user.find(value => value.username === _username)
    if(!authenticate || newTweets.tweet===''){
        res.sendStatus(400)
        return
    }
    tweets.push({
        username: _username,
        id: tweets.length +1,
        ...newTweets,
    });
    res.status(201).send("OK");
});

server.listen(5000);
