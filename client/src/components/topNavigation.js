import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdbreact';

// import Fab from '@material-ui/core/Fab';
import { NavLink } from 'react-router-dom';
import { ListGroupItem, Fa } from 'mdbreact';



class TopNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            info : props.user
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
                            <MDBDropdownItem>Infor</MDBDropdownItem>
                            <MDBDropdownItem>Change password</MDBDropdownItem>
                            <MDBDropdownItem>About</MDBDropdownItem>
                            <MDBDropdownItem divider />
                            <MDBDropdownItem onClick = {this.logOut.bind(this)}>Logout</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        );
    }
}

export default TopNavigation;