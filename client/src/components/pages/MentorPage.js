import React from 'react'
import {
  Row, Col, Card, CardBody, MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal,
} from 'mdbreact';
import MUIDataTable from "mui-datatables";
import DatePickers from './sections/DatePickers'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

// /* Import MUIDataTable using command "npm install mui-datatables --save" */

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

class MentorPage extends React.Component {

  constructor() {
    super();
    this.state = {
      modal: false,
      data: [],
      value: 0,
      mentorList: [],
      isUpdate: false,
      checkValidate: true
    };
  }

  GetMentorList() {
    const options = { month: 'numeric', day: 'numeric' , year: 'numeric' };
    fetch('http://localhost:8080/mentors')
      .then(response => response.json())
      .then(data => {
        let NewData = []
        let cnt = 1
        data.map(row => {
          NewData.push([cnt, row.ID, row.Name, row.PhoneNumber, row.Email, row.Gender ? "Male" : "Female",
          (new Date(row.DoB)).toLocaleDateString('en-US', options),row.Department, row.SupervisorID])
            // format datetime//
          cnt++
          return NewData
        })
        this.setState({
          mentorList: NewData
        })
      });
  }


  componentDidMount() {

    this.GetMentorList()
  }


  toggleMentor = () => {
    this.setState({
      modalMentor: !this.state.modalMentor,
    });
  };



  addMentor = () => {
    this.setState({
      name: "",
      phone: "",
      email: "",
      gender: "",
      dob: "",
      department: "",
      icon: "plus",
      isUpdate: false,
      checkValidate: false
    });
    this.toggleMentor()
  }



  handlerAddMentor = () => {
    // if (this.state.icon === "edit") {
    //   fetch("http://localhost:8080/mentor/" + this.state.id, {
    //     method: 'DELETE',
    //     mode: 'cors'
    //   })
    //     .then(this.GetMentorList())
    //   this.toggleMentor()
    // }
    // console.log(this.state.dob)
    const dt = this.state.dob.split(/-|\s/)
    let date = new Date(dt[2], dt[1], dt[0])
    const data = {
      "Name": this.state.name,
      "PhoneNumber": this.state.phone,
      "Email": this.state.email,
      "Gender": this.state.gender === "Male" ? true : false,
      "Dob": date,
      "Department": this.state.department,
      "SupervisorID": "5c1a11b49ef458a033e70628",
      "IsDeleted": false
    }
    fetch("http://localhost:8080/mentor",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(this.GetMentorList())
    this.toggleMentor()
    // window.location.reload();


  }


  handlerDeleteMentor = () => {
    fetch("http://localhost:8080/mentor/" + this.state.id, {
      method: 'DELETE',
      mode: 'cors'
    })
      .then(this.GetMentorList())
    this.toggleMentor()
    window.location.reload();


  }

  handlerEditMentor = () => {
    const dt = this.state.dob.split(/-|\s/)
    let date = new Date(dt[2], dt[1], dt[0])
    // console.log(this.state.date)

    const data = {
      "Name": this.state.name,
      "PhoneNumber": this.state.phone,
      "Email": this.state.email,
      "Gender": this.state.gender === "Male" ? true : false,
      "Dob": date,
      "Department": this.state.department,
      "SupervisorID": "5c1a11b49ef458a033e70628",
      "IsDeleted": false
    }
    fetch("http://localhost:8080/mentoru/" + this.state.id,{
      method: 'PUT',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(this.GetMentorList())
    this.toggleMentor()
    console.log(this.state.id)

    window.location.reload();

      // this.setState({

      // })
  }

  columnsMentor = [
    {
      name: "#",
      options: {
        filter: false,
        sort: false,
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
        filter: false,
        sort: false,
        // sortDirection: 'asc',
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
      name: "DOB",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "DEPARTMENT",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "SUPERVISOR",
      options: {
        filter: true,
        sort: false,
      }
    },
  ]


  optionsMentor = {
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
    onRowClick: (rowData) => {

      this.setState({
        id: rowData[1],
        name: rowData[2],
        phone: rowData[3],
        email: rowData[4],
        gender: rowData[5],
        dob: rowData[6],
        department: rowData[7],
        icon: "edit",
        isUpdate: true,
        checkValidate: true
      });
      this.toggleMentor()

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
      // console.log(this.state.dob)

        break;
      case "gender":
        this.setState({ gender: value })
        // console.log(this.state.dob)

        break;
      case "dob":
        this.setState({ dob: value })
        console.log(this.state.dob)

        break;
      case "mentor":
        this.setState({ mentor: value })
        break;
      case "department":
        this.setState({ department: value })
        break;
      default:
        break;
    }
  }

  render() {
    this.state.mentorList.map((value, key) => {
      return (<option key={key} value={value[1]}>{value[1]}</option>)
    })
    return (
      <React.Fragment>
        <Row>
          <Col md="12">
            <Card className="mt-5">

              <CardBody>
                <MDBBtn
                  className="mb-3 blue darken-2"
                  onClick={this.addMentor}>
                  Add
                      </MDBBtn>

                <hr></hr>
                <MUIDataTable
                  title={"Mentor List"}
                  data={this.state.mentorList}
                  columns={this.columnsMentor}
                  options={this.optionsMentor} />
              </CardBody>
            </Card>
          </Col>

          {
            // AddMentor, Edit table
          }
          <MDBModal
            isOpen={this.state.modalMentor}
            toggle={this.toggleMentor}
            size="md"
            cascading>

            <MDBModalBody>
              <MDBInput  label="Name" name="name" value={this.state.name} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput  label="Phone" name="phone" value={this.state.phone} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput  label="Email"  name="email" value={this.state.email} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput  label="Gender" name="gender" value={this.state.gender} onChange={this.handleChangeValue.bind(this)} />
              <DatePickers
                label="Dob"
                name="dob"
                value={this.state.dob}
                onChange={this.handleChangeValue.bind(this)}
              />
              {/* <MDBInput fullWidth label="Dob" name="dob" value={this.state.dob} onChange={this.handleChangeValue.bind(this)} /> */}

              <MDBInput  label="Department" name="department" value={this.state.department} onChange={this.handleChangeValue.bind(this)} />
              <div className="text-center mt-1-half">
                {
                  this.state.isUpdate === false &&
                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerAddMentor}
                  >
                    Create
                  <MDBIcon icon="send" className="ml-1" />
                  </MDBBtn>
                }
                {
                  this.state.isUpdate &&


                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerEditMentor}>                    
                    Update
                  <MDBIcon icon="edit" className="ml-1" />
                  </MDBBtn>
                }
                {
                  this.state.isUpdate &&


                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerDeleteMentor}>
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
export default withStyles(styles)(MentorPage);