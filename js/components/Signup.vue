<template>
    <div id="main">
        <div class="header">
            <h1>Sign up</h1>
            <h2>Create a new account</h2>
        </div>

        <div class="content">
            <form class="pure-form pure-form-aligned">
                <fieldset>
                    <div class="pure-control-group">
                        <label for="email">Email Address</label>
                        <input id="email" type="email" placeholder="Email Address" v-model="user.email" class="pure-input-1-2">
                    </div>

                    <div class="pure-control-group">
                        <label for="password">Password</label>
                        <input id="password" type="password" placeholder="Password" v-model="user.password" class="pure-input-1-2">
                    </div>

                    <div class="pure-controls">
                        <button type="button" v-on:click="signup" class="pure-button" :disabled="btn_signup_disabled">Sign Up</button>
                        <span class="pure-form-message" v-if="error">{{ error }}</span>
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
                email: null,
                password: null
            },
            error: null,
            btn_signup_disabled: false
        }),
        methods: {
            signup () {
                this.btn_signup_disabled = true

                const promise = firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password)
                promise.catch(e => {
                    console.log(e.message)
                    this.error = e.message
                    this.btn_signup_disabled = false
                })

                var dbUser = firebase.database().ref().child('user');
                var currentUser = firebase.auth().currentUser;

                promise.then(currentUser => {
                    const dbUserid = dbUser.child(currentUser.uid);
                    dbUserid.update({email:currentUser.email});
                    this.btn_signup_disabled = false
                })
            }
        }
    }
</script>
