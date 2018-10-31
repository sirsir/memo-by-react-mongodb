import React from 'react';

class ItemLinks extends React.Component {
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




  render (){
    return (
      <div className='links'>
        <i className="fa fa-link" aria-hidden="true"></i>
        <ul>
          {
              this.props.links.map(
                (
                  link,idx2) =>
                    <li key={idx2}>
                      <a href={link}>{link}</a>
                    </li>
                )
          }
        </ul>
      </div>
    )
  }
}


export default ItemLinks;
