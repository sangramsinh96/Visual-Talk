//To include a module use require()
const express = require("express")
const app     = express()
const http    = require('http')
const server  = http.createServer(app)
const { v4: uuidV4} = require('uuid')
const { ExpressPeerServer } = require('peer')
// const e = require("express")
const peerServer = ExpressPeerServer(server, {
    debug: true
})
const io  = require('socket.io')(server)
const sessions = require('express-session');
const firebase = require('firebase')
require('dotenv').config();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// console.log(process.env);
// var firebaseConfig = {
//     apiKey: process.env.API_KEY_FB,
//     authDomain: process.env.AUTH_DOMAIN_FB,
//     databaseURL: process.env.DATABASE_URL_FB,
//     projectId: process.env.PROJECT_ID_FB,
//     storageBucket: process.env.STORAGE_BUCKET_FB,
//     messagingSenderId: process.env.MESSAGING_SENDER_ID_FB,
//     appId: process.env.APP_ID_FB,
//     measurementId: process.env.MEASUREMENT_ID_FB
// };

const firebaseConfig = {
    apiKey: "AIzaSyDrAds_-vFmHJaTjnzwULL1nrnWvDb-vAU",
    authDomain: "fire-844bd.firebaseapp.com",
    projectId: "fire-844bd",
    storageBucket: "fire-844bd.appspot.com",
    messagingSenderId: "513838798331",
    appId: "1:513838798331:web:97408658ac5a186d43a75e",
    measurementId: "G-BF00SQCMYH"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firebaseDb = firebase.database();

let roomIdToMeetName = {}
let roomIdToStartTime = {}
roomIdToMeetName["yyh-ouxb-qcc"] = "PalPuls";




app.set('view engine', 'ejs') //set default engine when ommitted


app.use(express.static('public'))
app.use(express.json());
app.use('/peerjs', peerServer);
app.use(sessions({ 
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: false,
    resave: false
})); //session middleware

app.get('/', (req, res) => {
    return res.render('home', {url:'decideOption'});
});

app.post('/decideOption', (req, res) => {
    const { op }  = req.body;
    if(op === 1){
        return res.redirect("/newMeeting");
    }
    else if(op === 2) {
        return res.redirect("/joinMeeting");
    }
    else return res.redirect("/");
 });

app.get('/newMeeting', (req, res) => {
   return res.render('newMeet', {url: '/createMeeting'}); 
});

app.post('/createMeeting', (req, res) => {
    const { meetingName, userName}  = req.body;
    roomId = uuidV4();
    roomIdToMeetName[roomId] = meetingName;
    roomIdToStartTime[roomId] = new Date();
    req.session.context = {roomId: roomId, roomName: meetingName, userName: userName};
    return res.redirect(`/${roomId}`);
 });

app.get('/joinMeeting', (req, res) => {
    return res.render('joinMeet', {url: '/openMeeting'}); 
 });

 app.post('/openMeeting', (req, res) => {
    const { meetId, userName}  = req.body;
    let roomId = meetId;
    if(!roomIdToMeetName[roomId]){
        return res.redirect('/joinMeeting');
    }
    let meetingName = roomIdToMeetName[roomId]
    req.session.context = {roomId: roomId, roomName: meetingName, userName: userName};
    return res.redirect(`/${roomId}`);
 });

app.get('/:room', (req,res) => {
    //rendering the view room
    var context = req.session.context;
    // console.log(context);
    if(!context || !roomIdToMeetName[req.params.room]) {
        return res.redirect('/');
    }
    return res.render('room', context)
})

const connectedUser = {}
const usersInRoom   = {}

//This will run whenever someone connects to our webpage
io.on('connection', socket => {
    //Event listeners
    //Event 1: Someone connects to a room
    socket.on('join-room', (roomId, userId, userName) =>{
        // console.log(roomId, userId, userName);
        socket.join(roomId); //current socket joins the room

        if(!connectedUser[roomId]) {
            connectedUser[roomId] = {}
        }
        if(!connectedUser[roomId][userId]) {
            connectedUser[roomId][userId] = [];
            const msgDbRef = firebaseDb.ref(`/msgs/${roomId}`);
            msgDbRef.once('value', (data) => {
                // console.log(data.val());
                if(data.val()) 
                socket.emit("roomChatMsgs", data);
            });
        }
        connectedUser[roomId][userId][0] = userName;
        connectedUser[roomId][userId][1] = false;
        connectedUser[roomId][userId][2] = true;
        connectedUser[roomId][userId][3] = true;
        socket.broadcast.to(roomId).emit('user-connected', userId, userName); //when we join the room, a message is braodcasted to everyone in the same room
        io.to(roomId).emit('autoRefreshParticipantList', 1, userId, connectedUser[roomId][userId]);
        socket.on('sendMessage', (message, senderName, senderId) => {
            const msgDbRef = firebaseDb.ref(`/msgs/${roomId}`);
            const msg = {
                name: senderName,
                userId: senderId,
                text: message
            };
            msgDbRef.push(msg);  

            io.to(roomId).emit('createMessage', senderId, senderName, message);
        });

        socket.on('sendEmoji', (emojiId)=>{
            io.to(roomId).emit('recieveEmoji', emojiId);
        });

        socket.on('showRoomParticipants', (userId) => {
            let participantsList = []
            let userIds = []
            participantsDict = connectedUser[roomId];
            for(var uId in participantsDict){
                if(participantsDict[uId][1]){
                    participantsList.unshift(participantsDict[uId]);
                    userIds.unshift(uId);
                }
                else 
                { 
                    participantsList.push(participantsDict[uId]);
                    userIds.push(uId);
                }
            }
            socket.emit('participantsList', userIds, participantsList);
        });  

        socket.on('sendQuickMessage', (senderId, senderName, message) => {
            io.to(roomId).emit('createMessage', senderId, senderName, message);
            io.to(roomId).emit('createQuickMessage', senderId, senderName, message);
        });

        socket.on('handsRaised', (senderId, senderName, message, handRaised) => {
            connectedUser[roomId][senderId][1] = handRaised; 
            if(handRaised)
            io.to(roomId).emit('createQuickMessage', senderId, senderName, message);
            io.to(roomId).emit('autoRefreshParticipantList', 2, senderId, connectedUser[roomId][senderId]);
        });

        //Show Participants Icons
        socket.on('media', (senderId, vid, aud) => {
            connectedUser[roomId][senderId][2] = aud;
            connectedUser[roomId][senderId][3] = vid;
            io.to(roomId).emit('autoRefreshParticipantList', 3, senderId, connectedUser[roomId][senderId]);
        })

        //Someone leaves the room
        socket.on('disconnect', () => {
            /***
                Handle concurrency issues
            ***/
            delete connectedUser[roomId][userId];
            if(Object.keys(connectedUser[roomId]).length === 0) {
                delete connectedUser[roomId];
            }
            socket.broadcast.to(roomId).emit('user-disconnected', userId, userName);
            
        });    
    });

})

server.listen(process.env.PORT || 3030, () => {
    console.log("Backend is running.");
  });

/* AUTO CLEAR CHAT */
// function autoClear() {
//     currDate = new Date();
//     for(const [key,value] of Object.entries(roomIdToStartTime)){
//         var diffTime = Math.abs(currDate - value);
//         // console.log(key,diffTime);
//         if(diffTime >= 3*24*60*60*1000){  //3days
//             var ref = firebase.database().ref(`/msgs/${key}`);
//             ref.remove();
//             delete roomIdToMeetName[key];
//             delete roomIdToStartTime[key];
//         }

//     }
// }


// setInterval(autoClear, 60*1000); //run this script each minute



/*
EJS: EJS or Embedded Javascript Templating is a templating engine 
used by Node.js. Template engine helps to create an HTML template 
with minimal code. Also, it can inject data & variables into HTML template at the 
client side and produce the final HTML.
The default behavior of EJS is that it looks into the ‘views’ folder for the templates to render. 

******

express.static(root, [options])
This is a built-in middleware function in Express. 
It serves static files and is based on serve-static.

})

******

app.use([path,] callback [, callback...])
Mounts the specified middleware function or functions 
to the specified path: the middleware function is 
executed when the base of the requested path matches path.

******

app.get(path, callback [, callback ...])
Routes HTTP GET requests to the specified path with the specified callback functions.
req object is HTTP request
res is HTTP response


******

socket.io
socket.io is for realtime communication. If two person communicate if they are in same channel.
socket is library which uses websockets, websockets are very famous for asynchronous realtime communication.
Websockets are like internet protocal, but the difference between sockets and http, 
with http a request can go from client to server, server can respond but it can't start a request.
But with socket.io, server can communicate with client or vice-versa, that is socket.io does not need to wait for client
to start a request, hence it is good for real time communication.

socket.io creates a channel(it is like a tube), msg and traffic go through that tube

*/