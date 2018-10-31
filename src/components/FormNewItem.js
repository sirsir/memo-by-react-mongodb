import React from 'react';

class FormNewItem extends React.Component {
  constructor(props) {
    super(props);

    // bind onSubmit and onInput
    // this.searchSearchBox = this.searchSearchBox.bind(this);
    // this.handleKeyPressSearchbox = this.handleKeyPressSearchbox.bind(this);
    // this.clearSearchBox = this.clearSearchBox.bind(this);

    // init state
    // this.state = {
    //   input: ''
    // };
  }

  // input change handler
  // onInput(e) {
  //   this.setState({
  //     input: e.target.value
  //   });
  // }



  // submit handler
  // onSubmit() {
  //   this.props.onSubmit(this.state.input);
  // }
  //
  // handleKeyPressSearchbox(e){
  //   // console.log('xxxxx')
  //
  //   if (e.key === 'Enter') {
  //     // console.log('Enter')
  //     this.searchSearchBox()
  //   }
  // }
  // searchSearchBox(){
  //   let keyword = this.refs.searchbox.value
  //
  //   // console.log(keyword)
  //
  //   this.props.searchSearchBox(keyword)
  // }
  // clearSearchBox(){
  //   this.refs.searchbox.value = ''
  // }

  render (){
    return (
      <section className=
        {
          this.props.state.display.newItem ?
            'add-item' : 'add-item displayNone'
        }
      >
        <form onSubmit={this.props.handleSubmit}>
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
          {
            this.props.createTagCheckbox(
              this.props.state.tagsList,
              this.props.state.currentItem.tags,
              -1,
              this.props.changeCheckboxTag
            )
          }
          <input type="text" name="tags"
           placeholder="tags (separated by ,)"
           onChange={this.props.handleChangeArray}
          value={this.props.state.currentItem.tags} />
          <div className='form-label'>Detail: </div>
          <textarea type="text" name="detail" placeholder="Details?" />
          <div className='form-label'>Link: </div>
          <textarea type="text" name="links" placeholder="related links" />
          <button>Add Item</button>
        </form>
      </section>

    )
  }
}


export default FormNewItem;
