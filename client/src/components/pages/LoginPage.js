import React, { Component } from 'react';
import {SERVER_NAME} from "../../Constants"
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBModalFooter,
  MDBIcon,
  MDBCardHeader,
  MDBBtn,
  MDBInput
} from "mdbreact";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username : "",
      password : "",
      showError: false
    }
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }
  handlePasswordChange(e) {
      this.setState({password: e.target.value});
  }

  handleClick(event) {
    event.preventDefault();
    fetch(SERVER_NAME + 'login',
            {
                method: "PUT",
                headers:{
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({"UserName": this.state.username, "Password": this.state.password})
            })
            .then(response => 
              response.json()
            )
            .then(data => {
              if (data.ID !== undefined) {
                sessionStorage.setItem("user", JSON.stringify(data));
                this.props.onLogin(data);
              }
              else {
                this.setState({
                  showError: true
                });
              }
            });         
  }
  render() {
    return (
      <MDBContainer>
        <MDBRow> 
          <MDBCol md="6">
            <MDBCard>
              <MDBCardBody>
                <MDBCardHeader className="form-header deep-blue-gradient rounded">
                  <h3 className="my-3">
                    <MDBIcon icon="lock" /> Login:
                  </h3>
                </MDBCardHeader>
                <form>
                  <div className="grey-text">
                    <MDBInput
                      label="Type your username"
                      icon="envelope"
                      group
                      onChange = {this.handleUsernameChange.bind(this)}
                    />
                    <MDBInput
                      label="Type your password"
                      icon="lock"
                      group
                      type="password"
                      onChange = {this.handlePasswordChange.bind(this)}
                    />
                  </div>
                  {this.state.showError ?
                <div className="alert alert-danger custom-top">
                    "Username or Password is not correct!"
                </div> : null}
                <div className="text-center mt-4">
                  <MDBBtn
                    color="light-blue"
                    className="mb-3"
                    type="submit"
                    onClick = {this.handleClick.bind(this)}
                  >
                    Login
                  </MDBBtn>
                </div>
                </form>
                <MDBModalFooter>
                  <div className="font-weight-light">
                    <p>Forgot Password?</p>
                  </div>
                </MDBModalFooter>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default Login;
