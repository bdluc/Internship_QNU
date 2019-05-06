import React, { Component } from 'react';
import logo from "../assets/mdb-react.png";
import { ListGroup, ListGroupItem, Fa } from 'mdbreact';
import { NavLink } from 'react-router-dom';

class TopNavigation extends Component {
    constructor() {
        super();
      }
    render() {
        return (
            <div className="sidebar-fixed position-fixed">
                <a href="/" className="logo-wrapper waves-effect">
                    <img alt="MDB React Logo" className="img-fluid" src={logo}/>
                </a>
                <ListGroup className="list-group-flush">
                    <NavLink exact={true} to="/mentor" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="user" className="mr-3"/> Mentor
                        </ListGroupItem>
                    </NavLink>
                    <NavLink to="/internship" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="users" className="mr-3"/>Internship
                        </ListGroupItem>
                    </NavLink>
                   
                    <NavLink to="/courses" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="book" className="mr-3"/>Course
                        </ListGroupItem>
                    </NavLink>
                    <NavLink to="/attendance" activeClassName="activeClass">
                        <ListGroupItem>

                            <Fa icon="calendar" className="mr-3"/>Attendence


                        </ListGroupItem>
                    </NavLink>
                </ListGroup>
            </div>
        );
    }
}

export default TopNavigation;