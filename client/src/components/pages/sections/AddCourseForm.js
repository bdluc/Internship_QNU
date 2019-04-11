import React, { Component } from 'react';
import { FormErrors } from './FormErrors';
// import XLSX from 'xlsx';
// import './Form.css';
// import "react-datepicker/dist/react-datepicker.css";
class AddCourseForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      courseName: '',
      startDate: '',
      endDate: '',
      mentors : [],
      detail : [],
      scheduleContent: "",

      formErrors: {courseName: '', startDate: '',endDate: ''},
      courseNameValid: false,
      startDateValid: false,
      endDateValid: false,
      mentorValid: false,
      formValid: false,
    }
  }
  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value},
                  () => { this.validateField(name, value) });
                  console.log(this.state)
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let courseNameValid = this.state.courseNameValid;
    let startDateValid = this.state.startDateValid;
    let endDateValid = this.state.endDateValid;

    var constDate = new Date('2016/1/1');
    var standard = constDate.getTime();
    switch(fieldName) {
      
      case 'courseName':
        courseNameValid = value.length >= 6;
        fieldValidationErrors.courseName = courseNameValid ? '' : ' is too short';
        break;
      case 'startDate':
        var sdNumber = new Date(new Date(value).toLocaleString()).getTime();
        var cp = sdNumber - standard ;

        if(cp <= 0)
          startDateValid = false;
        else {
          startDateValid = true ;
          console.log(startDateValid);
        }
        fieldValidationErrors.startDate = startDateValid ? '': ' must be after 1/1/2016';

        var edNumber2 = new Date(new Date(this.state.endDate).toLocaleString()).getTime();
        var nurse = edNumber2 - sdNumber ;
        if(nurse > 0) {
          endDateValid = true
          fieldValidationErrors.endDate = '';
        }else {
          endDateValid = false 
          fieldValidationErrors.endDate = ' is after start date';
        }
         
        break;
      case 'endDate':
        // var date = new Date(). getDate(); //Current Date.
        // var month = new Date(). getMonth() + 1; //Current Month.
        // var year = new Date(). getFullYear(); //Current Year.
        // var age = Math.floor((new Date() - new Date(e.target.dob.value)) / 1000 / 60 / 60 / 24 / 365.25)
        var edNumber = new Date(new Date(value).toLocaleString()).getTime();
        var sdNumber2 = new Date(new Date(this.state.startDate).toLocaleString()).getTime();
        var hieu = edNumber -  sdNumber2;
        if (hieu <= 0)
          endDateValid = false;
        else {
            endDateValid = true ;
            console.log(endDateValid)  
        }
        fieldValidationErrors.endDate = endDateValid ? '': ' is after start date';
        break;
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                    courseNameValid: courseNameValid,
                    startDateValid: startDateValid,
                    endDateValid : endDateValid,
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.courseNameValid && this.state.startDateValid && this.state.endDateValid});
  }

  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  ListMentor(){
    fetch('http://localhost:8080/mentors')
      .then(response => response.json())
        .then(result => {
            console.log(result);
            
          let mentorlist = []
          result.map(row => {
            return mentorlist.push({ID : row.ID, Name : row.Name , isChecked : false})
          })
          this.setState({
            mentors : mentorlist
        },() => console.log(this.state.mentors)
        )
    });
  }

  componentDidMount() {
    this.ListMentor();
  }

  handleCheckChieldElement = (event) => {
    let mentors = this.state.mentors
    mentors.forEach(mentor => {
      if (mentor.ID === event.target.value)
          mentor.isChecked =  event.target.checked
    })
    this.setState({mentors: mentors})
    console.log(this.state.mentors)
  }

  addCourse(){
    const std = this.state.startDate.split(/-|\s/)
    const ed = this.state.endDate.split(/-|\s/)
    let datestart = new Date(std[2], std[1], std[0])
    let dateend = new Date(ed[2], ed[1], ed[0])
    let mentorlist = []

    this.state.mentors.forEach(row => {
        if(row.isChecked){
          return mentorlist.push(row.ID);
        }
    })
     const data = {
      "CourseName" : this.state.courseName,
      "StartDate" : datestart,
      "EndDate" : dateend,
      "MentorID" : mentorlist,
      "IsDeleted" : false
    }
    fetch('http://localhost:8080/course',
        {
            method: "POST",
            mode: "no-cors",
            headers:{
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
  }

  render () {
    return (
      <form className="demoForm">
        <h2>Create Course</h2>
        <div className="panel panel-default">
          <FormErrors formErrors={this.state.formErrors} />
        </div>

        <div className={`form-group ${this.errorClass(this.state.formErrors.courseName)}`}>
        <label htmlFor="courseName">Course Name</label>
          <input type="text" className="form-control" name="courseName" value={this.state.courseName} 
          onChange={this.handleUserInput} />
        </div>

        <div  className={`form-group ${this.errorClass(this.state.formErrors.startDate)}`}>
        <label htmlFor="startDate">Start Date</label>
          <input type="date" className="form-control" name="startDate" value={this.state.startDate}  onChange={this.handleUserInput}/>
        </div>

        <div  className={`form-group ${this.errorClass(this.state.formErrors.endDate)}`}>
        <label htmlFor="endDate">End Date</label>
          <input type="date" className="form-control" name="endDate" value={this.state.endDate} onChange={this.handleUserInput}/>
        </div>
        
        <div className="App">
        <label htmlFor="mentor">Mentor</label><br/>
          <ul>
          {
            this.state.mentors.map((mentor,index) => {
              return (
                  <div key={index}>
                  <input type="checkbox" name="mentors" value={mentor.ID} onChange={this.handleCheckChieldElement}/>
                  <span>{mentor.Name}</span>
                  </div>
              )
            })
          }
          </ul>
        </div>

        <div  className={`form-group ${this.errorClass(this.state.formErrors.endDate)}`}>
        <label htmlFor="file">Detail Course</label>
        </div>

         <button type="submit" className="btn btn-primary" disabled={!this.state.formValid} onClick={()=>{this.addCourse()}}>Add</button>
      </form>
    )
  }
}

export default AddCourseForm;