import React from 'react';

class SelectKeywords extends React.Component {
  constructor(props) {
    super(props);

    // bind onSubmit and onInput
    this.onChange = this.onChange.bind(this);

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
  //
  // // submit handler
  // onSubmit() {
  //   this.props.onSubmit(this.state.input);
  // }

  onChange(e){
    this.props.setSearchKeyword(e.target.value)
  }

  // handleKeyPressSearchbox(e){
  //   // console.log('xxxxx')
  //
  //   if (e.key === 'Enter') {
  //     // console.log('Enter')
  //     this.searchSearchBox()
  //   }
  // }
  // searchSearchBox(){
  //   let keyword = this.props.refX.searchbox.value
  //
  //   // console.log(keyword)
  //
  //   this.props.searchSearchBox(keyword)
  // }
  // clearSearchBox(){
  //   this.props.refX.searchbox.value = ''
  // }

  render (){
    return (
      <section id="selectKeywords">
        <div id="selectKeywords-box">
          <select onChange={this.onChange} value={this.props.keywords[this.props.keywords.length-1]}>
          {
              this.props.keywords?
                this.props.keywords.map(
                  (keyword,idx) => (
                    <option value={keyword} key={idx}>{keyword}</option>
                  )
                )
                :
                null
          }
          </select>
        </div>
      </section>

    )
  }
}


export default SelectKeywords;
