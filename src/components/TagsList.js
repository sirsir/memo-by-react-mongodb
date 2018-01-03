import React from 'react';

const TagsList = props => {
    // const tagsListObj = props.tagsListData;

    // const tel = profileObj.phone;
    // const lineId = profileObj.profiles.find(o => o.network === 'line').username;

    let tags = ''

    if (props.tagsList && props.tagsList.length !== 0){
      let max = props.tagsList.reduce((num, tag)=>{return Math.max(tag.count, num)}, 0)
      let min = props.tagsList.reduce((num, tag)=>{return Math.min(tag.count, num)}, max)

      // let min = props.tagsList.reduce((num, tag)=>{console.log(tag.count);console.log(Math.min(tag.count, num));return Math.min(tag.count, num)},0)
      // let max = props.tagsList.reduce((num,tag)=>{return Math.max(tag.count, num)})

      let minSize = 0.8
      let maxSize = 1.5
      tags = (
        <div className='tags'>
          Tags:
            <ul className="tags-list">
              {
                  props.tagsList.map((tag,idx) => {
                    let tagSize = minSize + (tag.count-min) / (max-min) *(maxSize-minSize)
                    // console.log(tagSize)
                    return (
                      <li key={idx} style={{
                        fontSize: tagSize.toString()+'em'
                      }} >
                        <a href='#' onClick={()=>{props._searchTag(tag.tag)}}>{tag.tag} <span></span></a>
                      </li>
                    )
                  })
              }
            </ul>
          </div>
        )
    }

    return  <div className={props.display? 'tags-list' : 'tags-list displayNone'} >
                  {tags}
            </div>
};


// <li><i className="fa fa-lg fa-location-arrow"></i>{profileObj.location.city}, {profileObj.location.region}, {profileObj.location.countryCode}</li>
// <li><i className="fa fa-lg fa-envelope"></i><a href={`mailto:${profileObj.email}`}>E-mail: {profileObj.email}</a></li>
// <li><i className="fa fa-lg fa-id-card"></i><a href={'LINE:'+lineId}>{'LINE: '+lineId}</a></li>
// <li><i className="fa fa-lg fa-mobile"></i><a href={tel}>{'Mobile: ' + tel}</a></li>

// <div className="divider"></div>
// <ul className="profileLinks list-inline text-center">
// <li><a className="fa fa-mobile fa-2x" href={tel}></a></li>
// <li><a className="fa fa-id-card fa-2x" href={'LINE:'+lineId}></a></li>
// </ul>

// <div className="divider"></div>
// <ul className="profileLinks list-inline text-center">
//   <li><a className="fa fa-twitter fa-2x" href={'https://twitter.com/'+profileObj.profiles[0].username}></a></li>
//   <li><a className="fa fa-github fa-2x" href={'https://github.com/'+profileObj.profiles[1].username}></a></li>
// </ul>
// <div className="divider"></div>
// <p>I built this site with <a href="https://facebook.github.io/react/">React</a> components and a <a href="https://jsonresume.org/schema/">JSON Resume Schema</a>. The full source code can be found in <a href="https://github.com/freaksauce/React-Resume-ES6">my Github repo</a>.</p>

export default TagsList;
