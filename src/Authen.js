import React, { Component } from 'react';
import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyDO6Bo-OAuwa2P2X3F1B1vnnzU4sLcTOrU",
    authDomain: "authentication-603c4.firebaseapp.com",
    databaseURL: "https://authentication-603c4.firebaseio.com",
    projectId: "authentication-603c4",
    storageBucket: "authentication-603c4.appspot.com",
    messagingSenderId: "483498309729",
    appId: "1:483498309729:web:cb388438af5603a4641220",
    measurementId: "G-1VBRHHKQRC"
  };
  firebase.initializeApp(firebaseConfig);

class Authen extends Component {

    constructor(props){
        super(props);

        this.state = {
            err: '',
            output: '',
            exit: ''
        };

        this.email = React.createRef();
        this.password = React.createRef();
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
        this.logout = this.logout.bind(this);
        this.google = this.google.bind(this);
    }

    login(event){
        const email = this.email.current.value;
        const password = this.password.current.value;
        console.log(email, password);
        
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email, password);

        promise.then(({user}) => {
            var lout = document.getElementById('logout');
            var output = "Welcome back "+user.email;
            this.setState({output});
            lout.classList.remove('hide');
        });

        promise.catch(e => {
            var err = e.message;
            console.log(err);
            this.setState({err});
        });
    }

    signup(){
        const email = this.email.current.value;
        const password = this.password.current.value;
        console.log(email, password);
        
        const auth = firebase.auth();
        const promise = auth.createUserWithEmailAndPassword(email, password);
        
        promise
        .then(({user}) => {
            var err = "Welcome "+user.email;
            console.log(user);
            firebase.database().ref('users/'+user.uid).set({
                email: user.email
            });
            console.log(user);
            this.setState({err});
        }).catch(e => {
            var err = e.message;
            console.log(err);
            this.setState({err});
        });
    }

    logout(){
        firebase.auth().signOut();
        var lout = document.getElementById('logout');
        var exit = "See you soon "+this.email.current.value; 
        this.setState({exit});
        lout.classList.add('hide');
    }

    google(){
        var provider = new firebase.auth.GoogleAuthProvider();
        var promise = firebase.auth().signInWithPopup(provider);

        promise
        .then(function(result) {
            var user = result.user;
            console.log(result);
            firebase.database().ref('users/'+user.uid).set({
                email: user.email,
                name: user.displayName
            });
        }).catch(e => {
            var msg = e.message;
            console.log(msg);
        }); 
    }

    render(){
        return(
            <div>
                <input id="email" type="email" ref={this.email} placeholder="Enter your email" /><br />
                <input id="pass" type="password" ref={this.password} placeholder="Enter your password" /><br />
                <p>{this.state.err}</p>
                <p>{this.state.output}</p>
                <p>{this.state.exit}</p>
                <button onClick={this.login}>Log In</button>
                <button onClick={this.signup}>Sign Up</button>
                <button onClick={this.logout} id="logout" className="hide">Log Out</button><br />
                <button onClick={this.google} id="google" className="google">Sign In With Google</button>
            </div>
        );
    }
}

export default Authen;