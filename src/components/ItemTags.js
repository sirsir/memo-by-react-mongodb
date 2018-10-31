import React from 'react';

class ItemTags extends React.Component {
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
      <div className='tags'>
        <i className="fa fa-tags" aria-hidden="true"></i>
          {/*
            Tags:
            */
          }
          <ul className="posttags2">
            {
                this.props.tags.map((tag,idx2) =>
                    <li key={idx2} >
                      <a href=''>{tag} <span></span></a>
                    </li>
                  )
            }
          </ul>
        </div>
    )
  }
}


export default ItemTags;
