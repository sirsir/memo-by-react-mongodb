import React from 'react';

class SearchBox extends React.Component {
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
    let keyword = this.props.refX.searchbox.value

    // console.log(keyword)

    this.props.searchSearchBox(keyword)
  }
  clearSearchBox(){
    this.props.refX.searchbox.value = ''
  }

  render (){
    return (
      <section id="searchbox">
        <div id="searchbox-box">
        {
          /*
          <input autoComplete="off" autoCorrect="off" className="form-control
          input-lg" id="search-input"
          placeholder="Type in keyword here in format 'keyword1&&keyword2&&-keywordX1'"
           spellCheck="false" tabIndex="1" onChange={(e) => this.handleInputChange(e,'searchKeyword')} value={this.state.searchKeyword}/>
          */
        }
          <input
            ref=
            {
              (node)=> {
                this.props.setRef('searchbox', node)
              }
            }
            autoComplete="off" autoCorrect="off"
            className="form-control input-lg" id="search-input"
            placeholder="Type in keyword here in format 'keyword1&&keyword2&&-keywordX1'"
            spellCheck="false" tabIndex="1"
            onKeyPress={this.handleKeyPressSearchbox}
            defaultValue={this.props.keyword}/>
        </div>
       <div id="searchbox-search-icon">
          <div className="table">
            <a aria-hidden="true"
              className="fa fa-search"
              href="#" onClick={this.searchSearchBox}
              id="search-clear">
                <span className="sr-only">
                  Search
                </span>
            </a>
          </div>
       </div>
       <div id="searchbox-clear-icon">
          <div className="table">
            <a aria-hidden="true" className="fa fa-times-circle"
             href="#" onClick={this.clearSearchBox} id="search-clear">
              <span className="sr-only">Clear search</span>
            </a>
          </div>
       </div>
      </section>

    )
  }
}


export default SearchBox;
