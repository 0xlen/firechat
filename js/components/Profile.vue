<template>
    <div id="main">
        <div class="header">
            <h1>Profile</h1>
            <h2>View and Edit your Profile</h2>
        </div>

        <div class="content">

            <form class="pure-form pure-form-aligned">
                <fieldset>

                    <div class="pull-right">
                        <button type="button" class="pure-button" v-on:click="profileEdit">Edit</button>
                    </div>

                    <div class="pure-control-group">
                        <div class="text-center">
                            <img :src="user.photoURL" id="userPhoto" />
                        </div>
                    </div>

                    <div class="pure-control-group">
                        <label for="name" class="pure-u-1-2">Name</label>
                        <p class="pure-u-1-2 text-center">{{ user.name }}</p>
                    </div>

                    <div class="pure-control-group">
                        <label for="occupation">Occupation</label>
                        <p class="pure-u-1-2 text-center">{{ user.occupation }}</p>
                    </div>

                    <div class="pure-control-group">
                        <label for="age">Age</label>
                        <p class="pure-u-1-2 text-center">{{ user.age }}</p>
                    </div>

                    <div class="pure-control-group">
                        <label for="description">Description</label>
                        <p class="pure-u-1-2 text-center">{{ user.description }}</p>
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
                email: null,
                password: null,
                occupation: null,
                age: null,
                description: null,
                photoURL: 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
            }
        }),
        methods: {
            profileEdit () {
                this.$router.push('/profile/edit')
            }
        },
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
        }
    }
</script>
