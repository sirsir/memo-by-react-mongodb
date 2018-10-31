import React from 'react';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    // bind onSubmit and onInput
    this.searchSearchBox = this.searchSearchBox.bind(this);
    this.handleKeyPressSearchbox = this.handleKeyPressSearchbox.bind(this);
    this.clearSearchBox = this.clearSearchBox.bind(this);

    // init state
    this.state = {
      input: ''
    };
  }

  // input change handler
  onInput(e) {
    this.setState({
      input: e.target.value
    });
  }

  // submit handler
  onSubmit() {
    this.props.onSubmit(this.state.input);
  }

  handleKeyPressSearchbox(e){
    // console.log('xxxxx')

    if (e.key === 'Enter') {
      // console.log('Enter')
      this.searchSearchBox()
    }
  }
  searchSearchBox(){
    let keyword = this.refs.searchbox.value

    // console.log(keyword)

    this.props.searchSearchBox(keyword)
  }
  clearSearchBox(){
    this.refs.searchbox.value = ''
  }

  render (){
    return (
      <div id="tools">
        <div id="addItemButton">
          <div className="table"><a aria-hidden="true" className="fa fa-plus-square" href="#" onClick={() => {this.props.toggleDisplayState('newItem')}} >Add new item</a></div>
        </div>
        <div id="showTagsListButton">
          <div className="table"><a aria-hidden="true"
           className="fa fa-tags" href="#"
            onClick={
              () => {
                this.props.toggleDisplayState('tagsList')
              }
            } >
            {this.props.display.tagsList? 'Hide tags list': 'Show tags list'}</a></div>
        </div>
        {this.props.itemsIdx2show.length !== this.props.items.length ?
          <div id="showAll">
            <div className="table">
            <a aria-hidden="true" className="fa fa-undo" href="#"
             onClick={this.props.showAllItems} >Show all</a></div>
          </div>:null
        }
        { this.props.itemsExt.reduce((boolOut, itemExt)=>{return boolOut && (! itemExt.collapse)},true) === false?
          <div id="expandAll">
            <div className="table">
            <a aria-hidden="true" className="fa fa-plus-square-o"
            href="#" onClick={
              () => {this.props.toggleItem(false)}
            } >Expand all</a></div>
          </div>
          :
          null
        }
        { this.props.itemsExt.reduce((boolOut, itemExt)=>{
          return boolOut && (itemExt.collapse)},true) === false?
            <div id="collapseAll">
              <div className="table">
                <a aria-hidden="true" className="fa fa-minus-square-o" href="#"
                 onClick={() => {this.props.toggleItem(true)}} >
                  Collapse all
                </a>
              </div>
            </div>
            :
            null
        }
        <div id="sort">

          <div className="table">
          <div>Sort:</div>
          {
            this.props.sortBy !== 'title'?
            <a aria-hidden="true"
              className="fa fa-sort-alpha-asc"
              href="#"
              onClick={
                (e)=>this.props.sortItem(e,'title')}
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
                (e)=>this.props.sortItem(e,'-title')
              }
            ></a>
            :
            null
          }
          {
            this.props.sortBy !== 'time'?
            <a aria-hidden="true"
              className="fa fa-sort-numeric-asc"
              href="#"
              onClick={
                (e)=>this.props.sortItem(e,'time')
              }
            ></a>
            :
            null
          }
          {
            this.props.sortBy !== '-time'?
            <a aria-hidden="true"
              className="fa fa-sort-numeric-desc"
              href="#"
              onClick={
                (e)=>this.props.sortItem(e,'-time')
              }
            ></a>
            :
            null
          }
          </div>
        </div>
      </div>

    )
  }
}


export default Toolbar;
