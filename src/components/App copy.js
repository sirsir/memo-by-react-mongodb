import React, { PropTypes } from 'react';
import Profile from './Profile';
import About from './About';
import Work from './Work';
import Skills from './Skills';
import Education from './Education';
import Project from './Project';

const App = props => {
  const profileData = props.jsonObj.resume.basics;
  const aboutData = profileData.summary;
  const workData = props.jsonObj.resume.work;
  const skillsData = props.jsonObj.resume.skills;
  const educationData = props.jsonObj.resume.education;
  const projectData = props.jsonObj.project

  // console.log(profileData)
  return (
          <div className="container">
            <div className="row">
              <aside className="col-md-4">
                <div className="inner">
                  <Profile profileData={profileData} />
                </div>
              </aside>
              <main className="col-md-8">
                <div className="inner">
                  <About aboutData={aboutData} />
                  <Work workData={workData} />
                  <Skills skillsData={skillsData} />
                  <Education educationData={educationData} />
                  <Project projectData={projectData} />
                </div>
              </main>
            </div>
          </div>
    )
};

App.propTypes = {
    jsonObj: PropTypes.object.isRequired
}

export default App;
