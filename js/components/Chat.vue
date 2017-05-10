<template>
    <div id="main">
        <div class="header">
            <h1>Chat Room</h1>
        </div>

        <div class="content" id="chat">

            <div class="">
                <ul id="messageList"></ul>

                <br>

                <form class="pure-form pure-g">
                    <input class="pure-input-rounded pure-u-3-4" type="text" v-model="text" v-on:keyup="send">
                    <button class="pure-button pure-u-1-4" v-on:click="send">SEND</button>
                </form>

            </div>

        </div>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import {config} from '../firebaseConfig'
    import $ from 'jquery'

    export default {
        data: () => ({
            text: null
        }),
        methods: {
            send (e) {
                if (this.text == null || this.text == '') return

                    var dbChatRoom = firebase.database().ref().child('chatroom')
                        var currentUser = firebase.auth().currentUser
                        var dbUserInfo = firebase.database().ref('user/')
                        var userName;

                if(currentUser){

                    dbUserInfo.on("value", snapshot => {

                        snapshot.forEach( userId => {
                            if(userId.key === currentUser.uid){
                                userId.forEach( profile => {
                                    if(profile.key === 'name'){
                                        userName = profile.val()
                                    }
                                })
                            }
                        })

                    })

                    if (e.keyCode == 13 || e.target.nodeName == 'BUTTON') {
                        dbChatRoom.push({ user:userName, text: this.text, imageUrl: currentUser.photoURL })
                            this.text = null
                    }
                }
            }
        },
        created () {

            var dbChatRoom = firebase.database().ref().child('chatroom');
            var currentUser = firebase.auth().currentUser;

            if (currentUser) {
                dbChatRoom.limitToLast(10).on('child_added', function (snapshot) {

                    var data = snapshot.val();
                    var username = data.user || "anonymous";
                    var message = data.text;
                    var imgUrl = data.imageUrl;

                    var $messageElement = '<div class="email-item email-item-selected pure-g">'
                    $messageElement += '<div class="pure-u">'
                    $messageElement += '<img class="email-avatar" src="' + imgUrl + '">'
                    $messageElement += '</div>'

                    $messageElement += '<div class="pure-u-3-4">'
                    $messageElement += '<h5 class="email-name">' + username + '</h5>'
                    $messageElement += '<p class="email-desc">' + message + '</p>'
                    $messageElement += '</div></div>' 

                    var $messageList = $('#messageList');
                    $messageList.append($messageElement);
                    
                    if ($messageList[0]) {
                        $messageList[0].scrollTop = $messageList[0].scrollHeight
                    }
                })
            }

        }
    }
</script>
