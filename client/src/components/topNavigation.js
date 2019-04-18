import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdbreact';
import { MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal} from 'mdbreact';
// import Fab from '@material-ui/core/Fab';
import { NavLink } from 'react-router-dom';
import { ListGroupItem, Fa } from 'mdbreact';



class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            name: props.name,
            oldPassword: "",
            password:"",
            confirmPassword:"",
            showMoDal: false,
            showError: false,
            error: "",
            success: "",
            showSuccess: false
        };
    this.onClick = this.onClick.bind(this);
    this.toggle = this.toggle.bind(this);
}
    logOut(event){
        this.props.onLogout();
    }

    onClick(){
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    toggleChangePassword(){  
        this.setState({
            showMoDal : !this.state.showMoDal,
            showSuccess: false,
            showError: false
        })

    }

    handleOldPasswordChange(e){
        this.setState({oldPassword: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleConfirmPasswordChange(e) {
        this.setState({confirmPassword: e.target.value});
    }

    handleClick(){
        if(this.state.password !== this.state.confirmPassword)
        this.setState({
            error: "Password is not match!",
            showError: true,
            showSuccess: false
            
        })
        else{
            fetch('http://localhost:8080/login',
                {
                    method: "PUT",
                    headers:{
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"UserName": this.state.name, "Password": this.state.oldPassword})
                })
                .then(response => 
                response.json()
                )
                .then(data => {
                if (data.ID === undefined) {
                    this.setState({
                        error: "Current password is not correct",
                        showError: true,
                        showSuccess: false
                        });
                }
                else {
                    data.Password = this.state.password;
                    fetch('http://localhost:8080/user',
                    {
                        method: "PUT",
                        headers:{
                        "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    }).then(response => 
                        response.json()
                    ).then((data) =>{
                        if(data.message === "Update successful"){
                            this.setState({
                                success: data.message,
                                showError: false,
                                showSuccess: true
                            })
                        }
                        else
                            this.setState({
                                error:"Could not update password! ",
                                showError: true,
                                showSuccess: false
                            })

                    })
                }
                });     
        }   
    }
    
    render() {
        return (
            <Navbar className="flexible-navbar" light expand="md" scrolling>
                <NavbarBrand href="/">
                    <strong>Internship Management</strong>
                </NavbarBrand>
                <NavbarToggler onClick = { this.onClick } />
                <Collapse isOpen = { this.state.collapse } navbar>
                    <NavbarNav left>
                        
                    </NavbarNav>
                    <NavbarNav right>
                    
                    {/* <Fab href="/mentor" activeClassName="activeClass" variant="extended" >
                    <MDBIcon icon="sign-in-alt" />                                                              Login
                    </Fab>

                    <NavLink  to="/login" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="user" className="mr-3"/>
                            Login
                        </ListGroupItem>
                    </NavLink> */}
                    <MDBDropdown>
                        <MDBDropdownToggle caret color="info">
                            {this.props.name}
                        </MDBDropdownToggle>
                        <MDBDropdownMenu color="info" basic>
                            <MDBDropdownItem href="/editinfor">Infor</MDBDropdownItem>
                            <MDBDropdownItem onClick = {this.toggleChangePassword.bind(this)}>Change password</MDBDropdownItem>
                            <MDBDropdownItem>About</MDBDropdownItem>
                            <MDBDropdownItem divider />
                            <MDBDropdownItem onClick = {this.logOut.bind(this)}>Logout</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                    </NavbarNav>
                </Collapse>
                <MDBModal
                    isOpen={this.state.showMoDal}
                    toggle={this.toggleChangePassword.bind(this)}
                    size="md"
                    cascading>

                    <MDBModalBody>
                    <div className="grey-text">
                        <MDBInput
                        label="Type your password"
                        icon="lock"
                        group
                        type="password"
                        onChange = {this.handleOldPasswordChange.bind(this)}
                        />
                        <MDBInput
                        label="Type new password"
                        icon="lock"
                        group
                        type="password"
                        onChange = {this.handlePasswordChange.bind(this)}
                        />
                        <MDBInput
                        label="Comfirm password"
                        icon="lock"
                        group
                        type="password"
                        onChange = {this.handleConfirmPasswordChange.bind(this)}
                        />
                    </div>
                    {this.state.showError ?
                        <div className="alert alert-danger custom-top">
                            {this.state.error}
                        </div> : null}
                    <div className="text-center mt-4">
                        <MDBBtn
                        color="light-blue"
                        className="mb-3"
                        type="submit"
                        onClick = {this.handleClick.bind(this)}
                        >
                            Change Password
                    </MDBBtn>
                  </div>
                    </MDBModalBody>
                </MDBModal>
            </Navbar>
        );
    }
}

export default TopNavigation;