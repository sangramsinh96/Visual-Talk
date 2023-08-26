<br />
<p align="center">
  <h1 align="center">Visual Talk</h1>
<!--   <h3 align="center" > Microsoft Engage Mentorship Program 2021 </h3> -->
  
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#disclaimer">Disclaimer</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#architecture-diagram">Architecutre</a></li>
    <li><a href="#flow-diagram">Flow Diagram</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

This is a video conferencing application that is used to host virtual meetings, chats and audio conferencing. 
The major tech stacks used are *PeerJS, socket.io, Google Firebase and Express*.
Website: https://bit.ly/video-chat-

### Built With
<img align="left" alt ="C++"  width="45px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png" >
<img align="left" alt ="C++"  width="45px" src="https://avatars.githubusercontent.com/u/3409784?s=280&v=4" >
<img align="left" alt ="C++"  width="45px" src="https://pluralsight2.imgix.net/paths/images/javascript-542e10ea6e.png" >
<img align="left" alt ="C++"  width="45px" src="https://www.gstatic.com/devrel-devsite/prod/v5f61782021051fb502364887a46a1c5ce2cd6f3d29a3549e907afe67612e9bba/firebase/images/touchicon-180.png" >
<img align="left" alt ="C++"  width="45px" src="https://brandslogos.com/wp-content/uploads/thumbs/bootstrap-logo-vector.svg" >
<img align="left" alt ="C++"  width="45px" src="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg" > 
<img align="left" alt ="C++"  width="45px" src="https://i.imgur.com/DVt4XjP.png" ></br>



### Disclaimer
  ``` sh
  P2P connection will not be established over different networks by just cloning this repository.
  Turn Server should also be implemented to build a P2P Connection over different networks.
  Otherwise, you may run the application on Local Network. 
  
  You will need to integrate firebase database with the application to store chat for future use.
  
  (Steps mentioned in Installation section)
  ```

<!-- GETTING STARTED -->
## Getting Started

<details open="open">
  <summary><b>Prerequisites</b></summary>
  
This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```
*  dotenv: "^10.0.0"  
*  ejs: "^3.1.6",
*  express: "^4.17.1",
*  express-session: "^1.17.2",
*  firebase: "^8.7.1",
*  peer: "^0.6.1",
*  peerjs: "^1.3.2",
*  socket.io: "^4.1.2",
*  uuid : "^8.3.2"
</details>

### Installation

1. Get a free API Key at [https://firebase.google.com/](https://firebase.google.com/)
2. Setup a realtime database on firebase google. [Refer This](https://lo-victoria.com/build-firebase-realtime-chat-app)
3. Setup a TURN server. [Refer This](https://kostya-malsev.medium.com/set-up-a-turn-server-on-aws-in-15-minutes-25beb145bc77)
4. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
5. Install NPM packages
   ```sh
   npm install
   ```
6. Enter your API in `.env` file. Refer `.env_sample`

   ``` sh
   API_KEY = 'ENTER YOUR API';
   ``` 
7. Add your TURN SERVER Credentials (Lines 51-55) in `script.js`
8. While hosting on Heroku, Uncomment Lines 39-56 in `script.js` 
9. To run the application on Local Host
   - Open the command prompt from your project directory and run the command ```npm start```.
   - Go to your browser and type http://localhost:3030/ in the address bar.

<!-- USAGE EXAMPLES -->

## Architecture Diagram

![](https://github.com/PulkitChangoiwala/Project-Resources/blob/main/VideoChatApp/Architecture%20Diagrams/High%20Level%20Design.png)

## Flow Diagram

<img src="https://github.com/PulkitChangoiwala/Project-Resources/blob/main/VideoChatApp/Architecture%20Diagrams/Flow%20Diagram.png" alt="flow" width="60%"/>
<!-- ![](https://github.com/ValakPalak/Microsoft-Engage-2021/blob/main/Images/Architecture%20Diagrams/Flow%20Diagram.png) -->

## Features

<table border="0">
 <tr>
   <td><b>Video On/Off</b></td>
   <td><b>Audio On/Off</b></td>
 </tr>
<!--  <tr>
   <td><img src="https://github.com/ValakPalak/Microsoft-Engage-2021-Images/blob/main/Images/Features/Video_On_Off.gif" alt="video" width="100%"/></td>
   <td><img src="https://github.com/ValakPalak/Microsoft-Engage-2021-Images/blob/main/Images/Features/Mute%20Call.gif" alt="video" width="100%"/></td>
    
 </tr> -->
  <tr>
   <td><b>Chat</b></td>
   <td><b>Show Participants</b></td>
 </tr>
<!--  <tr>
   <td><img src="https://github.com/ValakPalak/Microsoft-Engage-2021-Images/blob/main/Images/Features/Chat.gif"></td>
   <td><img src="https://github.com/ValakPalak/Microsoft-Engage-2021-Images/blob/main/Images/Features/Show%20Participants.gif" width="95%"></td>
    
 </tr> -->
 <tr>
   <td><b>Quick Message</b></td>
   <td><b>Send Emoji</b></td>
 </tr>
<!--  <tr>
   <td><img src="https://github.com/ValakPalak/Microsoft-Engage-2021-Images/blob/main/Images/Features/Quick%20Message.gif" alt="video" width="100%"/></td>
   <td><img src="https://github.com/ValakPalak/Microsoft-Engage-2021-Images/blob/main/Images/Features/Send%20Emoji.gif" alt="video" width="100%"/></td>
    
 </tr> -->
 <tr>
   <td><b>Raise Hand</b></td>
   <td><b>Pin Video</b></td>
 </tr>
<!--  <tr>
   <td><img src="https://github.com/ValakPalak/Microsoft-Engage-2021-Images/blob/main/Images/Features/Hand%20Raise.gif" alt="video" width="100%"/></td>
   <td><img src="https://github.com/ValakPalak/Microsoft-Engage-2021-Images/blob/main/Images/Features/Pin%20Video.gif" alt="video" width="100%"/></td> 
 </tr> -->
 <tr>
   <td><b>Copy Meet Code</b></td>
   <td><b>End Call</b></td>
 </tr>
<!--  <tr>
   <td><img src="https://github.com/ValakPalak/Microsoft-Engage-2021-Images/blob/main/Images/Features/Copy%20Meet%20Code.gif" alt="video" width="100%"/></td>
   <td><img src="https://github.com/ValakPalak/Microsoft-Engage-2021-Images/blob/main/Images/Features/End%20Call.gif" alt="video" width="100%"/></td> 
  </tr> -->
</table>




<!-- CONTACT -->
## Contact

Sangramsinh V Patil - [@sangramsinh patil]([(https://www.linkedin.com/in/sangramsinh-patil-762161221/)]) - p.sangramsinh@iitg.ac.in

Project Link: [https://github.com/PulkitChangoiwala/Video_Chat_App](https://github.com/PulkitChangoiwala/Video_Chat_App)
