import React, { Component } from 'react';
// import logo from './logo.svg';
import '../styles/App.scss';
import firebase, { auth, provider } from '../firebase.js';

function saveUser2database(user){
  // e.preventDefault();
  const usersRef = firebase.database().ref('users');
  // const users = {
  //   uid: this.state.user.uid,
  //   username: this.state.user.username,
  //   email: this.state.user.email,
  //   display
  // }
  const user2save = (({uid,email,displayName})=>({uid,email,displayName}))(user);
  // alert(JSON.stringify(user2save))
  usersRef.push(user2save);
  // this.setState({
  //   currentItem: '',
  //   username: ''
  // });
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: {
        owner: null,
        title: null,
        tags: [],
        detail: null,
        links: []
      },
      username: '',
      items: [],
      user: null // <-- add this line
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeArray = this.handleChangeArray.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
    // this.saveUser2database = this.saveUser2database.bind(this);
  }
  handleChangeArray(e) {
    // this.setState({
    //   [e.target.name]: e.target.value
    // });

    // this.setState(prevState => ({
    //     currentItem: {
    //         ...prevState.currentItem,
    //         [e.target.name]: e.target.value
    //     }
    // }))
    let newItemState = this.state.currentItem
    let separator = ','

    switch (e.target.name){
      case 'links':
        separator = '\n'
    }
    // console.log(e.target.attributes.type.ownerElement)
    newItemState[e.target.name]= e.target.value.split(separator)


    this.setState(prevState => ({
        currentItem: newItemState
    }))
  }
  handleChange(e) {
    // this.setState({
    //   [e.target.name]: e.target.value
    // });

    // this.setState(prevState => ({
    //     currentItem: {
    //         ...prevState.currentItem,
    //         [e.target.name]: e.target.value
    //     }
    // }))
    let newItemState = this.state.currentItem

    // console.log(e.target.attributes.type.ownerElement)
    newItemState[e.target.name]= e.target.value


    this.setState(prevState => ({
        currentItem: newItemState
    }))
  }
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
        saveUser2database(result.user)
      });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: ''
    });
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className='app'>
        <header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>
            {this.state.user ?
              <button onClick={this.logout}>Logout</button>
              :
              <button onClick={this.login}>Log In</button>
            }
          </div>
        </header>
        {this.state.user ?
          <div>
            <div className='user-profile'>
              <img src={this.state.user.photoURL} />
            </div>
            <div className='container'>
              <section className='add-item'>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="username" placeholder="What's your name?" readOnly="true" value={this.state.user.displayName || this.state.user.email } />
                  <input type="text" name="title" placeholder="title?" value={this.state.currentItem.title} />
                  <input type="text" name="tags" placeholder="tags (separated by ,)" onChange={this.handleChangeArray} value={this.state.currentItem.tags} />
                  <textarea type="text" name="detail" placeholder="Details?" onChange={this.handleChange} value={this.state.currentItem.detail} />
                  <textarea type="text" name="links" placeholder="related links" onChange={this.handleChangeArray} value={this.state.currentItem.links} />
                  <button>Add Item</button>
                </form>
              </section>
              <section className='display-item'>
                <div className="wrapper">
                  <ul>
                    {this.state.items.map((item) => {
                      return (
                        <li key={item.id}>
                          <h3>{item.title}</h3>
                          <p>brought by: {item.user}
                             {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                               <button onClick={() => this.removeItem(item.id)}>Remove Item</button> : null}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
            </div>
          </div>
          :
          <div className='wrapper'>
            <p>You must be logged in to see the potluck list and submit to it.</p>
          </div>
        }

      </div>
    );
  }
}
export default App;
