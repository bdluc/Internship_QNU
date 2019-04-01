// import React from 'react'
import { Row, Col, Card, CardBody, Table, TableHead, TableBody } from 'mdbreact';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import AddIntern from './sections/AddIntern';
import React, { Component } from 'react';
import PickCoure from './sections/PickCoure';

class InternshipPage extends Component {
  constructor() {
    super();
    this.state = {
      Intern: []
    };
  }

  componentDidMount() {

    fetch('http://localhost:8080/intern')
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.setState({
          Intern: result
        });
      })
  }

  addintern = () => {
    this.setState({
      name : "",
      phone : "",
      email : "",
      gender : "",
      dob : "",
      University : "",
      Faculty: "",
      title : "ADD NEW INTERN",
      icon : "plus",
      isUpdate : false,
      checkValidate : false,
    });
    this.toggleIntern()
  }
  
  handlerAddIntern = () => {
    if (this.state.icon === "edit") {
      this.toggleIntern()
    } else {
        const dt  = this.state.dob.split(/-|\s/)
        let date = new Date(dt[2], dt[1], dt[0])
        const data = {
          "Name" : this.state.name,
          "PhoneNumber" : this.state.phone,
          "Email" : this.state.email,
          "Gender" : this.state.gender === "Male"?true:false,
          "DoB" : date,
          "University" : this.state.university,
          "Faculty": this.state.Faculty,
          "SupervisorID" : "5c9b53dbda51e308e86b2243",
          "IsDeleted" : false 
        }     
        fetch("http://localhost:8080/intern",
            {
                method: "POST",
                mode: "no-cors",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(this.GetInternList())
        this.toggleIntern()
    }
  }

  render() {
    const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return (
      <div>
        <React.Fragment>
          <Row>
            <Col md="12">
              <Card className="mt-5">

                <CardBody>
                  <tr>
                    <td><AddIntern></AddIntern></td>
                    <td><PickCoure></PickCoure></td>
                  </tr>
                  <hr></hr>
                  <Table>

                    <TableHead color="primary-color" textWhite>

                      <tr>
                        <th>STT</th>
                        <th>Name</th>
                        <th>DayofBirth</th>
                        <th>Email</th>
                        <th>University</th>
                        <th>Faculty</th>
                        <th>PhoneNumber</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </TableHead>
                 
                    <TableBody>
                      {this.state.Intern.map((item, index) =>
                        (
                          <tr key={index}>
                            <th>{index}</th>
                            <th>{item.Name}</th>
                            <th>{(new Date(item.DoB)).toLocaleDateString('en-US', DATE_OPTIONS)}</th>
                            <th>{item.Email}</th>
                            <th>{item.University}</th>
                            <th>{item.Faculty}</th>
                            <th>{item.PhoneNumber}</th>
                            <th><Fab color="primary" size="small" aria-label="Edit"><CreateIcon /></Fab></th>
                            <th><Fab size="small" href="#" ><DeleteIcon /></Fab></th>
                          </tr>
                        )
                      )}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </React.Fragment>
      </div>
    )
  }
}

export default InternshipPage;

/*



import React from 'react'
import {
  Row, Col, Card, CardBody, MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal,
} from 'mdbreact';
import TextField from '@material-ui/core/TextField';
import MUIDataTable from "mui-datatables";
import DatePickers from './sections/DatePickers'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

/* Import MUIDataTable using command "npm install mui-datatables --save" */
/*
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  main: {
    backgroundColor: "#007bff",
  }
});

class InternPage extends React.Component {

  constructor() {
    super();
    this.state = {
      modal: false,
      data: [],
      value: 0,
      internList: [],
      isUpdate: false,
      checkValidate: true
    };
  }

  GetInternList() {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    fetch('http://localhost:8080/intern')
      .then(response => response.json())
      .then(data => {
        let NewData = []
        let cnt = 1
        data.map(row => {
          NewData.push([cnt, row.ID, row.Name, row.PhoneNumber, row.Email, row.Gender, row.University, row.Faculty ? "Male" : "Female",
            // format datetime
            (new Date(row.DoB)).toLocaleDateString('en-US', options),
            row.Department, row.SupervisorID])
          cnt++
          return NewData
        })
        this.setState({
          internList: NewData
        })
      });
  }

  handleChangeTab = (event, value) => {
    this.setState({ value });
  };

  componentDidMount() {

    this.GetInternList()
  }


  toggleIntern = () => {
    this.setState({
      modalIntern: !this.state.modalIntern,
    });
  };



  addIntern = () => {
    this.setState({
      name: "",
      phone: "",
      email: "",
      gender: "",
      dob: "",
      University: "",
      Faculty: "",
      title: "ADD NEW MENTOR",
      icon: "plus",
      isUpdate: false,
      checkValidate: false
    });
    this.toggleIntern()
  }



  handlerAddIntern = () => {
    if (this.state.icon === "edit") {
      fetch("http://localhost:8080/intern/" + this.state.id, {
        method: 'DELETE',
        mode: 'cors'
      })
        .then(this.GetInternList())
      this.toggleIntern()
    }
    const dt = this.state.dob.split(/-|\s/)
    let date = new Date(dt[2], dt[1], dt[0])
    const data = {
      "Name": this.state.name,
      "PhoneNumber": this.state.phone,
      "Email": this.state.email,
      "Gender": this.state.gender === "Male" ? true : false,
      "DoB": date,
      "University": this.state.University,
      "Faculty": this.state.Faculty,
      "SupervisorID": "5c9b53dbda51e308e86b2243",
      "IsDeleted": false
    }
    fetch("http://localhost:8080/intern",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(this.GetInternList())
    this.toggleIntern()


  }



  handlerDeleteIntern = () => {
    fetch("http://localhost:8080/intern/" + this.state.id, {
      method: 'DELETE',
      mode: 'cors'
    })
      .then(this.GetInternList())
    this.toggleIntern()
  }

  columnsIntern = [
    {
      name: "#",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "ID",
      options: {
        filter: false,
        sort: false,
        display: "excluded"
      }
    },
    {
      name: "NAME",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "PHONE",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "EMAIL",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "GENDER",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "DAY OF BIRTH",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "University",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "Faculty",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "CourseID",
      options: {
        filter: true,
        sort: false,
      }
    },
  ]


  optionsIntern = {
    filterType: "dropdown",
    responsive: "scroll",
    download : false,
    print : false,
    selectableRows : false,
    textLabels: {
      body: {
        noMatch: "Sorry, no matching records found",
        toolTip: "Sort",
      },
      pagination: {
        next: "Next Page",
        previous: "Previous Page",
        rowsPerPage: "Rows per page:",
        displayRows: "of",
      },
      toolbar: {
        search: "Search",
        downloadCsv: "Download CSV",
        print: "Print",
        viewColumns: "View Columns",
        filterTable: "Filter Table",
      },
      filter: {
        all: "All",
        title: "FILTERS",
        reset: "RESET",
      },
      viewColumns: {
        title: "Show Columns",
        titleAria: "Show/Hide Table Columns",
      },
      selectedRows: {
        text: "rows(s) selected",
        delete: "Delete",
        deleteAria: "Delete Selected Rows",
      },
    },
    onRowClick: (rowData, rowState) => {
      this.setState({
        id: rowData[1],
        name: rowData[2],
        phone: rowData[3],
        email: rowData[4],
        gender: rowData[5],
        dob: rowData[6],
        University: rowData[7],
        Faculty: rowData[8],
        icon: "edit",
        isUpdate: true,
        checkValidate: true
      });
      this.toggleIntern()
    }
  }

  checkValidate() {

    return false;
  }

  handleChangeValue(e) {
    const { name, value } = e.target;
    e.target.className = "form-control"
    switch (name) {
      case "name":
        this.setState({ name: value })
        if (value.trim().length === 0) {
          this.setState({
            name: " ",
            errorName: "Name can not be blank"
          })
          e.target.className += " invalid"
        } else if (value.trim().length < 6) {
          this.setState({
            errorName: "Name contains more than 5 characters"
          })
          e.target.className += " invalid"
        } else {
          e.target.className += " valid"
        }
        break;
      case "phone":
        this.setState({ phone: value })
        e.target.className = "form-control"
        const regexPhone = /^[0-9\b]+$/
        if (value.trim().length === 0) {
          this.setState({
            phone: " ",
            errorPhone: "Phone can not be blank"
          })
          e.target.className += " invalid"
        } else if (!regexPhone.test(value.trim())) {
          this.setState({
            errorPhone: "Phone contains only numeric characters"
          })
          e.target.className += " invalid"
        } else {
          e.target.className += " valid"
        }
        break;
      case "email":
      this.setState({ email: value})
      e.target.className="form-control"
      const regexEmail = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
      if(value.trim().length === 0){
        this.setState({
          email: " ",
          errorEmail:"Email can not be blank"
        })
        e.target.className += " invalid"
      } else if (!regexEmail.test(value.trim())){
        this.setState({
          errorEmail: "Not a valid email address"
        })
        e.target.className +=" invalid"
      } else {
        e.target.className +=" valid"
      }
       
        break;
      case "gender":
        this.setState({ gender: value })
        break;
      case "dob":
        this.setState({ dob: value })
        break;
      case "intern":
        this.setState({ intern: value })
        break;
      case "University":
        this.setState({ University: value })
        break;
      case "Faculty":
        this.setState({ Faculty: value })
        break;
      default:
        break;
    }
  }

  render() {
    // this.state.InternList.map((value, key) => {
    //   return (<option key={key} value={value[1]}>{value[1]}</option>)
    // })
    return (
      <React.Fragment>
        <Row>
          <Col md="12">
            <Card className="mt-5">

              <CardBody>
                <MDBBtn
                  className="mb-3 blue darken-2"
                  onClick={this.addIntern}>
                  Add
                      </MDBBtn>

                <hr></hr>
                <MUIDataTable
                  title={"Intern List"}
                  data={this.state.internList}
                  columns={this.columnsIntern}
                  options={this.optionsIntern} />
              </CardBody>
            </Card>
          </Col>

          {
            // AddIntern, Edit table
          }
          <MDBModal
            isOpen={this.state.modalIntern}
            toggle={this.toggleIntern}
            size="md"
            cascading>

            <MDBModalBody>
              <MDBInput fullWidth size="" label="Name" name="name" value={this.state.name} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput fullWidth label="Phone" name="phone" value={this.state.phone} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput fullWidth label="Email" iconClass="dark-grey" name="email" value={this.state.email} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput label="Gender" name="gender" value={this.state.gender} onChange={this.handleChangeValue.bind(this)} />
              <DatePickers
                label="Day of Birth"
                name="dob"
                value={this.state.dob}
                onChange={this.handleChangeValue.bind(this)}
              />
              <TextField label="University" name="text" name="University" value={this.state.University} onChange={this.handleChangeValue.bind(this)} />
              <div className="text-center mt-1-half">
              <TextField label="Faculty" name="text" name="Faculty" value={this.state.Faculty} onChange={this.handleChangeValue.bind(this)} />
              <div className="text-center mt-1-half"></div>
                {
                  this.state.isUpdate === false &&
                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerAddIntern}
                  >
                    Create
                  <MDBIcon icon="send" className="ml-1" />
                  </MDBBtn>
                }
                {
                  this.state.isUpdate &&


                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerAddIntern}>
                    Update
                  <MDBIcon icon="edit" className="ml-1" />
                  </MDBBtn>
                }
                {
                  this.state.isUpdate &&


                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerDeleteIntern}>
                    Delete
                  <MDBIcon icon="trash" className="ml-1" />
                  </MDBBtn>
                }
              </div>
            </MDBModalBody>
          </MDBModal>
        </Row>


      </React.Fragment>

    )

  }
}
export default withStyles(styles)(InternPage);
*/