<template>
    <div id="main">
        <div class="header">
            <h1>Sign In</h1>
        </div>

        <div class="content">

            <form class="pure-form pure-form-aligned">
                <fieldset>
                    <div class="pure-control-group">
                        <label for="email">Email Address</label>
                        <input id="email" type="email" placeholder="Email Address" class="pure-input-1-2" v-model="user.email">
                    </div>

                    <div class="pure-control-group">
                        <label for="password">Password</label>
                        <input id="password" type="password" placeholder="Password" class="pure-input-1-2" v-model="user.password">
                    </div>

                    <div class="pure-controls">
                        <button v-on:click="login" class="pure-button pure-button-primary" :disabled="btn_login_disabled">Login</button>
                        <router-link class="pure-button" to="/signup">No account? Create new one</router-link>

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
            btn_login_disabled: false
        }),
        methods: {
            login () {
                this.btn_login_disabled = true

                const promise = firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password)

                promise.catch( e => {
                    console.log(e.message)
                    this.error = e.message
                    this.btn_login_disabled = false
                })

                promise.then( () => {
                    console.log('Log in success!')
                    this.$router.push('/profile')

                    this.btn_login_disabled = true
                })
            }
        }
    }
</script>
