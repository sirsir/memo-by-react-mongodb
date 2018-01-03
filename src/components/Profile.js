import React from 'react';

const Profile = props => {
    const profileObj = props.profileData;

    const tel = profileObj.phone;
    const lineId = profileObj.profiles.find(o => o.network === 'line').username;

    return  <div>
                  <div className="profileImg"><img role="presentation" className="img-circle center-block" src={profileObj.picture} width="100" /></div>
                  <h1 className="text-center">{profileObj.name}</h1>
                  <h2 className="text-center">{profileObj.label}</h2>
                  <div className="divider"></div>
                  <ul className="list-unstyled contact-links text-center">
                    <li><i className="fa fa-lg fa-location-arrow"></i>{profileObj.location.city}, {profileObj.location.region}, {profileObj.location.countryCode}</li>
                    <li><i className="fa fa-lg fa-envelope"></i><a href={`mailto:${profileObj.email}`}>{profileObj.email}</a></li>
                    <li><img className="leading-icon" src="./icon/LINE_Icon.png" /> <a href={lineId}>{lineId}</a></li>
                    <li><i className="fa fa-lg fa-mobile"></i><a href={tel}>{'Mobile: ' + tel}</a></li>
                  </ul>
                  <div className="small-comment">
                    <div className="divider"></div>
                    <p>The full details are available online at <a href="https://sirsir-resume.firebaseapp.com/">https://sirsir-resume.firebaseapp.com/</a>.</p>
                    <div className="divider"></div>
                    <p>I built this site with <a href="https://facebook.github.io/react/">React</a> components and a <a href="https://jsonresume.org/schema/">JSON Resume Schema</a>. The source code is cloned and modified from <a href="https://github.com/freaksauce/React-Resume-ES6">Jonathan Bloomer's Github repo</a>.</p>
                  </div>
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

export default Profile;
