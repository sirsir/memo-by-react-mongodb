import React, { Component } from 'react';
// import logo from './logo.svg';
import '../styles/App.scss';
import firebase, { auth, provider } from '../firebase.js';

import TagsList from './TagsList';

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
  },

  sir_searchstring: function (mainstring, searchstring) {
    if (!searchstring) {
      return true;
    //} else if (searchstring[0] == "!") {
      //searchstring= searchstring[1:]
      //return re.search(searchstring, mainstring)
    } else {

      let searchArray = searchstring.split('&&');
      //searchArray = searchstring.split("----");

      /*
      if (searchArray.length == 2) {
        noArray = searchArray[1].split(",");

        for (var i = 0; i < noArray.length; i++) {
          var searchforNOArray = noArray[i].split("|");
          for (var j = 0; j < searchforNOArray.length; j++) {
            if (mainstring.toLowerCase().indexOf(searchforNOArray[j].toLowerCase()) != -1) {
              return false;
            }
          }
        }
      }

      searchforArray = searchArray[0].split(",");

      */

      let searchforNOArray = [];
      let searchforArray = [];

      searchArray.forEach(function(keyword){
        if (keyword.startsWith('-')){
          searchforNOArray.push(keyword.slice(1));
        } else {
          searchforArray.push(keyword);
        }
      });

      //console.log(searchforArray)
      //console.log(searchforNOArray)

      let bln_satisfyNOT = true;
      searchforNOArray.forEach(function(keyword){
        if (mainstring.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          bln_satisfyNOT = false;
          //break;
          return false;
        }
      });
      if (! bln_satisfyNOT){
        return false;
      }


      let bln_satisfyAll = true;
      searchforArray.forEach(function(keyword){
        if (mainstring.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
          bln_satisfyAll = false;
          //break;
          return false;
        }
      });
      if (! bln_satisfyAll){
        return false;
      } else {
        return true;
      }





      /*
      satisfy = 0;
      for (var i = 0; i < searchforArray.length; i++) {
        var searchforORArray = searchforArray[i].split("|");
        for (var j = 0; j < searchforORArray.length; j++) {
          if (mainstring.toLowerCase().indexOf(searchforORArray[j].toLowerCase()) != -1) {
            satisfy += 1
            break;
          }
        }

        if (satisfy != i + 1) {
          return false;
        }

      }

      return true;
      */
    }

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
      itemsIdx2show: [],
      itemsExt:[],
      user: null,
      display: {
        newItem: false,
        tagsList: false
      },
      tagsList:[],
      searchKeyword: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeArray = this.handleChangeArray.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    this.searchTag = this.searchTag.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.showAllItems = this.showAllItems.bind(this);
    // this.handleKeyPress = this.handleKeyPress.bind(this);
    // this.toggleEditItem = this.toggleEditItem.bind(this);
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
    // this.saveUser2database = this.saveUser2database.bind(this);
  }
  updateTagsList(){
    var tagsList = []

    this.state.items.forEach(function(item,idx){
      item.tags.forEach(function(tag){

        // log(tag)
        var tagObj = tagsList.find((element) => {
          return element.tag === tag;
        })

        // log(tagObj)

        if (tagObj){
          tagObj.count++;
        } else {
          tagsList.push({
            tag: tag,
            count: 1
          })
        }

      })
    })

    this.setState({
      tagsList: tagsList
    });

  }
  // toggleEditItem(e){
  //   log(e)
  //   if (e.target !== e.currentTarget) {
  //       var clickedItem = e.target.id;
  //       log( clickedItem);
  //   }
  //   // e.stopPropagation();
  // }
  handleInputChange(e,state){
    if (state === 'searchKeyword'){
      log('state = searchKeyword')

      let newState = e.target.value

      this.setState(prevState =>(
        {
          searchKeyword: newState
        }
      ));

      this.searchKeyword(e.target.value)
    }
  }
  searchKeyword(keyword){
    // let itemsExt = this.state.itemsExt
    let itemsIdx2show = []

    this.state.itemsExt.forEach((item,idx) => {
      if (functions.sir_searchstring(item.searchable , keyword)){
        itemsIdx2show.push(idx)
      }
    })

    this.setState({
      itemsIdx2show: itemsIdx2show
    });

    // log(tagIn)
  }
  showAllItems(e){
    log('reset all search')

    let itemsIdx2show = this.state.items.map((item,idx) => {return idx})

    this.setState({
      searchKeyword: '',
      itemsIdx2show: itemsIdx2show
    });
  }
  // handleKeyPress(e) {
  //   if (e.key === 'Enter') {
  //     log('do validate');
  //
  //
  //     let itemsExt = this.state.itemsExt
  //     let itemsIdx2show = []
  //
  //     itemsExt.forEach((item,idx) => {
  //       if (functions.sir_searchstring(item.searchable , this.state.searchKeyword)){
  //         itemsIdx2show.push(idx)
  //       }
  //
  //     })
  //
  //     this.setState({
  //       itemsIdx2show: itemsIdx2show
  //     });
  //   } else {
  //     log('input change detected')
  //     let itemsExt = this.state.itemsExt
  //     let itemsIdx2show = []
  //
  //     // itemsExt.forEach((item,idx) => {
  //     //   if (functions.sir_searchstring(item.searchable , this.state.searchKeyword)){
  //     //     itemsIdx2show.push(idx)
  //     //   }
  //     //
  //     // })
  //     log(e.target)
  //     let newValue = e.target.value
  //     log(newValue)
  //
  //     // this.setState(prevState =>(
  //     //   {
  //     //     searchKeyword: newValue
  //     //   }
  //     // ));
  //   }
  //
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
    let user = {
      'displayName' : 'SiR SiR',
      'email' : 'sirsak@gmail.com',
      'last_login' : 'Thu Dec 14 2017 14:07:39 GMT+0700 (+07)',
      'uid' : '0eSb19kpk5dj6eUzWllnYjC1zaj1'
    }
    this.setState({ user: user });
    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     this.setState({ user });
    //   }
    // });
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
      let itemsExt = newState.map((item) => {return {
        editMode: false,
        collapse: true,
        lastState: Object.assign({}, item),
        searchable: JSON.stringify(item)
      }})

      let itemsIdx2show = newState.map((item,idx) => {return idx})

      this.setState({
        items: newState,
        itemsExt: itemsExt,
        itemsIdx2show: itemsIdx2show
      });

      this.updateTagsList();

    });


  }
  searchTag(tagIn){
    log(this.state.items)
    let itemsIdx2show = this.state.items.filter((item) => {return item.tags.includes(tagIn)})
    .map(function(item,idx){return idx})

    this.setState({
      itemsIdx2show: itemsIdx2show
    });

    // log(tagIn)
  }
  removeItem(e, itemId) {
    e.stopPropagation()

    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();

  }
  editItemGui( e,idx) {
    e.stopPropagation()
    // log(idx)
    var itemsExt = this.state.itemsExt
    itemsExt[idx].editMode = ! itemsExt[idx].editMode
    this.setState({
      itemsExt: itemsExt
    });


  }
  toggleItem( idx) {
    // log(idx)
    var itemsExt = this.state.itemsExt
    if (typeof idx === 'number') {

      itemsExt[idx].collapse = ! itemsExt[idx].collapse
    } else if (typeof idx === 'boolean') {
      itemsExt = itemsExt.map((itemExt) => {
        var itemExtOut = itemExt

        itemExtOut.collapse = idx

        return itemExtOut
      })
    }

    this.setState({
      itemsExt: itemsExt
    });
  }
  toggleDisplayState(item){
    var display = this.state.display
    display[item] = ! display[item]
    this.setState({
      display: display
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
  // <input autoComplete="off" autoCorrect="off" className="form-control input-lg" id="search-input" placeholder="Type in keyword here" spellCheck="false" tabIndex="1" onKeyPress={this.handleKeyPress} onChange={(e) => this.handleInputChange(e,'searchKeyword')} value={this.state.searchKeyword}/>
  render() {
    return (
      <div className='app'>
        <header>
          <div className="wrapper">
            <h1>Memo+Todo+Bookmarks</h1>
            {this.state.user ?
              <div className='right'>
                <div className='user-profile'>
                  <img src={this.state.user.photoURL} />
                </div>
                <button onClick={this.logout}>Logout</button>
              </div>

              :
              <button id='firebaseLoginButton' onClick={this.login}>Log In</button>
            }
          </div>
        </header>
        {this.state.user ?
          <div>
            <div className='container'>
            <section id="searchbox">
              <div id="searchbox-box">
                <input autoComplete="off" autoCorrect="off" className="form-control input-lg" id="search-input" placeholder="Type in keyword here" spellCheck="false" tabIndex="1" onChange={(e) => this.handleInputChange(e,'searchKeyword')} value={this.state.searchKeyword}/>
              </div>
             <div id="searchbox-search-icon">
                <div className="table"><a aria-hidden="true" className="fa fa-search" href="#" id="search-clear"><span className="sr-only">Search</span></a></div>
             </div>
             <div id="searchbox-clear-icon">
                <div className="table"><a aria-hidden="true" className="fa fa-times-circle" href="#" id="search-clear"><span className="sr-only">Clear search</span></a></div>
             </div>
            </section>
            <div id="tools">
              <div id="addItemButton">
                <div className="table"><a aria-hidden="true" className="fa fa-plus-square" href="#" onClick={() => {this.toggleDisplayState('newItem')}} >Add new item</a></div>
              </div>
              <div id="showTagsListButton">
                <div className="table"><a aria-hidden="true" className="fa fa-tags" href="#" onClick={() => {this.toggleDisplayState('tagsList')}} >{this.state.display.tagsList? 'Hide tags list': 'Show tags list'}</a></div>
              </div>
              {this.state.itemsIdx2show.length !== this.state.items.length ?
                <div id="showAll">
                  <div className="table"><a aria-hidden="true" className="fa fa-undo" href="#" onClick={this.showAllItems} >Show all</a></div>
                </div>:null
              }
              { this.state.itemsExt.reduce((boolOut, itemExt)=>{return boolOut && (! itemExt.collapse)},true) === false?
                <div id="expandAll">
                  <div className="table"><a aria-hidden="true" className="fa fa-plus-square-o" href="#" onClick={() => {this.toggleItem(false)}} >Expand all</a></div>
                </div>
                :
                null
              }
              { this.state.itemsExt.reduce((boolOut, itemExt)=>{return boolOut && (itemExt.collapse)},true) === false?
                <div id="collapseAll">
                  <div className="table"><a aria-hidden="true" className="fa fa-minus-square-o" href="#" onClick={() => {this.toggleItem(true)}} >Collapse all</a></div>
                </div>
                :
                null
              }
            </div>
            <section className={this.state.display.newItem ? 'add-item' : 'add-item displayNone'}>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="username" placeholder="What's your name?" readOnly="true" value={this.state.user.displayName || this.state.user.email } />
                <input type="text" name="title" placeholder="title?" onChange={this.handleChange} value={this.state.currentItem.title} />
                <input type="text" name="tags" placeholder="tags (separated by ,)" onChange={this.handleChangeArray} value={this.state.currentItem.tags} />
                <textarea type="text" name="detail" placeholder="Details?" onChange={this.handleChange} value={this.state.currentItem.detail} />
                <textarea type="text" name="links" placeholder="related links" onChange={this.handleChangeArray} value={this.state.currentItem.links} />
                <button>Add Item</button>
              </form>
            </section>
            <TagsList display={this.state.display.tagsList} tagsList={this.state.tagsList} _searchTag={this.searchTag}>

            </TagsList>
            <section className='display-item'>
                <div className="wrapper">
                  <ul>
                    {this.state.itemsIdx2show.map((itemsIdx,idx) => {
                      let item = this.state.items[itemsIdx]
                      let links = ''
                      let tags = ''

                      if (item.links){
                        links = (
                          <div className='links'>
                            Links:
                            <ul>
                              {
                                  item.links.map((link,idx2) => {
                                    return (
                                      <li key={idx2}>
                                        <a href={link}>{link}</a>
                                      </li>
                                    )
                                  })
                              }
                            </ul>
                          </div>
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
                            <div className='titlebar' onClick={() => this.toggleItem( idx)}>
                              <div className='title'>{item.title}</div>
                              {item.owner === this.state.user.uid || item.user === this.state.user.displayName || item.user === this.state.user.email ?
                                <div className='right'>
                                  <a className="btn btn-default" href='#' onClick={(e) => this.editItemGui( e, idx)} aria-label="Settings">
                                    <i className="fa fa-edit" aria-hidden="true"></i>
                                  </a>
                                  <a className="btn btn-danger" href="#" onClick={(e) => this.removeItem(e, item.id)} aria-label="Delete">
                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                  </a>
                                </div>:null
                              }
                            </div>
                            <div className={this.state.itemsExt[idx].collapse ? 'content displayNone' : 'content'}>
                              <p>
                                {item.detail}
                              </p>
                              {links}
                              {tags}
                            </div>
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
