import React, { Component } from 'react';
import logo from "../assets/mdb-react.png";
import { ListGroup, ListGroupItem, Fa } from 'mdbreact';
import { NavLink } from 'react-router-dom';

class TopNavigation extends Component {


    render() {
        return (
            <div className="sidebar-fixed position-fixed">
                <a href="#!" className="logo-wrapper waves-effect">
                    <img alt="MDB React Logo" className="img-fluid" src={logo}/>
                </a>
                <ListGroup className="list-group-flush">
                    <NavLink to="/mentor" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="user" className="mr-3"/>
                            Mentor
                        </ListGroupItem>
                    </NavLink>
                    <NavLink to="/intern" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="users" className="mr-3"/>
                            Internship
                        </ListGroupItem>
                    </NavLink>
                    <NavLink to="/cource" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="graduation-cap" className="mr-3"/>
                            Course
                        </ListGroupItem>
                    </NavLink>
                    <NavLink to="/attendence" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="calendar" className="mr-3"/>
                            Attendance
                        </ListGroupItem>
                    </NavLink>
                </ListGroup>
            </div>
        );
    }
}

export default TopNavigation;