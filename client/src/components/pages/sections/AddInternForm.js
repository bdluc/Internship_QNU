import React, { Component } from 'react';
import { FormErrors } from './FormErrors';
// import AddMentor from './AddMentor';
// import './Form.css';

class AddInternForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      formErrors: {email: '', password: ''},
      emailValid: false,
      passwordValid: false,
      formValid: false
    }
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value},
                  () => { this.validateField(name, value) });
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
    return(error.length === 0 ? '' : 'has-error');
  }

  render () {
    return (
      <form className="demoForm">
        {/* <h2>Sign up</h2> */}
        <div className="panel panel-default">
          <FormErrors formErrors={this.state.formErrors} />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
          <label htmlFor="Name">User Name</label>
          <input type="Name" required className="form-control" name="Name"
            placeholder="UserName......"
            value={this.state.name}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
          <label htmlFor="PhoneNumber">Phone Number</label>
          <input type="PhoneNumber" required className="form-control" name="PhoneNumber"
            placeholder="0123456789"
            value={this.state.PhoneNumber}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
          <label htmlFor="email">Email address</label>
          <input type="email" required className="form-control" name="email"
            placeholder="Email@gmail.com"
            value={this.state.email}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
          <label htmlFor="Gender">Gender</label>
          <input type="Gender" required className="form-control" name="Gender"
            placeholder="true: Male or false: Female"
            value={this.state.Gender}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
          <label htmlFor="DayofBirth">Day of Birth</label>
          <input type="DayofBirth" required className="form-control" name="DayofBirth"
            placeholder="2000-01-01T00:00:00+07:00"
            value={this.state.DayofBirth}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
          <label htmlFor="University">University</label>
          <input type="University" className="form-control" name="University"
            placeholder="Quy Nhon"
            value={this.state.University}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
          <label htmlFor="Faculty">Faculty</label>
          <input type="Faculty" className="form-control" name="Faculty"
            placeholder="IT"
            value={this.state.Faculty}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
          <label htmlFor="CourseID">Course ID</label>
          <input type="CourseID" className="form-control" name="CourseID"
            placeholder="false"
            disabled
            value={this.state.CourseID}
            onChange={this.handleUserInput}  />
        </div>

        <button type="submit" className="btn btn-primary" disabled={!this.state.formValid}>Add</button>
      </form>
    )
  }
}

export default AddInternForm;