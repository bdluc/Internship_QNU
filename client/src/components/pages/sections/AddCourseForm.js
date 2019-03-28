import React, { Component } from 'react';
import DatePicker from 'react-datepicker'
import { FormErrors } from './FormErrors';
// import AddMentor from './AddMentor';
// import './Form.css';

class AddMentorForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      courseName: '',
      startDate: Date,
      endDate: Date,
      detail : [],
      mentor : [],
      isDeleted : false,
      formErrors: {startDate: '', endDate: '',},
      endDateValid: false,
      startDateValid: false,
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
    let startDateValid = this.state.startDateValid;
    let endDateValid = this.state.endDateValid;

    switch(fieldName) {
      case 'startDate':
        startDateValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.startDate = startDateValid ? '' : ' is invalid';
        break;
      case 'endDate':
        endDateValid = value.length >= 6;
        fieldValidationErrors.endDate = endDateValid ? '': ' is too short';
        break;
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                    startDateValid: startDateValid,
                    endDateValid: endDateValid
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.startDateValid && this.state.endDateValid});
  }

  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  render () {
    return (
      <form className="demoForm">
        <h2>Sign up</h2>
        <div className="panel panel-default">
          <FormErrors formErrors={this.state.formErrors} />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
          <label htmlFor="email">Email address</label>
          <input type="email" required className="form-control" name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleUserInput}  />
        </div>
        <div className={`form-group ${this.errorClass(this.state.formErrors.password)}`}>
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleUserInput}  />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!this.state.formValid}>Add</button>

        <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
        />

        <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
        />
      </form>
    )
  }
}

export default AddMentorForm;