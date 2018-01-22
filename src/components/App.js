

import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import logo from './logo.svg';
import '../styles/App.scss';
// import firebase, { auth, provider } from '../firebase.js';

import MemoService from './services/MemoService.js'

import TagsList from './TagsList';


import { render } from 'react-dom';

const ReactMarkdown = require('react-markdown')

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

// import TokenAutocomplete from 'react-token-autocomplete';
// import TokenAutocomplete from '../../node_modules/react-token-autocomplete/src/TokenAutocomplete';
// import {TokenAutocomplete} from '../../node_modules/react-token-autocomplete/src';
// import TokenAutocomplete from '../../node_modules/react-token-autocomplete/src';
// import reactTokenAutocomplete from 'react-token-autocomplete';
// import { PowerSelect} from 'react-power-select'
// import { PowerSelectMultiple} from '../../node_modules/react-power-select/git/src'


// import { PowerSelectMultiple } from '../../node_modules/react-power-select/lib/'

import 'react-power-select/dist/react-power-select.css'

// var Memo = require('./models/Memo.js');

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

// function saveUser2database(user){
//   // e.preventDefault();
//   const usersRef = firebase.database().ref('users');
//   // const users = {
//   //   uid: this.state.user.uid,
//   //   username: this.state.user.username,
//   //   email: this.state.user.email,
//   //   display
//   // }
//   const user2save = (({uid,email,displayName})=>({uid,email,displayName}))(user);
//   // alert(JSON.stringify(user2save))
//
//   // user2save.last_login = functions.convertUTCDateToLocalDate(new Date())
//   // user2save.last_login = functions.convertUTCDateToLocalDate(new Date()).toString();
//   user2save.last_login = (new Date()).toString();
//
//   usersRef.orderByChild('uid').equalTo(user.uid).once('value',snapshot => {
//     const userData = snapshot.val();
//     const key = Object.keys(snapshot.val())[0];
//     if (userData) {
//       log(userData);
//       // snapshot.ref.update({key :user2save})
//       firebase.database().ref('users/'+key).update(user2save)
//       // userData.update(user2save)
//     } else {
//       usersRef.push(user2save);
//     }
//   });
//
//   // this.setState({
//   //   currentItem: '',
//   //   username: ''
//   // });
// }

class App extends Component {
  constructor() {
    super();
    this.state = {
      editingDetail: '',
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
      displayAceEditor: true,
      tagsList:[],
      searchKeyword: '',
      sortBy: '-time'
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeNewItem = this.handleChangeNewItem.bind(this);
    this.handleChangeArray = this.handleChangeArray.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    this.searchTag = this.searchTag.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.showAllItems = this.showAllItems.bind(this);
    this.changeCheckboxTag = this.changeCheckboxTag.bind(this);
    this.sortItem = this.sortItem.bind(this);
    this.isItemChanged = this.isItemChanged.bind(this);
    // this.onAceChange = this.onAceChange.bind(this);
    this.previewMarkdown = this.previewMarkdown.bind(this);
    this.clearSearchBox = this.clearSearchBox.bind(this);
    this.searchSearchBox = this.searchSearchBox.bind(this);
    this.handleKeyPressSearchbox = this.handleKeyPressSearchbox.bind(this);
    // this.sortItem = this.sortItem.bind(this);

    // this.handleKeyPress = this.handleKeyPress.bind(this);
    // this.toggleEditItem = this.toggleEditItem.bind(this);
    // this.login = this.login.bind(this); // <-- add this line
    // this.logout = this.logout.bind(this); // <-- add this line
    // this.saveUser2database = this.saveUser2database.bind(this);
  }
  updateTagsList(){
    let thisReact = this
    MemoService.getTags()
    .then(function (res) {
      let tagsList = res;
      // log(res)
      // item = res
      tagsList.sort(function(a,b){
        // log(a.tag > b.tag)
        return (a.tag.localeCompare(b.tag))
      })

      // log(JSON.stringify(tagsList))

      thisReact.setState({
        tagsList: tagsList
      })
    })


    // var tagsList = [{tag: 'untagged', count: 0}]
    //
    // this.state.items.concat([this.state.currentItem]).forEach(function(item,idx){
    //   if (item.tags.length === 0)
    //   {
    //     tagsList[0].count++
    //   }
    //   item.tags.forEach(function(tag){
    //
    //     // log(tag)
    //     let tagObj = tagsList.find((element) => {
    //       return element.tag === tag;
    //     })
    //
    //     // log(tagObj)
    //
    //     if (tagObj){
    //       tagObj.count++;
    //     } else {
    //       tagsList.push({
    //         tag: tag,
    //         count: 1
    //       })
    //     }
    //
    //   })
    // })
    //
    // // tagsList.sort(function(a,b){log(a.tag);return itemsIdx2show.sort(function(a,b){return (a.tag >b .tag)})})
    // tagsList.sort(function(a,b){
    //   // log(a.tag > b.tag)
    //   return (a.tag.localeCompare(b.tag))
    // })
    //
    // // log(JSON.stringify(tagsList))
    //
    // this.setState({
    //   tagsList: tagsList
    // });

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
      // log('state = searchKeyword')

      let newState = e.target.value

      this.setState(prevState =>(
        {
          searchKeyword: newState
        }
      ));

      this.searchKeyword(e.target.value)
    }
  }
  // updateEditForm(e,idx){
  //
  // }
  searchKeyword(keyword){
    let itemsIdx2show = []

    this.state.itemsExt.forEach((item,idx) => {
      if (functions.sir_searchstring(item.searchable , keyword)){
        itemsIdx2show.push(idx)
      }
    })

    itemsIdx2show.sort(function(a,b){return b-a})

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

  handleChangeArray(e, id) {

    if (typeof id !== 'undefined') {
      // log(id)
      // log(e)
      let newItemState = JSON.parse(JSON.stringify(this.state.items))
      let separator = ','

      switch (e.target.name){
        case 'links':
          separator = '\n'
      }

      newItemState[id][e.target.name]= e.target.value.split(separator)

      this.setState(prevState => ({
          items: newItemState
      }))

      if (e.target.name === 'tags'){
        // setTimeout(()=>this.updateTagsList(),1);
      }
    }
    else {
      let newItemState = JSON.parse(JSON.stringify(this.state.currentItem))
      let separator = ','

      switch (e.target.name){
        case 'links':
          separator = '\n'
      }
      // console.log(e.target.attributes.type.ownerElement)
      // log(e.target.value.split(separator))
      newItemState[e.target.name]= e.target.value.split(separator)

      this.setState(prevState => ({
          currentItem: newItemState
      }))

      if (e.target.name === 'tags'){
        // setTimeout(()=>this.updateTagsList(),1);
      }
    }

  }
  handleChangeNewItem(e) {

      // this.setValue(e.target.value)

      // let newItemState = JSON.parse(JSON.stringify(this.state.currentItem));
      let newItemState = this.state.currentItem;

      // console.log(e.target.attributes.type.ownerElement)
      newItemState[e.target.name]= e.target.value

      this.setState(prevState => ({
          currentItem: newItemState
      }))


  }
  handleChange(e,id) {

    // log(this.prop.handleChangeCounter++)
    // if (this.prop.handleChangeCounter%3 !== 0){
    //   return
    // }
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
      // let newItemState = JSON.parse(JSON.stringify(thisReact.state.items))
      let newItemState = JSON.parse(JSON.stringify(this.state.items));

      newItemState[id][e.target.name]= e.target.value

      this.setState(prevState => ({
          items: newItemState
      }))
    }
    else {
      let newItemState = JSON.parse(JSON.stringify(this.state.currentItem));

      // console.log(e.target.attributes.type.ownerElement)
      newItemState[e.target.name]= e.target.value

      this.setState(prevState => ({
          currentItem: newItemState
      }))
    }

  }
  // logout() {
  //   auth.signOut()
  //     .then(() => {
  //       this.setState({
  //         user: null
  //       });
  //     });
  // }
  // login() {
  //   auth.signInWithPopup(provider)
  //     .then((result) => {
  //       const user = result.user;
  //       this.setState({
  //         user
  //       });
  //       // saveUser2database(result.user)
  //     });
  // }
  onTextareaChange(e,idx){
    // log(newValue)
    // this.setState({
      // editingDetail: newValue
      // log(this.refs['_detail'+idx].value)

      // setTimeout(()=>{
      //   var editingDetail = this.refs['_detail'+idx].value
      //   this.refs['__detail'+idx].editor.setValue(editingDetail)
      // }, 500)

    // });
  }
  onAceChange(value,idx){
    // log(newValue)
    // this.setState({
      // editingDetail: newValue
      // log(this.refs['_detail'+idx].value)
      // setTimeout(()=>{
      //   if (this.refs['_detail'+idx].value !== value){
      //     this.refs['_detail'+idx].value = value
      //   }
      // }, 500)


      // this.refs['__detail'+idx].editor.setValue(editingDetail)
    // });
  }

  clearSearchBox(){
    this.refs.searchbox.value = ''
  }
  handleKeyPressSearchbox(e){
    if (e.key === 'Enter') {
     this.searchSearchBox()
    }
  }
  searchSearchBox(){
    let keyword = this.refs.searchbox.value

    log(keyword)
    let thisReact = this
    MemoService.find(keyword)
    .then(function (res) {
      let items = res;
      log(res)
      // item = res
      thisReact.setStateFromItem(res)
    })
  }

  swithchEditor(e,idx){
    e.preventDefault();

    if (this.state.displayAceEditor){
      this.refs['_detail'+idx].value = this.refs['__detail'+idx].editor.getValue()
    } else {
      console.log(this.refs['_detail'+idx].value)
      this.refs['__detail'+idx].editor.setValue(this.refs['_detail'+idx].value)
      // this.refs['__detail'+idx].editor.setValue('aaaa')
    }

    this.setState({
      displayAceEditor: ! this.state.displayAceEditor
    })


  }

  previewMarkdown(e,idx){
    e.preventDefault();
    log(idx)

    let items = JSON.parse(JSON.stringify(this.state.items))

    let editingDetail = ''

    if (this.state.displayAceEditor){
      editingDetail = this.refs['__detail'+idx].editor.getValue()
    } else {
      editingDetail = this.refs['_detail'+idx].value
    }



    items[idx].detail = editingDetail

    // log(this.refs['__detailPreview'+idx].children[0] )
    // log(this.refs['__detailPreview'+idx].children[0].value )
    // log(this.refs['__detailPreview'+idx].children[0].source )

    // this.refs['__detailPreview'+idx].children[0].value = 'bbbb'
    this.refs['__detailPreview'+idx].value = editingDetail
    this.setState({
      editingDetail: editingDetail,
      items: items
    });

    // this.refs['__detail'+idx].editor.setValue(editingDetail)


  }
  handleSubmit(e) {
    e.preventDefault();
    // const itemsRef = firebase.database().ref('items');

    let item = JSON.parse(JSON.stringify(this.state.currentItem));

    item.title = e.target.title.value
    // item.tags = e.target.tags.value.split(',')
    item.links = e.target.links.value.split('\n')
    item.detail = e.target.detail.value
    // item.update_at = (new Date()).toString()
    item.update_at = new Date()

    let thisReact = this;
    // log(thisReact)
    // let id = itemId;
    let updateState = function(idFromDbServer){

      item.id = idFromDbServer
      // let items = JSON.parse(JSON.stringify(thisReact.state.items))
      let items = JSON.parse(JSON.stringify(thisReact.state.items))
      // let items = thisReact.state.items
      let itemsIdx2show = JSON.parse(JSON.stringify(thisReact.state.itemsIdx2show))

      items.push(JSON.parse(JSON.stringify(item)))

      let itemsExt = items.map((item2) => {return {
        editMode: false,
        collapse: true,
        lastState: JSON.parse(JSON.stringify(item2)),
        // searchable: JSON.stringify(item2)
      }})

      // itemsIdx2show.push(items.length-1)

      itemsIdx2show.splice(0,0,items.length-1)


      thisReact.setState({
        items: items,
        itemsExt: itemsExt,
        itemsIdx2show: itemsIdx2show
      });

      thisReact.updateTagsList();

    }

    MemoService.add(item)
    .then(function (res) {
      let items = res;
      // log(11)
      // log(res)
      alert('Add success!')


      updateState(res._id)

      // closeEditMode()
    })
    .catch(function(err){
      alert('Add memo fail!\n'+err)
    })

    // itemsRef.push(item);
    // this.setState({
    //   currentItem: {
    //     owner: null,
    //     title: '',
    //     tags: [],
    //     detail: '',
    //     links: [],
    //     update_at: (new Date()).toString()
    //   }
    // });
  }
  handleSubmitEdit(e) {
    e.preventDefault();

    let _id = e.target.idx.value
    let detail = ''
    if (this.state.displayAceEditor){
      // let aceDetailElement = this.refs['__detail'+_id]
      detail = this.refs['__detail'+_id].editor.getValue()
    } else {

      detail = this.refs['_detail'+_id].value
      // this.refs['__detail'+idx].editor.setValue('aaaa')
    }

    // log(aceDetailElement)
    //
    // log(aceDetailElement.editor.getValue())
    // log(aceDetailElement.editor.value)

    // const item = {
    //   title: this.state.currentItem,
    //   user: this.state.user.displayName || this.state.user.email
    // }
    let item = JSON.parse(JSON.stringify(this.state.items[Number(e.target.idx.value)]))

    // log(e.target.idx.value)
    // log(item)
    // log(item.detail)

    item.title = e.target.title.value
    item.tags = e.target.tags.value.split(',')
    item.links = e.target.links.value.split('\n')
    // item.detail = e.target.detail.value

    item.detail = detail
    // item.update_at = (new Date()).toString()
    item.update_at = new Date()

    // const itemRef = firebase.database().ref('items/'+e.target.id.value);
    //
    // itemRef.update(item)
    let thisReact = this;
    let id = Number(e.target.idx.value);
    let updateState = function(){
      let items = JSON.parse(JSON.stringify(thisReact.state.items))
      items[id] = item

      let itemsExt = JSON.parse(JSON.stringify(thisReact.state.itemsExt))
      // log(id)
      itemsExt[id].editMode = false
      itemsExt[id].lastState = JSON.parse(JSON.stringify(item))
      thisReact.setState({
        items: items,
        itemsExt: itemsExt
      });

      thisReact.updateTagsList();
    }

    MemoService.edit(item, e.target.id.value)
    .then(function (res) {
      // let items = res;
      // log(res)
      // item = res
      // setStateFromItem(res)
      // log(11)
      // log(res)
      alert('Save success!')

      updateState()
    })
    .catch(function(err){
      alert('Save fail!\n'+err)
    })


  }
  componentDidMount() {
    let user = {
      'displayName' : 'SiR SiR',
      'email' : 'sirsak@gmail.com',
      'last_login' : 'Thu Dec 14 2017 14:07:39 GMT+0700 (+07)',
      'uid' : '0eSb19kpk5dj6eUzWllnYjC1zaj1'
    }
    let thisReact = this
    this.setState({
      user: user,
      searchKeyword: 'todo'
     });
    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     this.setState({ user });
    //   }
    // });

    // Memo.find({}, function(err, memos) {
    //   if (err) throw err;
    //
    //   // object of all the users
    //   log(memos);
    // });



    MemoService.find('todo')
    .then( (res) => {
      let items = res;
      // log(res)
      // item = res

      thisReact.setStateFromItem(res)

      thisReact.sortItem(null,'-time')
    })

  }
  searchTag(tagIn){
    // log(this.state.items)
    // log(111)
    // log(tagIn)

    let itemsIdx2show = []
    log(itemsIdx2show)
    if (tagIn === 'untagged'){
      this.state.items.forEach((item,idx) =>
      {
        if (item.tags.length === 0){
          itemsIdx2show.push(idx)
        }
      })

      log(itemsIdx2show)

    }
    else {
      this.state.items.forEach((item,idx) =>
      {
        if (item.tags.includes(tagIn)){
          itemsIdx2show.push(idx)
        }
      })
    }

    // log(itemsIdx2show)

    itemsIdx2show.sort(function(a,b){return b-a})

    this.setState({
      itemsIdx2show: itemsIdx2show
    });

    // log(tagIn)
  }
  setStateFromItem(items){
    let newState = [];
    // console.log(this.state.user.uid)
    items.forEach(function(item,idx){
      newState.push({
        id: item._id,
        title: item.title,
        detail: item.detail,
        // user: items[item].user,
        links: item.links,
        tags: item.tags,
        owner: item.owner,
        timestamp: item.timestamp,
        update_at: item.update_at
      });
    })

    let itemsExt = JSON.parse(JSON.stringify(newState)).map((item) => {return {
      editMode: false,
      collapse: true,
      lastState: JSON.parse(JSON.stringify(item))
      // searchable: JSON.stringify(item)
    }})

    // log(itemsExt)

    let itemsIdx2show = JSON.parse(JSON.stringify(newState)).map((item,idx) => {return idx})
    // itemsIdx2show.sort(function(a,b){return b-a})

    // log(itemsIdx2show)
    // log(thisReact)

    this.setState({
      // items: 'ddd'
      items: newState,
      itemsExt: itemsExt,
      itemsIdx2show: itemsIdx2show
    });

    this.updateTagsList();
  }
  removeItem(e, itemId) {
    e.preventDefault()
    e.stopPropagation()

    let thisReact = this;
    let id = itemId;
    let items = JSON.parse(JSON.stringify(thisReact.state.items))

    let idx = items.findIndex(function(item){
      return item.id === itemId
    })

    if (! confirm('Do you want to delete items? =>' + idx)) {
      return;
    }

    let updateState = function(){

      let itemsExt = thisReact.state.itemsExt
      let itemsIdx2show = JSON.parse(JSON.stringify(thisReact.state.itemsIdx2show))

      items.splice(idx,1)

      itemsIdx2show = itemsIdx2show.filter(function(item) {
          return item !== idx
      })

      itemsIdx2show = itemsIdx2show.map(function(id) {
          if (id > idx){
            return id-1
          }

          return id
      })

      itemsIdx2show.sort(function(a,b){return b-a})

      thisReact.setState({
        itemsIdx2show: []
      });


      itemsExt.splice(idx,1)

      thisReact.setState({
        items: items,
        itemsExt: itemsExt,
        itemsIdx2show: itemsIdx2show
      });
      thisReact.updateTagsList();

    }

    MemoService.remove( itemId)
    .then(function (res) {
      alert('Delete success!')

      updateState()
    })
    .catch(function(err){
      alert('Delete fail!\n'+err)
    })


  }
  editItemGui( e,idx) {
    e.preventDefault()
    e.stopPropagation()

    // log(React.version)
    // log(idx)
    // log(ReactDOM.findDOMNode(this.refs.myInput))
    // log(ReactDOM.findDOMNode(this.refs.myInput).value)

    // log(ReactDOM.findDOMNode(this.refs['_title'+idx]))
    // log(this.state.itemsExt)
    this.refs['_title'+idx].value = this.state.items[idx].title
    this.refs['_detail'+idx].value = this.state.items[idx].detail
    this.refs['_links'+idx].value = this.state.items[idx].links? this.state.items[idx].links.join('\n'): ''
    // ReactDOM.findDOMNode(this.refs['_title'+idx]).value = this.state.items[idx].title
    // ReactDOM.findDOMNode(this.refs['_detail'+idx]).value = this.state.items[idx].detail
    // ReactDOM.findDOMNode(this.refs['_links'+idx]).value = this.state.items[idx].links? this.state.items[idx].links.join('\n'): ''
    // findDOMNode(this.refs.myInput).focus();

    // log(this._title)
    // log(React.Children.count(this._title))
    // log(this._title.getDOMNode().value)
    // log(this._title.)
    // ReactDOM.findDOMNode(this._title).focus();
    // this._title.value = 'aaaaa'
    // this._title.focus()
    // this._title.value = this.state.itemsExt[idx].title
    // log(this._title.value)

    var itemsExt = JSON.parse(JSON.stringify(this.state.itemsExt))
    itemsExt[idx].editMode = ! itemsExt[idx].editMode
    this.setState({
      itemsExt: itemsExt
    });

  }
  isItemChanged(idx){
    // return true
    // log(this.state.items[idx].title)
    if (! this.refs['_title'+idx]
      || ! this.refs['_detail'+idx]
      || ! this.refs['_links'+idx]
    ) {
      return false
    }
    // log(this.refs['_title'+idx].value)
    if (
      this.refs['_title'+idx].value !== this.state.items[idx].title
      || this.refs['_detail'+idx].value !== this.state.items[idx].detail
      || this.refs['_links'+idx].value !== (this.state.items[idx].links? this.state.items[idx].links.join('\n'): '')
    ) {
      // log(165)
      log(true)
      return true
    } else {
      return false
    }
  }
  toggleItem( idx) {

    var itemsExt = JSON.parse(JSON.stringify(this.state.itemsExt))
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
  sortItem(e,sortBy) {
    // e.preventDefault()
    // e.stopPropagation()
    // log(this)

    let itemsIdx2show = JSON.parse(JSON.stringify(this.state.itemsIdx2show))

    let thisReact = this

    itemsIdx2show.sort(function(id1,id2){
      if (sortBy === 'title'){
        let c1 = thisReact.state.items[id1].title
        let c2 = thisReact.state.items[id2].title
        return c1.localeCompare(c2)
      } else if (sortBy === '-title'){
        let c1 = thisReact.state.items[id1].title
        let c2 = thisReact.state.items[id2].title
        return c2.localeCompare(c1)
      } else if (sortBy === 'time'){
        // log(thisReact.state.items[id1].id.getTimestamp())
        let c1 = thisReact.state.items[id1].update_at || thisReact.state.items[id1].timestamp || new Date(Date.UTC(0))
        let c2 = thisReact.state.items[id2].update_at || thisReact.state.items[id2].timestamp || new Date(Date.UTC(0))
        // return c1 > c2
        return new Date(c1).getTime() - new Date(c2).getTime()
      } else if (sortBy === '-time'){
        let c1 = thisReact.state.items[id1].update_at || thisReact.state.items[id1].timestamp || new Date(Date.UTC(0))
        let c2 = thisReact.state.items[id2].update_at || thisReact.state.items[id2].timestamp || new Date(Date.UTC(0))
        return new Date(c2).getTime() - new Date(c1).getTime()
      }

    })

    // log(itemsIdx2show.map(
    //   (id1) => {return thisReact.state.items[id1].update_at || thisReact.state.items[id1].timestamp || new Date(Date.UTC(0))}
    // ))
    //
    // log(itemsIdx2show.map(
    //   (id1) => {
    //     var a= thisReact.state.items[id1].update_at || thisReact.state.items[id1].timestamp || new Date(Date.UTC(0))
    //
    //     return new Date(a).getTime()
    //   }
    // ))

    log(sortBy)

    this.setState({
      itemsIdx2show: itemsIdx2show,
      sortBy: sortBy
    });
  }
  toggleDisplayState(item){
    var display = JSON.parse(JSON.stringify(this.state.display))
    display[item] = ! display[item]
    this.setState({
      display: display
    });
  }
  editItemGuiCancel( idx) {

    var itemsExt = JSON.parse(JSON.stringify(this.state.itemsExt))
    itemsExt[idx].editMode = ! itemsExt[idx].editMode

    var items = JSON.parse(JSON.stringify(this.state.items))
    items[idx] = JSON.parse(JSON.stringify(itemsExt[idx].lastState))
    this.setState({
      itemsExt: itemsExt,
      items: items
    });
  }
  changeCheckboxTag(idx,tagIn) {

    // log(idx)
    // log(tagIn)

    if (idx < 0){
      let currentItem = JSON.parse(JSON.stringify(this.state.currentItem));

      let tags = []

      tags =  this.state.currentItem.tags;

      if (currentItem.tags.includes(tagIn)){
        currentItem.tags = currentItem.tags.filter(item => item !== tagIn)
      } else {
        if (tagIn !== '') {
          currentItem.tags.push(tagIn)
          log('push '+tagIn)
        }

      }


      // log(JSON.stringify(this.state.itemsExt[idx].lastState.tags))
      // this.state.itemsExt[idx].lastState.tags = tags
      // log(JSON.stringify(this.state.itemsExt[idx].lastState.tags))

      this.setState( {
        currentItem: currentItem
        // itemsExt: itemsExtBackup
      });

      // this.updateTagsList()

      // log(JSON.stringify(currentItem.tags))


    } else {
      let newState = JSON.parse(JSON.stringify(this.state.items));

      let tags = []
      tags = JSON.parse(JSON.stringify(this.state.itemsExt[idx].lastState.tags))
      if (newState[idx].tags.includes(tagIn)){
        newState[idx].tags = newState[idx].tags.filter(item => item !== tagIn)
      }
      else {
        if (tagIn !== '') {
          newState[idx].tags.push(tagIn)

        }

      }

      // log(JSON.stringify(this.state.items[idx].tags))
      // log(JSON.stringify(this.state.itemsExt[idx].lastState.tags))



      // log(JSON.stringify(this.state.itemsExt[idx].lastState.tags))
      this.state.itemsExt[idx].lastState.tags = tags
      // log(JSON.stringify(this.state.itemsExt[idx].lastState.tags))

      this.setState( {
        items: newState
        // itemsExt: itemsExtBackup
      });

      // this.updateTagsList()

      log(JSON.stringify(this.state.itemsExt[idx].lastState.tags))
    }



  }
  createTagCheckbox(tagsAll,tagsHere,itemIdx){
    let thisReact = this

    return (
      <div className='tag-checkboxes'>

        {
          tagsAll.map(function(tag,idx){

            let checked = tagsHere.includes(tag.tag)?
              'checked':false;

            if (tag.tag !== ''){
              return (
                  <div key={idx}>
                    <input
                      type="checkbox"
                      onChange={thisReact.changeCheckboxTag.bind(this, itemIdx, tag.tag)}
                      checked={checked}
                      />
                    <label>{tag.tag}</label>
                  </div>

              )
            }


        })
      }
      </div>

    )
  }
  // <input autoComplete="off" autoCorrect="off" className="form-control input-lg" id="search-input" placeholder="Type in keyword here" spellCheck="false" tabIndex="1" onKeyPress={this.handleKeyPress} onChange={(e) => this.handleInputChange(e,'searchKeyword')} value={this.state.searchKeyword}/>
  render() {
    return (
      <div className='app'>
        <header>
          <div className="wrapper">
            <h1>Memo+Todo+Bookmarks</h1>
            {
              /*
              this.state.user ?
              <div className='right'>
                <div className='user-profile'>
                  <img src={this.state.user.photoURL} />
                </div>
                <button onClick={this.logout}>Logout</button>
              </div>

              :
              <button id='firebaseLoginButton' onClick={this.login}>Log In</button>
              */
            }
          </div>
        </header>
        {this.state.user ?
          <div>
            <div className='container'>
            <section id="searchbox">
              <div id="searchbox-box">
              {
                /*
                <input autoComplete="off" autoCorrect="off" className="form-control input-lg" id="search-input" placeholder="Type in keyword here in format 'keyword1&&keyword2&&-keywordX1'" spellCheck="false" tabIndex="1" onChange={(e) => this.handleInputChange(e,'searchKeyword')} value={this.state.searchKeyword}/>
                */
              }
                <input ref='searchbox' autoComplete="off" autoCorrect="off" className="form-control input-lg" id="search-input" placeholder="Type in keyword here in format 'keyword1&&keyword2&&-keywordX1'" spellCheck="false" tabIndex="1" onKeyPress={this.handleKeyPressSearchbox} defaultValue='todo'/>
              </div>
             <div id="searchbox-search-icon">
                <div className="table"><a aria-hidden="true" className="fa fa-search" href="#" onClick={this.searchSearchBox} id="search-clear"><span className="sr-only">Search</span></a></div>
             </div>
             <div id="searchbox-clear-icon">
                <div className="table"><a aria-hidden="true" className="fa fa-times-circle" href="#" onClick={this.clearSearchBox} id="search-clear"><span className="sr-only">Clear search</span></a></div>
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
              <div id="sort">

                <div className="table">
                <div>Sort:</div>
                {
                  this.state.sortBy !== 'title'?
                  <a aria-hidden="true"
                    className="fa fa-sort-alpha-asc"
                    href="#"
                    onClick={
                      (e)=>this.sortItem(e,'title')}
                  ></a>
                  :
                  null
                }
                {
                  this.state.sortBy !== '-title'?
                  <a aria-hidden="true"
                    className="fa fa-sort-alpha-desc"
                    href="#"
                    onClick={
                      (e)=>this.sortItem(e,'-title')
                    }
                  ></a>
                  :
                  null
                }
                {
                  this.state.sortBy !== 'time'?
                  <a aria-hidden="true"
                    className="fa fa-sort-numeric-asc"
                    href="#"
                    onClick={
                      (e)=>this.sortItem(e,'time')
                    }
                  ></a>
                  :
                  null
                }
                {
                  this.state.sortBy !== '-time'?
                  <a aria-hidden="true"
                    className="fa fa-sort-numeric-desc"
                    href="#"
                    onClick={
                      (e)=>this.sortItem(e,'-time')
                    }
                  ></a>
                  :
                  null
                }
                </div>
              </div>
            </div>
            <section className={this.state.display.newItem ? 'add-item' : 'add-item displayNone'}>
              <form onSubmit={this.handleSubmit}>
                {/*
                  <input type="hidden" name="username" placeholder="What's your name?" readOnly="true" value={this.state.user.displayName || this.state.user.email } />
                  <div className='form-label'>Title: </div>
                  <input type="text" name="title" placeholder="title?" onChange={this.handleChangeNewItem} value={this.state.currentItem.title} />
                  <div className='form-label'>Tags: </div>
                  {this.createTagCheckbox(this.state.tagsList,this.state.currentItem.tags,-1)}
                  <input type="text" name="tags" placeholder="tags (separated by ,)" onChange={this.handleChangeArray} value={this.state.currentItem.tags} />
                  <div className='form-label'>Detail: </div>
                  <textarea type="text" name="detail" placeholder="Details?" onChange={this.handleChange} value={this.state.currentItem.detail} />
                  <div className='form-label'>Link: </div>
                  <textarea type="text" name="links" placeholder="related links" onChange={this.handleChangeArray} value={this.state.currentItem.links} />
                */}
                <div className='form-label'>Title: </div>
                <input type="text" name="title" placeholder="title?"  />
                <div className='form-label'>Tags: </div>
                {this.createTagCheckbox(this.state.tagsList,this.state.currentItem.tags,-1)}
                <input type="text" name="tags" placeholder="tags (separated by ,)" onChange={this.handleChangeArray} value={this.state.currentItem.tags} />
                <div className='form-label'>Detail: </div>
                <textarea type="text" name="detail" placeholder="Details?" />
                <div className='form-label'>Link: </div>
                <textarea type="text" name="links" placeholder="related links" />
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
                            <i className="fa fa-link" aria-hidden="true"></i>
                            {/*
                              Links:
                              */
                            }
                            <ul>
                              {
                                  item.links.map((link,idx2) =>
                                    <li key={idx2}>
                                      <a href={link}>{link}</a>
                                    </li>
                                  )

                              }
                            </ul>
                          </div>
                          )
                      }

                      if (item.tags){
                        tags = (
                          <div className='tags'>
                            <i className="fa fa-tags" aria-hidden="true"></i>
                              {/*
                                Tags:
                                */
                              }
                              <ul className="posttags2">
                                {
                                    item.tags.map((tag,idx2) =>
                                        <li key={idx2} >
                                          <a href=''>{tag} <span></span></a>
                                        </li>
                                      )
                                }
                              </ul>
                            </div>
                          )
                      }

                      return (
                        <li key={idx} >
                          <div className={this.state.itemsExt[itemsIdx].editMode ? 'present-mode displayNone' : 'present-mode'}>
                            <div className='titlebar' onClick={() => this.toggleItem( itemsIdx)}>
                              <div className='title'>{item.title}</div>
                              {
                                /*
                                item.owner === this.state.user.uid || item.user === this.state.user.displayName || item.user === this.state.user.email ?
                                */
                                <div className='right'>
                                  <div className="itemsIdx">
                                    [{itemsIdx}]
                                  </div>
                                  <a className="btn btn-default" href='#' onClick={(e) => this.editItemGui( e, itemsIdx)} aria-label="Settings">
                                    <i className="fa fa-edit" aria-hidden="true"></i>
                                  </a>
                                  <a className="btn btn-danger" href="#" onClick={(e) => this.removeItem(e, item.id)} aria-label="Delete">
                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                  </a>
                                </div>
                              }
                            </div>
                            <div className={this.state.itemsExt[itemsIdx].collapse ? 'content displayNone' : 'content'}>
                              <div>
                                <i className="fa fa-info-circle" aria-hidden="true"></i>
                                <div className='detail'>
                                <ReactMarkdown source={item.detail} />
                                </div>
                              </div>
                              {links}
                              {tags}
                            </div>
                          </div>
                          <div className={this.state.itemsExt[itemsIdx].editMode ? 'edit-mode' : 'edit-mode displayNone'}>
                          <div className='titlebar' onClick={() => this.toggleItem( itemsIdx)}>
                            <div className='title'>{item.title}</div>
                            {
                              /*
                              item.owner === this.state.user.uid || item.user === this.state.user.displayName || item.user === this.state.user.email ?
                              */
                              <div className='right'>
                                <a className="btn btn-default" href='#' onClick={(e) => this.editItemGui( e, itemsIdx)} aria-label="Settings">
                                  <i className="fa fa-edit" aria-hidden="true"></i>
                                </a>
                                <a className="btn btn-danger" href="#" onClick={(e) => this.removeItem(e, item.id)} aria-label="Delete">
                                  <i className="fa fa-trash-o" aria-hidden="true"></i>
                                </a>
                              </div>
                            }
                          </div>
                            <form onSubmit={this.handleSubmitEdit} >
                              <div className='right'>
                                {
                                  /*
                                  JSON.stringify(this.state.items[itemsIdx]) !== JSON.stringify(this.state.itemsExt[itemsIdx].lastState) ?

                                  this.isItemChanged(itemsIdx) ?
                                  <button type="submit" className="btn-link">
                                    <a className="btn btn-default" href='#' onClick={(e) => this.handleSubmitEdit} aria-label="Settings">
                                      <i className="fa fa-floppy-o" aria-hidden="true"></i>
                                    </a>
                                  </button>
                                  :
                                  null
                                  */
                                }
                                <button type="submit" className="btn-link">
                                  <a className="btn btn-default" href='#' onClick={(e) => this.handleSubmitEdit} aria-label="Settings">
                                    <i className="fa fa-floppy-o" aria-hidden="true"></i>
                                  </a>
                                </button>

                                {
                                  /*
                                  <a className="btn btn-danger" href="#" onClick={() => this.editItemGuiCancel( itemsIdx)} aria-label="Delete">
                                    <i className="fa fa-window-close" aria-hidden="true"></i>
                                  </a>

                                  */
                                }
                                <a className="btn btn-danger" href="#" onClick={() => this.editItemGuiCancel( itemsIdx)} aria-label="Delete">
                                  cancel
                                </a>

                              </div>
                              {
                                /*
                                <button type="button" onClick={() => this.editItemGuiCancel( itemsIdx)}>Cancel</button>
                                <input type="hidden" name="id" placeholder="id" readOnly="true" value={item.id} />
                                <input type="hidden" name="idx" placeholder="idx" readOnly="true" value={itemsIdx} />
                                <div className='form-label'>Title: </div>
                                <input type="text" name="title" placeholder="title?" onChange={(e) => this.handleChange(e, itemsIdx)} value={this.state.items[itemsIdx].title} />
                                <input type="text" name="tags" placeholder="tags (separated by ,)" onChange={(e) => this.handleChangeArray(e, itemsIdx)} value={this.state.items[itemsIdx].tags.join(',')} />
                                <div className='form-label'>Detail: </div>
                                <textarea type="text" name="detail" placeholder="Details?" onChange={(e) => this.handleChange(e, itemsIdx)} value={this.state.items[itemsIdx].detail} />
                                <div className='form-label'>Links: </div>
                                <textarea type="text" name="links" placeholder="related links" onChange={(e) => this.handleChangeArray(e, itemsIdx)} value={this.state.items[itemsIdx].links? this.state.items[itemsIdx].links.join('\n'): ''} />
                                <input type="text" name="title" placeholder="title?" value={this.state.items[itemsIdx].title} ref={input => this._title = input} />
                                <input type="text" name="title" placeholder="title?" value={this.state.items[itemsIdx].title} ref={input => this.refs['_title'+itemsIdx] = input} />
                                */
                              }
                              <input type="hidden" name="id" placeholder="id" readOnly="true" value={item.id} />
                              <input type="hidden" name="idx" placeholder="idx" readOnly="true" value={itemsIdx} />
                              <div className='form-label'>Title: </div>
                              <input type="text" name="title" placeholder="title?" onChange={(e)=> {}} defaultValue={this.state.items[itemsIdx].title } ref={'_title'+itemsIdx} />
                              <div className='form-label'>Tags: </div>
                              {
                                /*
                                <TokenAutocomplete
                                  placeholder="type to limit suggestions"
                                  defaultValues={['apple']}
                                  options={['apple', 'banana', 'carrot', 'watermelon']}
                                />
                                <PowerSelect
                                  options={['React', 'Ember', 'Angular', 'Vue', 'Preact', 'Inferno']}
                                  selected={this.state.selectedOption}
                                  onChange={(e) => console.log('aa')}
                                />
                                <PowerSelectMultiple
                                  options={['React', 'Ember', 'Angular', 'Vue', 'Preact', 'Inferno']}
                                  selected={this.state.selectedOption}
                                  onChange={(e) => console.log('aa')}
                                  placeholder="Select your favourite frameworks"
                                />


                                {this.createTagCheckbox(this.state.tagsList,this.state.items[itemsIdx].tags)}
                                */

                              }

                              {this.createTagCheckbox(this.state.tagsList,this.state.items[itemsIdx].tags,itemsIdx)}
                              <input type="text" name="tags" placeholder="tags (separated by ,)" onChange={(e) => this.handleChangeArray(e, itemsIdx)} value={this.state.items[itemsIdx].tags.join(',')} />
                              <div className='form-label'>
                              <span>Detail: </span>
                              <div className='btn-switchEditor' >
                              <input type='button' onClick={(e) => this.swithchEditor(e,itemsIdx)} value='Switch Editor' />
                              </div>
                                <div className='btn-detail_preview right'>

                                 <input type='button' onClick={(e) => this.previewMarkdown(e,itemsIdx)} value='Markdown update' />
                                </div>
                              </div>

                              <div className={this.state.displayAceEditor ? 'container4ace' : 'container4ace displayNone'}>
                                <AceEditor
                                  mode="javascript"
                                  theme="monokai"
                                  ref={'__detail'+itemsIdx}
                                  onChange={(value)=>this.onAceChange(value,itemsIdx)}
                                  value={this.state.items[itemsIdx].detail}
                                  setOptions={{
                                    highlightActiveLine: true,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                    minLines: 20,
                                    maxLines: 40
                                  }}
                                  editorProps={{$blockScrolling: true}}
                                 />

                               </div>
                               <textarea type="text" name="detail" placeholder="Details?" className={this.state.displayAceEditor ? 'displayNone' : 'container4ace'} onChange={(e)=> this.onTextareaChange(e,itemsIdx)} defaultValue={this.state.items[itemsIdx].detail}  ref={'_detail'+itemsIdx}/>
                               <div className='detail_preview'  ref={'__detailPreview'+itemsIdx}>
                               <ReactMarkdown source={this.state.editingDetail}/>

                              </div>


                               {
                                 /*
                                 <textarea type="text" name="detail" placeholder="Details?" className={this.state.displayAceEditor ? 'displayNone' : ''} onChange={(e)=> this.onTextareaChange(e,itemsIdx)} defaultValue={this.state.items[itemsIdx].detail}  ref={'_detail'+itemsIdx}/>

                                                                 <div ref={'s__detailPreview'+itemsIdx} />
                                 <ReactMarkdown source={this.state.editingDetail} />
                                                                     autoScrollEditorIntoView: true,
                                                                 editorProps={{$blockScrolling: true}}
                                 <textarea type="text" name="detail" placeholder="Details?" value={this.state.items[itemsIdx].detail}  ref={'_detail'+itemsIdx}/>
                                 */
                               }

                              <div className='form-label'>Links: </div>
                              <textarea type="text" name="links" placeholder="related links" onChange={(e)=> {}} defaultValue={this.state.items[itemsIdx].links? this.state.items[itemsIdx].links.join('\n'): ''} ref={'_links'+itemsIdx} />

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
