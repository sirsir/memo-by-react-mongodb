import React from 'react';
import moment from 'moment';

const Project = props => {
    // const props.projectData

    const fnProjectFromObj = (item)=>{
      return (
          <div>
            <h5>{item.name} </h5>
            <h6>{item.description}</h6>
            <ul>
              <li>End-user: {item.enduser}</li>
              <li>Customer: {item.customer}</li>
              <li>Skills&Tools:
                <ul>
                  {item.skill_tool.map(
                    s=>{return (<li>{s}</li>)}
                  )}
                </ul>
              </li>
              <div className="screenshots">
              {item.images.map(
                img=>{
                  const style = {
                    'max-width': 100/item.images.length+'%',
                  };

                  return (
                    <a href={'img/projects/'+img} target='_blank'>
                      <img src={'img/projects/'+img} style={style}  />
                    </a>
                  )
                }
              )}
              </div>

            </ul>
  				</div>
        )
    }

    // <img src={'img/projects/'+img} width={100/item.images.length+'%'}  />

    const getProjectsByJob = []

    // const getProject = Object.keys(props.projectData.projects).map(function(element, key, _array) {

    const getProject = props.projectData.projects.map(function(element, key, _array) {

      return (
        <div>
        <h3>{element.name}</h3>
        <div>
        {element.projects.map(
        (p) => fnProjectFromObj(p)
        )}
        </div>
        </div>
      )
    })

  	return (
  	  <section className="project">
        <h2 className="text-uppercase"><i className="fa fa-lg fa-suitcase"></i> Project</h2>
        {getProject}
      </section>
  	)
};

export default Project;
