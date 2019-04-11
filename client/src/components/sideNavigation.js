import React, { Component } from 'react';
import logo from "../assets/mdb-react.png";
import { ListGroup, ListGroupItem, Fa } from 'mdbreact';
import { NavLink } from 'react-router-dom';

class TopNavigation extends Component {
    constructor() {
        super();
        this.state = {
            user : JSON.parse(sessionStorage.getItem('user')),
            isIntern : false,
            courseID : ""
        };
      }
      GetCourseByIntern(){
        fetch('http://localhost:8080/intern/'+this.state.user.ID)
        .then(response => response.json())
            .then(data => {
                this.setState({
                    courseID : data.CourseID
                })
            });
      }
      CheckIntern = ()=> {
          let hihi = this.state.user.Role 
          if( hihi === 1){
            this.setState ({
                isIntern : true
              })
          }
      }
      componentWillMount() {
          
      }
      componentDidMount(){
          this.CheckIntern()
          if( this.state.user.Role === 1) {
              this.GetCourseByIntern()
          }
      }
    render() {
        return (
            <div className="sidebar-fixed position-fixed">
                <a href="#!" className="logo-wrapper waves-effect">
                    <img alt="MDB React Logo" className="img-fluid" src={logo}/>
                </a>
                <ListGroup className="list-group-flush">
                    <NavLink exact={true} to="/mentor" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="user" className="mr-3"/>
                            Mentor
                        </ListGroupItem>
                    </NavLink>
                    <NavLink to="/internship" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="users" className="mr-3"/>
                            Internship
                        </ListGroupItem>
                    </NavLink>
                    {
                        this.state.isIntern === false && 
                        <NavLink to="/courses" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="book" className="mr-3"/>
                            Course
                        </ListGroupItem>
                        </NavLink>
                    }
                    {
                        this.state.isIntern === true && 
                        <NavLink to={`/course/${this.state.courseID}`} activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="book" className="mr-3"/>
                            Course
                        </ListGroupItem>
                        </NavLink>
                    }
                    <NavLink to="/attendance" activeClassName="activeClass">
                        <ListGroupItem>
                            <Fa icon="calendar" className="mr-3"/>
                            Attendence
                        </ListGroupItem>
                    </NavLink>
                </ListGroup>
            </div>
        );
    }
}

export default TopNavigation;