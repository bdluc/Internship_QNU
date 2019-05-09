import React from 'react'

import "react-notifications-component/dist/theme.css";
import CoursePageForMentor from "./sections/CoursePageForMentor";
import CoursePageForIntern from "./sections/CoursePageForIntern";
import CoursePageForSupervisor from "./sections/CoursePageForSupervisor";

// /* Import MUIDataTable using command "npm install mui-datatables --save" */


class CoursePages extends React.Component {

  constructor(props) {
    super(props);   
    this.state = {
        role: JSON.parse(sessionStorage.getItem('user')).Role
    };
  }
    render() {
    if(this.state.role === 3)
        return (
            <CoursePageForSupervisor></CoursePageForSupervisor>
        );
    else if(this.state.role === 2)
        return (
          <CoursePageForMentor></CoursePageForMentor>
        );
    else{
        return (
          <CoursePageForIntern></CoursePageForIntern>
        );
    }
  }
}
export default CoursePages;