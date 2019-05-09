import React from 'react';
import { ProgressBar } from 'react-bootstrap'
import { MDBCard} from 'mdbreact';
import { InputLabel } from '@material-ui/core';

class CourseCompleted extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      role: props.role,
      id: props.id,
      courses: [],
      showCourseTime: false
   }
   this.getCourses();
 }

 getCourses(){
   if(this.state.role === 1){
    fetch("http://localhost:8080/course/"+this.state.id+"/intern")
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        if(data === undefined){
            this.setState({
                showCourseTime: false
            });
        }
        else{
            var strDate = data.StartDate;
            var startDate = new Date(this.getYear(strDate), this.getMonth(strDate)-1, this.getDay(strDate));
            strDate = data.EndDate;
            var endDate = new Date(this.getYear(strDate), this.getMonth(strDate)-1, this.getDay(strDate));
            var curDay = new Date();
            if(curDay > endDate)
            data.CourseName = data.CourseName + " finished!!!"
            else
            data.CourseName = data.CourseName + " completed: "
            this.setState({
              course: {name: data.CourseName, maxdays: (endDate - startDate) / 86400000, currentDays: Math.floor((curDay - startDate) / 86400000)},
              showCourseTime: true
            });
        }
      });
   }
    else if(this.state.role === 2){
      fetch("http://localhost:8080/courses/" + this.state.id)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        if(data === undefined || data.length === 0){
            this.setState({
                showCourseTime: false
            });
        }
        else{
          var courses = [];
          data.map((value, index) => {
            var strDate = value.StartDate;
            var startDate = new Date(this.getYear(strDate), this.getMonth(strDate)-1, this.getDay(strDate));
            strDate = value.EndDate;
            var endDate = new Date(this.getYear(strDate), this.getMonth(strDate)-1, this.getDay(strDate));
            var curDay = new Date();
            if(curDay > endDate)
             value.CourseName = value.CourseName + " finished!!!"
            else
            value.CourseName = value.CourseName + " completed: "
            courses.push({name: value.CourseName, maxdays: (endDate - startDate) / 86400000, currentDays: Math.floor((curDay - startDate) / 86400000)})
          });
            this.setState({
              courses: courses,
              showCourseTime: true
            });
        }
      });
    }

 }

 getYear(strDate) {
  return parseInt(strDate.substring(0, 4));
 }

 getMonth(strDate) {
    return parseInt(strDate.substring(5, 7));
 }

 getDay(strDate) {
    return parseInt(strDate.substring(8, 10));
 }
 render(){
  return (
    <MDBCard className="mb-5">
          {this.state.showCourseTime ? 
            this.state.role === 2 ?
            this.state.courses.map((data, index) => {
              return <ProgressBar key = {index} variant="success" now={data.currentDays} max= {data.maxdays} label={data.name +" "+ (data.currentDays < data.maxdays ? (Math.round((data.currentDays/data.maxdays) * 100) +"%"):"")}/>;
            })
            : 
            <ProgressBar key = {0} variant="success" now={this.state.course.currentDays} max= {this.state.course.maxdays} label={this.state.course.name +" "+ (this.state.course.currentDays < this.state.course.maxdays ? Math.round((this.state.course.currentDays/this.state.course.maxdays) * 100) +"%" : "")}/>
            :
            <div className="alert alert-danger custom-top">
              Not courses here
            </div>
          }
    </MDBCard>
  )
 }

}

export default CourseCompleted;
