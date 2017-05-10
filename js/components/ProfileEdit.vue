<template>
    <div id="main">
        <div class="header">
            <h1>Profile</h1>
            <h2>View and Edit your Profile</h2>
        </div>

        <div class="content">

            <form class="pure-form pure-form-aligned">
                <fieldset>

                    <div class="text-center">
                        <img :src="user.photoURL" id="userPhoto" />
                        <span class="pure-form-message" v-if="file_upload_message">{{ file_upload_message }}</span>
                    </div>

                    <div class="pure-control-group">
                        <label for="photo">Your photo</label>
                        <input type="file" id="file" name="photo" v-on:change="handleFileSelect" />
                    </div>

                    <div class="pure-control-group">
                        <label for="name">Name</label>
                        <input id="name" type="text" placeholder="Steven Chen" v-model="user.name" class="pure-input-1-2">
                    </div>

                    <div class="pure-control-group">
                        <label for="occupation">Occupation</label>
                        <input id="occupation" type="text" placeholder="Software Development Engineer" v-model="user.occupation" class="pure-input-1-2">
                    </div>

                    <div class="pure-control-group">
                        <label for="age">Age</label>
                        <input id="age" type="number" placeholder="30" v-model="user.age" class="pure-input-1-2">
                    </div>

                    <div class="pure-control-group">
                        <label for="description">Description</label>
                        <textarea rows="3" id="description" class="pure-input-1-2" v-model="user.description"></textarea>
                    </div>

                    <div class="pure-controls">
                        <button type="button" v-on:click="update" class="pure-button pure-button-primary" :disabled="btn_update_disabled">Update</button>
                        <button type="button" class="pure-button" v-on:click="back">Back</button>
                        <span class="pure-form-message" v-if="message">{{ message }}</span>
                    </div>
                </fieldset>
            </form>

        </div>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import {config} from '../firebaseConfig'

    export default {
        data: () => ({
            user: {
                name: null,
                occupation: null,
                age: 0,
                description: null,
                photoURL: 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
            },
            message: null,
            file_upload_message: null,
            btn_update_disabled: false
        }),
        created () {
            var currentUser = firebase.auth().currentUser;
            var dbUserInfo = firebase.database().ref('user/' + currentUser.uid);

            dbUserInfo.on("value", item => {
                this.user.name = item.val().name;
                this.user.occupation = item.val().occupation;
                this.user.age = item.val().age;
                this.user.description = item.val().description;
                this.user.photoURL = item.val().imageUrl;
            });
        },
        methods: {
            update () {

                // disable update button
                this.btn_update_disabled = true

                var currentUser = firebase.auth().currentUser

                const promise = currentUser.updateProfile({
                    displayName: this.user.name,
                    photoURL: this.user.photoURL
                })

                promise.then( () => {
                    var dbUser = firebase.database().ref().child('user')
                    var dbUserid = dbUser.child(currentUser.uid)

                    currentUser = firebase.auth().currentUser

                    if (currentUser) {
                        dbUserid.update({
                            'name': this.user.name,
                            'occupation': this.user.occupation,
                            'age': this.user.age,
                            'description': this.user.description,
                            'imageUrl': currentUser.photoURL
                        })

                        this.message = "Update successed."
                        this.$router.push('/profile')
                    }

                    this.btn_update_disabled = false
                })

            },
            handleFileSelect (evt) {
                evt.stopPropagation();
                evt.preventDefault();

                var file = evt.target.files[0];
                var storageRef = firebase.storage().ref();
                var currentUser = firebase.auth().currentUser

                var metadata = {
                    'contentType': file.type
                }

                this.file_upload_message = 'File is uploading ...'

                storageRef.child('images/' + currentUser.uid + '/' + file.name).put(file, metadata).then( snapshot => {
                    console.log('Uploaded', snapshot.totalBytes, 'bytes.')
                    console.log(snapshot.metadata)
                    this.user.photoURL = snapshot.metadata.downloadURLs[0]
                    console.log('File available at', this.user.photoURL)
                    this.file_upload_message = 'File uploaded.'
                }).catch( error => {
                    console.error('Upload failed:', error);
                    this.message = 'Upload failed:' + error
                    this.file_upload_message = 'Error, please try again.'
                })
            },
            back () {
                this.$router.push('/profile')
            }
        }
    }
</script>
