import React from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';

const ReactMarkdown = require('react-markdown')

class FormEditItem extends React.Component {
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
    // console.log('aaaa')
    // console.log(this.props.itemsIdx)
    // console.log(this.props.state.items[this.props.itemsIdx])
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
  //   let keyword = this.refX.searchbox.value
  //
  //   // console.log(keyword)
  //
  //   this.props.searchSearchBox(keyword)
  // }
  // clearSearchBox(){
  //   this.refX.searchbox.value = ''
  // }

  render (){
    return (
      <form onSubmit={this.props.handleSubmitEdit} >
        <div className='right'>
          <button type="submit" className="btn-link">
            <a className="btn btn-default" href='#' onClick={(e) => this.props.handleSubmitEdit} aria-label="Settings">
              <i className="fa fa-floppy-o" aria-hidden="true"></i>
            </a>
          </button>
          <a className="btn btn-danger" href="#" onClick={() => this.props.editItemGuiCancel( this.props.itemsIdx)} aria-label="Delete">
            cancel
          </a>

        </div>
        <input type="hidden" name="id" placeholder="id" readOnly="true" value={this.props.item.id} />
        <input type="hidden" name="idx" placeholder="idx" readOnly="true" value={this.props.itemsIdx} />
        <div className='form-label'>Title: </div>
        <input type="text" name="title"
         placeholder="title?"
          onChange={(e)=> {}}
           defaultValue={this.props.state.items[this.props.itemsIdx].title }
           ref=
           {
             (node)=> {
               this.props.setRef('_title'+this.props.itemsIdx, node)
             }
           }
           />
        <div className='form-label'>Tags: </div>

        {
          this.props.createTagCheckbox(
            this.props.state.tagsList,
            this.props.state.items[this.props.itemsIdx].tags,
            this.props.itemsIdx,
            this.props.changeCheckboxTag
          )
        }

        <input type="text" name="tags"
         placeholder="tags (separated by ,)"
          onChange={
            (e) => this.props.handleChangeArray(e, this.props.itemsIdx)
          }
          value={this.props.state.items[this.props.itemsIdx].tags.join(',')}
        />
        <div className='form-label'>
          <span>Detail: </span>
          <div className='btn-switchEditor' >
            <input type='button' onClick={(e) => this.props.switchEditor(e,this.props.itemsIdx)} value='Switch Editor' />
          </div>
          <div className='btn-detail_preview right'>
           <input type='button' onClick={(e) => this.props.previewMarkdown(e,this.props.itemsIdx)} value='Markdown update' />
          </div>
        </div>


        <div className={this.props.state.displayAceEditor ? 'container4ace' : 'container4ace displayNone'}>
          <AceEditor
            mode="javascript"
            theme="monokai"
            ref=
            {
              (node)=> {
                this.props.setRef('__detail'+this.props.itemsIdx, node)
              }
            }
            onChange={(value)=>this.props.onAceChange(value,this.props.itemsIdx)}
            value={this.props.state.items[this.props.itemsIdx].detail}
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


         <textarea type="text" name="detail"
          placeholder="Details?"
          className={
            this.props.state.displayAceEditor ? 'displayNone' : 'container4ace'
          }
          onChange={
            (e)=> this.props.onTextareaChange(e,this.props.itemsIdx)
          }
          defaultValue={this.props.state.items[this.props.itemsIdx].detail}
          ref=
          {
            (node)=> {
              this.props.setRef('_detail'+this.props.itemsIdx, node)
            }
          }
        />

          <div className='detail_preview'
            ref=
            {
              (node)=> {
                this.props.setRef('__detailPreview'+this.props.itemsIdx, node)
              }
            }
          >
          <ReactMarkdown source={this.props.state.editingDetail}/>
          </div>

        <div className='form-label'>Links: </div>
        <textarea type="text" name="links"
          placeholder="related links"
          onChange={(e)=> {}}
          defaultValue={
            this.props.state.items[this.props.itemsIdx].links?
              this.props.state.items[this.props.itemsIdx].links.join('\n')
              :
              ''
          }
          ref=
          {
            (node)=> {
              this.props.setRef('_links'+this.props.itemsIdx, node)
            }
          }

          />


      </form>

    )
  }
}


export default FormEditItem;
