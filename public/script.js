// import { chatButton, participantButton, videoContainer, chatsContainer, participantsContainer, participantContent, 
//     cic1, cic2, endButton, audiocontrol, videocontrol, screensharecontrol, deafencontrol, audiocontrolli, 
//     screencontrolli, videocontrolli, invite, emojidiv, emojiControl, quickChatControl, quickChatdiv } from "./js/elements.js";

// import { participantButtonEventListener } from "./js/participants.js";
// import "./js/participants.js";

let myId = ""
const videoGrid = document.getElementById("video-grid-1")
const meetingNameElem = document.getElementById("meeting-name");
meetingNameElem.innerHTML = `<h3>${meetingName}</h3>` 
const socket = io('/') //socket connect to the root path


var chatButton=document.getElementById("chat");
var participantButton=document.getElementById("participants");
var videoContainer=document.getElementById("video-container");
var chatsContainer=document.getElementById("chats-container");
var participantsContainer=document.getElementById("participants-container");
var participantContent = document.getElementById("participants-content")
var cic1=document.getElementById("control-icons-container");
var cic2=document.getElementById("control-icons-container2");
var endButton=document.getElementById("end-call-div");
var audiocontrol=document.getElementById("audio-control");
var videocontrol=document.getElementById("video-control");
var screensharecontrol=document.getElementById("screen-control");
var deafencontrol=document.getElementById("deafen-control");
var audiocontrolli=document.getElementById("audio-control-li");;
var screencontrolli=document.getElementById("screen-control-li");;
var videocontrolli=document.getElementById("video-control-li");
var invite=document.getElementById("copy-link");
var emojidiv=document.getElementById("emoji-div");
var emojiControl=document.getElementById("emoji-control");
var quickChatControl=document.getElementById("quickChat-control");
var quickChatdiv=document.getElementById("quickChat-div");



var peer = new Peer(undefined, {
    // path: '/peerjs',
    // host: '/',
    // port: '443',
    // config: {'iceServers': [
    //     {url:'stun:stun.l.google.com:19302'},
    //     {url:'stun:stun1.l.google.com:19302'},
    //     {url:'stun:stun2.l.google.com:19302'},
    //     {url:'stun:stun3.l.google.com:19302'},
    //     {url:'stun:stun4.l.google.com:19302'},
        
    //     /*
    //     {   //turn server syntax
    //         url:["turn:IP_ADDRESS:PORT_NO?transport=tcp"], 
    //         username: 'USER_NAME', 
    //         credential: 'PASSWORD'   
    //     }
    //     */

    //   ]} 
});




let myVideoStream;
let animationNo = 1;
let cameraStream;
const peers = {}
const peers_ss = {}

//UI for Video Elements
function newvideorules(){
    var allvideos=document.getElementsByTagName("video");

        n=allvideos.length;
            if(n==1){

                     allvideos[0].style.width="80%";
                    allvideos[0].style.height="95%";

            }
            else if(n==2){
                
                for(i=0;i<n;i++){
                    allvideos[i].style.width="43%";
                    allvideos[i].style.height="95%";
            }
    
            }
          else if(n<=4){
           
               
             for(i=0;i<n;i++){
                 allvideos[i].style.width="35%";
                 allvideos[i].style.height="48%";
         }
        }
        else{
             var allvideos=document.getElementsByTagName("video");
             for(i=0;i<n;i++){
                allvideos[i].style.width="30%";
                allvideos[i].style.height="48%";
             }
    
         }

}


//media permission 
//access media
const myVideo = document.createElement('video'); //https://www.w3schools.com/jsref/dom_obj_video.asp
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    cameraStream = stream;
    myVideoStream = stream;
    addVideoStream(myVideo, stream, "myVideo");
    //answer call of the new user
    peer.on('call', (call) => {
        //answer the call by sending our videostream
        call.answer(stream);
        const video = document.createElement('video');
        //waiting for receiving user Video stream
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream, call.peer);
            peers_ss[call.peer]=call.peerConnection;
            peers[call.peer] = call;
            newvideorules();

        });
    });

    //event listener for event user-connected
    socket.on('user-connected', (userId,userName) => {
        // console.log('user-connected', userId);
        connecToNewUser(userId, stream);
    });

    socket.on("roomChatMsgs", (chatData) => {
        addOldChatMsgs(chatData);
    });

    let txtmsg = $("input");
    $('html').keydown(function(e){
        if(e.which == 13 && txtmsg.val().length !== 0){
            socket.emit('sendMessage', txtmsg.val(), myName, myId);
            txtmsg.val('');
        }
    });
    socket.on('createMessage', (senderId, senderName, message) => {
        addMsg(senderId, senderName, message);
    });

    socket.on('createQuickMessage', (senderId, senderName, message) => {
        message = `${senderName} - ${message}`;
        generateQuickMessage(message);
    });
    socket.on('recieveEmoji', (emojiId)=> {
        generareEmojis(emojiId);
    });

    socket.on('autoRefreshParticipantList', (opType, userId, userVariables)=>{
        autoRefreshParticipantList(opType, userId, userVariables);
    });


})

 //event listener for event user-disconnected
 socket.on('user-disconnected', (userId, userName) => {
    if(peers[userId]){ 
        autoRefreshParticipantList(4, userId, []);
        // console.log(userId, userName);
        const vidElement = document.getElementById(userId);
        if(vidElement) vidElement.remove();
        peers[userId].close();
        newvideorules();
        
    }
});


peer.on('open', Id => {
    myId = Id;
    socket.emit('join-room', RoomId, Id, myName);
})

// call new user
const connecToNewUser = (userId, stream) => {

    //call the user with userId, pass in our stream to him
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    //wait for getting the stream of user with userId
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream, userId);
        newvideorules();
    });
    peers[userId] = call;
    peers_ss[userId]=call.peerConnection;
    
}

//appending video to VideoGrid
const addVideoStream = (video, stream, help) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
    video.setAttribute('id', help);
    video.setAttribute('onclick', "pinVideo(this.id)");
    
}

const addOldChatMsgs = (chatDataObj) => {
    // console.log(chatData);
    for (const [key,value] of Object.entries(chatDataObj)) {
        addMsg(value['userId'], value['name'], value['text']);
        // console.log(value['userId'], value['name'], value['text']);
    }

};

var notified = false;
const addMsg = (senderId, senderName, message) => {
    var myDiv = document.getElementById("main-chat-container");

    if(!notified && senderId !== myId && 
        (chatButton.getAttribute("data-clicked")=="no" )) 
    {
        notified = true;
        chatButton.src = "icons/chat-unread.svg";
        const audio = new Audio("sounds/newMsg.mp3");
        audio.play();
    }

    
    className = "remote-chat-content"            
    if(senderId == myId){
        className = "my-chat-content"            
    }
    $("#main-chat-container").append(`<div class="${className}"><div><small>${senderName}</small><br><div class="chat-message">${message}</div></div></div><br>`);
    scrollToBottom();
}

var videoPinned = false;
var pinnedVideoId = "";
const pinVideo = (id) => {
    // console.log(document.getElementById(id));
    console.log("VideoElementClicked", id);
    if(videoPinned && pinnedVideoId != id){
        // console.log("Another Video Is Pinned Already");
        alert("Can't pin this video as another video is pinned");
    }
    else if(videoPinned){
        // console.log("removing pinned video");
        videoPinned = false;
        pinnedVideoId = "";
        newvideorules();
    }
    else {
        // console.log("Pinning the video");
        videoPinned = true;
        pinnedVideoId = id;
        var allvideos=document.getElementsByTagName("video");
        var ind = -1
        var n=allvideos.length;  
          
        for(i=0;i<n;i++){
            if(allvideos[i].getAttribute('id')===id){
                allvideos[i].style.width= "80%";
                allvideos[i].style.height="95%";
                ind = i
            }
            else {
                allvideos[i].style.width ="30%";
                allvideos[i].style.height="48%";
        
            }
        }
        if(ind > -1){
            const pinnedElem = allvideos[ind];
            allvideos[ind].remove();
            const element    = document.getElementById("video-grid-1");
            element.insertBefore(pinnedElem, element.childNodes[0]);
        }
    }

};

//Leave Meeting
const leaveMeeting = () => {
    socket.disconnect();
    window.location.href = "/";
}

//Mute or Unmute Audio
const muteUnmute = () => {

    const enabled = cameraStream.getAudioTracks()[0].enabled;
    if(enabled) {
        cameraStream.getAudioTracks()[0].enabled = false;
        audiocontrol.src="icons/AudioOff.png";
        audiocontrolli.style.backgroundColor="#c82333";
        socket.emit('media', myId, cameraStream.getVideoTracks()[0].enabled, cameraStream.getAudioTracks()[0].enabled)
    }
    else {
        cameraStream.getAudioTracks()[0].enabled = true;
        audiocontrol.src="icons/Audio.png";
        audiocontrolli.style.backgroundColor="#2D3337";
        socket.emit('media', myId, cameraStream.getVideoTracks()[0].enabled, cameraStream.getAudioTracks()[0].enabled)
    }
}

//On or Off Video
const playStop = () => {
    let enabled = cameraStream.getVideoTracks()[0].enabled;
    if(enabled) {
        cameraStream.getVideoTracks()[0].enabled = false;
        videocontrol.src="icons/CameraOff.png";
        videocontrolli.style.backgroundColor="#c82333";
        socket.emit('media', myId, cameraStream.getVideoTracks()[0].enabled, cameraStream.getAudioTracks()[0].enabled)
    }
    else {
        cameraStream.getVideoTracks()[0].enabled = true;
        videocontrol.src="icons/Camera.png";
        videocontrolli.style.backgroundColor="#2D3337";
        socket.emit('media', myId, cameraStream.getVideoTracks()[0].enabled, cameraStream.getAudioTracks()[0].enabled)
    }
}


const scrollToBottom = () => {
    var myDiv = document.getElementById("main-chat-container");
    myDiv.scrollTop = myDiv.scrollHeight;
}

var ss = false;
const shareScreen = () => {
    
    if(!ss) {
        
        startScreenShare();
    }
    else {
        myVideoStream.getVideoTracks()[0].stop();
        stopScreenShare();
    }
}

const startScreenShare = () => {

    navigator.mediaDevices.getDisplayMedia({
        video: {
            cursor: true
        },
        audio: {
            echocancellation: true,
            noiseSuppresson: true
        }
    }).then(stream => {
        myVideoStream=stream;
        const videoTrack = myVideoStream.getVideoTracks()[0];
        videoTrack.onended = () => {
            stopScreenShare();
        }
        for(let v of Object.values(peers_ss)){
        const sender = v.getSenders().find(function(s){
           
            return s.track.kind === videoTrack.kind;}
            )
            sender.replaceTrack(videoTrack);

        }
       
        addVideoStream(myVideo, myVideoStream);
        ss=true;
        screensharecontrol.src="icons/ScreenShare.png";
    })
}

const stopScreenShare = () => {
    
    myvideoStream=cameraStream;
    const videoTrack =cameraStream.getVideoTracks()[0];
    for(let v of Object.values(peers_ss)){
       const sender = v.getSenders().find(function(s){
          
           return s.track.kind === videoTrack.kind;}
           )
           console.log(sender);           
           sender.replaceTrack(videoTrack);

       }

    addVideoStream(myVideo, cameraStream);
    ss=false;
    screensharecontrol.src="icons/Screen.png";

}

const emojiReaction = (emojiId) => {
    socket.emit('sendEmoji', emojiId);
};

const generareEmojis = (emojiId) => {
    const element = document.createElement('div');
    element.className = "emoji";
    element.style.backgroundImage = `url("../icons/emojis/${emojiId}.png")`;
    document.getElementById("whole").appendChild(element);
    animationNo = 1-animationNo;
    console.log(document.getElementById("whole"));
    console.log(`url("../icons/emojis/${emojiId}.png")`);
    console.log( `emoji emoji_animate${animationNo+1}`);
    setTimeout(() => {
        element.className = `emoji emoji_animate${animationNo+1}` ;
        setTimeout(()=>{
        element.remove();
        }, 1510)   
    }, 10);
};
var handRaised = false;
const raiseHand = () => {
    message = "Raised their hands";
    handRaised = !handRaised;
    socket.emit('handsRaised', myId, myName, message, handRaised);   
}
const quickMessage = (msgNo) => {
    message = "Am I Audible?";
    if(msgNo===2){
        message = "Yes";

    }
    else if(msgNo===3){
        message = "No";
    }
    socket.emit('sendQuickMessage', myId, myName, message);
}
 
const generateQuickMessage = (message) => {
    const element = document.getElementById("quickMessage");
    const text    = document.getElementById("qMText");
    setTimeout(() => {
        element.style.display = "flex";
        text.innerHTML = `${message}`;
        setTimeout(()=>{
            element.style.display = "none";
        }, 3000);

    },1) ;

} 


const showParticipants = () => {
    socket.emit('showRoomParticipants', myId);
    socket.once('participantsList', (participantIDs, participantsDetails) => {
        let ind = 0;
        for(const participant of participantsDetails) {
            let userID = participantIDs[ind]; ind += 1;
            let initial = participant[0].length ? participant[0][0] : 'U'; 
            let handIcon =  participant[1] ? "icons/hand1.png" : "";
            let audioIcon = participant[2] ? "icons/Audio.png" : "icons/AudioOff.png"; //mute & Unmute
            let videoIcon = participant[3] ? "icons/Camera.png" : "icons/CameraOff.png"; //video on & off
            
            styleEl = `""`;
            if(participant[1]) styleEl = `"height:18px;width:18px;"`;
            $("#participants-content").append(`
                <div class="participants" id="${userID}-participant">
                    <div class = "participantImage" id = "${userID}-img">${initial}</div>
                    <span class="participant-name" id = "${userID}-name">${participant[0]}</span>
                    <div class="participants-control">
                        <img src="${audioIcon}" id = "${userID}-aud">
                        <img src="${videoIcon}" id = "${userID}-vid">
                        <img src="${handIcon}" style=${styleEl} id="${userID}-hand"></div>
                    </div>
                </div>            
            `);  
        }
    });
}

const participantButtonEventListener = () => {
           
    if(participantButton.getAttribute("data-clicked")=="no"){
        participantContent.innerHTML = "";
        videoContainer.style.width="75%";
        participantButton.setAttribute("data-clicked","yes");
        chatButton.setAttribute("data-clicked","no");
        participantsContainer.style.display="block";
        chatsContainer.style.display="none";
        // participantButton.style.backgroundColor="2px solid #34BD1E";
        participantButton.style.backgroundColor="#34BD1E";
        chatButton.style.backgroundColor="transparent";
        cic1.style.left="10vw";
        cic2.style.left="40vw";
        endButton.style.left="32.3vw";
        invite.style.right="28vw";
        emojidiv.style.left="36vw";
        quickChatdiv.style.left="42vw";
        participantContent.innerHTML = "";
        showParticipants();

    }
   else{
        videoContainer.style.width="95%";
        chatButton.setAttribute("data-clicked","no");
        participantButton.setAttribute("data-clicked","no");
        chatsContainer.style.display="none";
        participantsContainer.style.display="none";
        participantButton.style.backgroundColor="transparent";
        cic1.style.left="18vw";
        cic2.style.left="48vw";
        endButton.style.left="40.3vw";
        invite.style.right="10vw";
        emojidiv.style.left="44vw";
        quickChatdiv.style.left="50vw";
    }
};

const autoRefreshParticipantList = (opType, userID, participant) => {
    // opType: 1-> new participant, 2->handRaised, 3->video/audio on off, 4->User leave 
    if(participantButton.getAttribute("data-clicked")=="yes"){
        if(opType === 1){

            let initial = participant[0].length ? participant[0][0] : 'U'; 
            let handIcon =  participant[1] ? "/icons/hand1.png" : "";
            let audioIcon = participant[2] ? "/icons/Audio.png" : "/icons/AudioOff.png"; //mute & Unmute
            let videoIcon = participant[3] ? "/icons/Camera.png" : "/icons/CameraOff.png"; //video on & off
            
            styleEl = `""`;
            if(participant[1]) styleEl = `"height:18px;width:18px;"`;
            $("#participants-content").append(`
                <div class="participants" id="${userID}-participant">
                    <div class = "participantImage" id = "${userID}-img">${initial}</div>
                    <span class="participant-name" id = "${userID}-name">${participant[0]}</span>
                    <div class="participants-control">
                        <img src="${audioIcon}" id = "${userID}-aud">
                        <img src="${videoIcon}" id = "${userID}-vid">
                        <img src="${handIcon}" style=${styleEl} id="${userID}-hand"></div>
                    </div>
                </div>            
            `);  
        }

        else if(opType === 2){
            let handIcon =  participant[1] ? "/icons/hand1.png" : ""; 
            const handElm = document.getElementById(`${userID}-hand`);
            let styleEl = "";
            if(participant[1]) styleEl = "height:18px;width:18px;";

            handElm.src = `${handIcon}`;
            handElm.style = `${styleEl}`;

            if(participant[1]){
                const participantElem = document.getElementById(`${userID}-participant`);
                participantElem.remove();
                const element    = document.getElementById("participants-content");
                element.insertBefore(participantElem, element.childNodes[0]);    

            }

        }
        else if(opType === 3){
            let audioIcon = participant[2] ? "/icons/Audio.png" : "/icons/AudioOff.png"; //mute & Unmute
            let videoIcon = participant[3] ? "/icons/Camera.png" : "/icons/CameraOff.png"; //video on & off

            const vidElm = document.getElementById(`${userID}-vid`);
            const audElm = document.getElementById(`${userID}-aud`);
            vidElm.src = `${videoIcon}`;
            audElm.src = `${audioIcon}`;
        }

        else if(opType === 4) {
            const participantElem = document.getElementById(`${userID}-participant`);
            participantElem.remove();
        }
         
    }
};

const copyToClipBoard = () => {
    var url_ = window.location.pathname;
    var url = "";
    for(let i=1; i<url_.length; ++i){
        if(url_[i]=='/')
            break;
        url += url_[i];
    }
    // console.log(url, url_);
    const elem = document.createElement("textarea");
    elem.value = url;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
};

chatButton.addEventListener("click",function(){
          
    if(chatButton.getAttribute("data-clicked")=="no"){
        notified = false;
        chatButton.src = "icons/chat-activate.svg";
        videoContainer.style.width="75%";
        chatButton.setAttribute("data-clicked","yes");
        participantButton.setAttribute("data-clicked","no");
        chatsContainer.style.display="block";
        chatButton.style.backgroundColor="#34BD1E";
        participantButton.style.backgroundColor="transparent";
        participantsContainer.style.display="none";
        cic1.style.left="10vw";
        cic2.style.left="40vw";
        endButton.style.left="32.3vw";
        invite.style.right="28vw";
        emojidiv.style.left="36vw";
        quickChatdiv.style.left="42vw";

    }
   else{
        videoContainer.style.width="95%";
        chatButton.setAttribute("data-clicked","no");
        participantButton.setAttribute("data-clicked","no");
        chatsContainer.style.display="none";
        chatButton.style.backgroundColor="transparent";
        cic1.style.left="18vw";
        cic2.style.left="48vw";
        endButton.style.left="40.3vw";
        invite.style.right="10vw";
        emojidiv.style.left="44vw";
        quickChatdiv.style.left="50vw";
        
    }
});

function quickChatappear(){
   quickChatdiv.style.display="block";

}
function quickChatdisappear(){
quickChatdiv.style.display="none";

}

function emojiappear(){
   emojidiv.style.display="block";

}
function emojidisappear(){
emojidiv.style.display="none";

}