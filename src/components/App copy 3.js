import React, { Component } from 'react';
// import logo from './logo.svg';
import '../styles/App.scss';
import firebase, { auth, provider } from '../firebase.js';

const log = function(m){
  // eslint-disable-next-line
  console.log(m)
}

var functions = {

  convertUTCDateToLocalDate: function(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
  }

}

//=== LOGIN PROBLEM
// function initApp(){
//   document.getElementById('firebaseLoginButton')
//         .addEventListener('click', loginToFirebase);
// }
//
// window.onload = function() {
//    initApp();
//  }
//
//  function loginToFirebase(){
//    auth.signInWithPopup(provider)
//      .then((result) => {
//        log('sssssss')
//        const user = result.user;
//        // this.setState({
//        //   user
//        // });
//        saveUser2database(result.user)
//      });
//  }

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

  // user2save.last_login = functions.convertUTCDateToLocalDate(new Date())
  // user2save.last_login = functions.convertUTCDateToLocalDate(new Date()).toString();
  user2save.last_login = (new Date()).toString();

  usersRef.orderByChild('uid').equalTo(user.uid).once('value',snapshot => {
    const userData = snapshot.val();
    const key = Object.keys(snapshot.val())[0];
    if (userData) {
      log(userData);
      // snapshot.ref.update({key :user2save})
      firebase.database().ref('users/'+key).update(user2save)
      // userData.update(user2save)
    } else {
      usersRef.push(user2save);
    }
  });

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
        title: '',
        tags: [],
        detail: '',
        links: []
      },
      username: '',
      items: [],
      itemsExt:[],
      user: null // <-- add this line
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeArray = this.handleChangeArray.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    // this.toggleEditItem = this.toggleEditItem.bind(this);
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
    // this.saveUser2database = this.saveUser2database.bind(this);
  }
  // toggleEditItem(e){
  //   log(e)
  //   if (e.target !== e.currentTarget) {
  //       var clickedItem = e.target.id;
  //       log( clickedItem);
  //   }
  //   // e.stopPropagation();
  // }
  handleChangeArray(e, id) {
    // this.setState({
    //   [e.target.name]: e.target.value
    // });

    // this.setState(prevState => ({
    //     currentItem: {
    //         ...prevState.currentItem,
    //         [e.target.name]: e.target.value
    //     }
    // }))

    if (typeof id !== 'undefined') {
      log(id)
      log(e)
      let newItemState = this.state.items
      let separator = ','

      switch (e.target.name){
        case 'links':
          separator = '\n'
      }

      newItemState[id][e.target.name]= e.target.value.split(separator)

      this.setState(prevState => ({
          items: newItemState
      }))
    }
    else {
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

  }
  handleChange(e,id) {
    // this.setState({
    //   [e.target.name]: e.target.value
    // });

    // this.setState(prevState => ({
    //     currentItem: {
    //         ...prevState.currentItem,
    //         [e.target.name]: e.target.value
    //     }
    // }))
    if (typeof id !== 'undefined') {
      // log(id)
      // log(e)
      let newItemState = this.state.items

      newItemState[id][e.target.name]= e.target.value

      this.setState(prevState => ({
          items: newItemState
      }))
    }
    else {
      let newItemState = this.state.currentItem

      // console.log(e.target.attributes.type.ownerElement)
      newItemState[e.target.name]= e.target.value

      this.setState(prevState => ({
          currentItem: newItemState
      }))
    }

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
    // const item = {
    //   title: this.state.currentItem,
    //   user: this.state.user.displayName || this.state.user.email
    // }
    let item = this.state.currentItem
    // let items = this.state.items

    item.owner = this.state.user.uid

    this.state.items.push(item)

    itemsRef.push(item);
    this.setState({
      currentItem: {
        owner: null,
        title: '',
        tags: [],
        detail: '',
        links: [],
        updateDate: (new Date()).toString()
      }
    });
  }
  handleSubmitEdit(e) {
    e.preventDefault();
    log(e.target.id)

    const itemsRef = firebase.database().ref('items');
    // const item = {
    //   title: this.state.currentItem,
    //   user: this.state.user.displayName || this.state.user.email
    // }
    let item = this.state.items[Number(e.target.idx.value)]
    // let items = this.state.items
    log(e.target.idx.value)
    log(item)
    log(item.detail)

    item.title = e.target.title.value
    item.tags = e.target.tags.value.split(',')
    item.links = e.target.links.value.split('\n')
    item.detail = e.target.detail.value
    item.updateDate = (new Date()).toString()

    const itemRef = firebase.database().ref('items/'+e.target.id.value);

    itemRef.update(item)
    // itemRef.once('value',snapshot => {
    //   const userData = snapshot.val();
    //   const key = Object.keys(snapshot.val())[0];
    //   if (userData) {
    //     console.log(userData);
    //     // snapshot.ref.update({key :user2save})
    //     firebase.database().ref('users/'+key).update(user2save)
    //     // userData.update(user2save)
    //   } else {
    //     usersRef.push(user2save);
    //   }
    // });

    // item.owner = this.state.user.uid

    // this.state.items.push(item)

    // itemsRef.push(item);
    // this.setState({
    //   currentItem: {
    //     owner: null,
    //     title: '',
    //     tags: [],
    //     detail: '',
    //     links: []
    //   }
    // });
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
      // console.log(this.state.user.uid)
      for (let item in items) {
        // console.log(item.owner)
        if (items[item].owner === this.state.user.uid){
          newState.push({
            id: item,
            title: items[item].title,
            detail: items[item].detail,
            // user: items[item].user,
            links: items[item].links,
            tags: items[item].tags,
            owner: items[item].owner
          });
        }
      }
      var itemsExt = newState.map((item) => {return {
        editMode: false,
        lastState: Object.assign({}, item)
      }})
      this.setState({
        items: newState,
        itemsExt: itemsExt
      });
    });
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  editItemGui( idx) {
    // log(idx)
    var itemsExt = this.state.itemsExt
    itemsExt[idx].editMode = ! itemsExt[idx].editMode
    this.setState({
      itemsExt: itemsExt
    });
  }
  editItemGuiCancel( idx) {
    log(idx)
    var itemsExt = this.state.itemsExt
    itemsExt[idx].editMode = ! itemsExt[idx].editMode

    var items = this.state.items
    items[idx] = itemsExt[idx].lastState
    this.setState({
      itemsExt: itemsExt,
      items: items
    });
  }
  render() {
    return (
      <div className='app'>
        <header>
          <div className="wrapper">
            <h1>Memo+Todo+Bookmarks</h1>
            {this.state.user ?
              <button onClick={this.logout}>Logout</button>
              :
              <button id='firebaseLoginButton' onClick={this.login}>Log In</button>
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
                  <input type="text" name="title" placeholder="title?" onChange={this.handleChange} value={this.state.currentItem.title} />
                  <input type="text" name="tags" placeholder="tags (separated by ,)" onChange={this.handleChangeArray} value={this.state.currentItem.tags} />
                  <textarea type="text" name="detail" placeholder="Details?" onChange={this.handleChange} value={this.state.currentItem.detail} />
                  <textarea type="text" name="links" placeholder="related links" onChange={this.handleChangeArray} value={this.state.currentItem.links} />
                  <button>Add Item</button>
                </form>
              </section>
              <section className='display-item'>
                <div className="wrapper">
                  <ul>
                    {this.state.items.map((item,idx) => {
                      let links = ''
                      let tags = ''

                      if (item.links){
                        links = (
                          <div className='links'>
                            Links:
                            <ul>
                              {
                                  item.links.map((link,idx) => {
                                    return (
                                      <li key={idx}><a href={link}>{link}</a></li>
                                    )
                                  })
                              }
                            </ul></div>
                          )
                      }

                      if (item.tags){
                        tags = (
                          <div className='tags'>
                            Tags:
                              <ul className="posttags">
                                {
                                    item.tags.map((tag,idx) => {
                                      return (
                                        <li key={idx} >
                                          <a href=''>{tag} <span></span></a>
                                        </li>
                                      )
                                    })
                                }
                              </ul>
                            </div>
                          )
                      }
                      // {
                      //     item.tags.map((tag,idx) => {
                      //       return (
                      //         <div key={idx} className='tag'>{tag}</div>
                      //       )
                      //     })
                      // }

                      return (
                        <li key={item.id} >
                          <div className={this.state.itemsExt[idx].editMode ? 'present-mode displayNone' : 'present-mode'}>
                            <h3>{item.title}</h3>
                            <p>
                              {item.detail}
                            </p>
                            {links}
                            {tags}
                            {item.owner === this.state.user.uid || item.user === this.state.user.displayName || item.user === this.state.user.email ?
                              <div><button onClick={() => this.editItemGui( idx)}>Edit Item</button>
                              <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                              </div>: null
                            }
                          </div>
                          <div className={this.state.itemsExt[idx].editMode ? 'edit-mode' : 'edit-mode displayNone'}>
                            <form onSubmit={this.handleSubmitEdit} >
                              <input type="hidden" name="id" placeholder="id" readOnly="true" value={item.id} />
                              <input type="hidden" name="idx" placeholder="idx" readOnly="true" value={idx} />
                              <div className='form-label'>Title: </div>
                              <input type="text" name="title" placeholder="title?" onChange={(e) => this.handleChange(e, idx)} value={item.title} />
                              <div className='form-label'>Tags: </div>
                              <input type="text" name="tags" placeholder="tags (separated by ,)" onChange={(e) => this.handleChangeArray(e, idx)} value={item.tags.join(',')} />
                              <div className='form-label'>Detail: </div>
                              <textarea type="text" name="detail" placeholder="Details?" onChange={(e) => this.handleChange(e, idx)} value={item.detail} />
                              <div className='form-label'>Links: </div>
                              <textarea type="text" name="links" placeholder="related links" onChange={(e) => this.handleChangeArray(e, idx)} value={item.links? item.links.join('\n'): ''} />
                              <button>Save</button>
                              <button type="button" onClick={() => this.editItemGuiCancel( idx)}>Cancel</button>
                            </form>
                          </div>
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
