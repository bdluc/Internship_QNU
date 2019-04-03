import React, { Component } from 'react';
import { FormErrors } from './FormErrors';

class EditInternForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      formErrors: {email: '', password: ''},
      emailValid: false,
      passwordValid: false,
      formValid: false,
      Name : '',
      PhoneNumber : '',
      Gender : '',
      DayofBirth : '',
      University : '',
      Faculty : '',
      CourseID : false
    }
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name] : value
    }, () => console.log(this.state)
    )
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch(fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? '' : ' is invalid';
        break;
      case 'password':
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid ? '': ' is too short';
        break;
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                    emailValid: emailValid,
                    passwordValid: passwordValid
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.emailValid && this.state.passwordValid});
  }

  errorClass(error) {
    console.log(error)
    //  return(error.length === 0 ? '' : 'has-error');
  }
  onSubmit = (e) =>{
    e.preventDefault();
    var intern = {
      "Name": this.state.Name,
      "PhoneNumber": this.state.PhoneNumber,
      "Email": this.state.email,
      "Gender": this.state.Gender === 'true' ? true : false,
      "DayofBirth": this.state.DayofBirth,
      "University": this.state.University,
      "Faculty": this.state.Faculty,
      "CourseID": "5c9b53dbda51e308e86b2243",
      "IsDeleted": false
  }
    console.log(intern);
    
    fetch("http://localhost:8080/intern",
    {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(intern)
    })
    .then(rs => console.log(rs)
    )

  }

  render () {
    return (
      <form className="demoForm" onSubmit = {this.onSubmit}>
        {/* <h2>Sign up</h2> */}
        <div className="panel panel-default">
          <FormErrors formErrors={this.state.formErrors} />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.Name)}`}>
          <label htmlFor="Name">User Name</label>
          <input type="Name" required className="form-control" name="Name"
            placeholder="UserName......"
            value={this.state.Name}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.PhoneNumber)}`}>
          <label htmlFor="PhoneNumber">Phone Number</label>
          <input type="number" required className="form-control" name="PhoneNumber"
            placeholder="0123456789"
            value={this.state.PhoneNumber}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
          <label htmlFor="email">Email address</label>
          <input type="email" required className="form-control" name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.Gender)}`}>
          <label htmlFor="Gender">Gender</label>
          <input type="boll" required className="form-control" name="Gender"
            placeholder="True or False"
            value={this.state.Gender}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.DayofBirth)}`}>
          <label htmlFor="DayofBirth">Day of Birth</label>
          <input type="date" required className="form-control" value={this.state.DayofBirth} onChange={this.handleChangeStart} name="DayofBirth"
            placeholder="01/01/2000"
            value={this.state.DayofBirth}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.University)}`}>
          <label htmlFor="University">University</label>
          <input type="text" className="form-control" name="University"
            placeholder="Quy Nhon"
            value={this.state.University}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.Faculty)}`}>
          <label htmlFor="Faculty">Faculty</label>
          <input type="text" className="form-control" name="Faculty"
            placeholder="IT"
            value={this.state.Faculty}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.CourseID)}`}>
          <label htmlFor="CourseID">Course ID</label>
          <input type="boll" className="form-control" name="CourseID"
            placeholder="false"
            disabled
            value={this.state.CourseID}
            onChange={this.handleUserInput}  />
        </div>

        <button type="submit" className="btn btn-primary" >Add</button>
      </form>
    )
  }
}

export default EditInternForm;