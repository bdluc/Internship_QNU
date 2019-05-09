
import React from 'react'
import $ from 'jquery';
import {
  Row, Col, Card, CardBody, MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal,
} from 'mdbreact';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import TextField from '@material-ui/core/TextField';
import MUIDataTable from "mui-datatables";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import './attendance.css';
/* Import MUIDataTable using command "npm install mui-datatables --save" */

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


class Internshipfor extends React.Component {

  constructor() {
    super();
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
    this.state = {
      modal: false,
      data: [],
      value: 0,
      internList: [],
      courseList: [],
      isUpdate: false,
      checkValidate: true,
      CourseName: ''
    };
  }

  addNotification(kind) {
    switch (kind) {
      case "successAdd":
        this.notificationDOMRef.current.addNotification({
          title: "Success",
          message: "Add course successfully !",
          type: "success", //success, danger, default, info, warning or custom
          message: "This is a success message!",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 5000 },
          dismissable: { click: true }
        });
        break;
      case "errorAdd":
        this.notificationDOMRef.current.addNotification({
          title: "Error",
          message: "Email has been duplicated ",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 5000 },
          dismissable: { click: true }
        });
        break;
      case "successUpdate":
        this.notificationDOMRef.current.addNotification({
          title: "Success",
          message: "Update course successfully !",
          type: "success", //success, danger, default, info, warning or custom
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 5000 },
          dismissable: { click: true }
        });
        break;
      case "successDelete":
        this.notificationDOMRef.current.addNotification({
          title: "Success",
          message: "Delete course successfully !",
          type: "success", //success, danger, default, info, warning or custom
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 5000 },
          dismissable: { click: true }
        });
        break;
    }
  }

  GetInternList() {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    fetch('http://localhost:8080/intern')
      .then(response => response.json())
      .then(data => {
        let NewData = []
        let stt = 1
        data.map(row => {
          NewData.push([stt, row.Intern.ID, row.Intern.Name, row.Intern.PhoneNumber, row.Intern.Email, row.Intern.Gender ? "Male" : "Female",
            (new Date(row.Intern.DoB)).toLocaleDateString('en-US', options),
            row.Intern.University, row.Intern.Faculty, row.Course, row.Intern.CourseID,
            // format datetime,
          ])
          stt++
          return NewData,
            console.log(NewData)
        })
        this.setState({
          internList: NewData
        })
        // console.log(data)
      });
  }


  componentDidMount() {

    this.GetInternList()
    this.GetListCourse()
  }


  toggleIntern = () => {
    this.setState({
      modalIntern: /*!this.state.modalIntern,*/false,
    });
  };

  GetListCourse() {
    fetch('http://localhost:8080/courses')
      .then(response => response.json())
      .then(data => {
        let NewData = []
        data.map(row => {
          NewData.push({ ID: row._id, Name: row.CourseName })
          return NewData
        })
        this.setState({
          courseList: NewData,
        })
      });
  }

  handlerEditIntern = () => {
    var moment = require('moment');

    const date = moment.utc(this.state.dob).format();
    const data = {
      "Name": this.state.name,
      "PhoneNumber": this.state.phone,
      "Email": this.state.email,
      "Gender": this.state.gender === "Male" ? true : false,
      "DoB": date,
      "University": this.state.University,
      "Faculty": this.state.Faculty,
      "CourseID": this.state.courseID,
      "IsDeleted": false
    }
    fetch("http://localhost:8080/internu/" + this.state.id, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(this.GetInternList())
    this.toggleIntern()
    this.addNotification("successUpdate")
    // window.location.reload();
  }

  columnsIntern = [
    {
      name: "STT",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "ID",
      options: {
        filter: false,
        sort: true,
        display: "excluded"
      }
    },
    {
      name: "Name",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "Phone",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "Email",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "Gender",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "DOB",
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
      name: "Course",
      options: {
        filter: true,
        sort: false,
      }
    },
  ]


  optionsIntern = {
    filterType: "dropdown",
    responsive: "scroll",
    rowsPerPage: 4,
    rowsPerPageOptions: [5, 5, 5],
    download: false,
    viewColumns: false,
    print: false,
    selectableRows: false,
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
      let std = this.convertDate(rowData[6])
      // let courseid = (rowData[9])
      console.log(rowState.dataIndex, rowState.rowIndex)
      this.setState({

        id: rowData[1],
        name: rowData[2],
        phone: rowData[3],
        email: rowData[4],
        gender: rowData[5],
        dob: std,
        University: rowData[7],
        Faculty: rowData[8],
        course: rowData[9],
        courseID: this.state.internList[rowState.rowIndex][10],
        icon: "edit",
        isUpdate: true,
        checkValidate: true
      });
      this.toggleIntern()
    }
  }

  convertDate(rowData) {
    var moment = require('moment')
    let strDate = ""
    let strMon = ""
    let strYea = ""
    let ye = moment(rowData).get('year');
    let mo = moment(rowData).get('month') + 1;  // 0 to 11
    let da = moment(rowData).get('date');
    if (da < 10)
      strDate = "0" + da
    else
      strDate = '' + da
    if (mo < 10)
      strMon = "0" + mo
    else
      strMon = '' + mo
    if (ye < 1000) {
      strYea = "0" + ye
      if (ye < 100) {
        strYea = "0" + strYea
        if (ye < 10)
          strYea = "0" + strYea
      }
    }
    else
      strYea = '' + ye
    return strYea + "-" + strMon + "-" + strDate
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
        } else if (value.trim().length < 3) {
          this.setState({
            errorName: "Name contains more than 3 characters"
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
        this.setState({ email: value })
        e.target.className = "form-control"
        const regexEmail = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
        if (value.trim().length === 0) {
          this.setState({
            email: " ",
            errorEmail: "Email can not be blank"
          })
          e.target.className += " invalid"
        } else if (!regexEmail.test(value.trim())) {
          this.setState({
            errorEmail: "Not a valid email address"
          })
          e.target.className += " invalid"
        } else {
          e.target.className += " valid"
        }

        break;
      case "gender":
        this.setState({ gender: value })
        break;
      case "course":
        this.setState({ courseID: value })
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

  handleChanges() {
    this.setState({
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <div className="app-content">SS
                  <ReactNotification ref={this.notificationDOMRef} />
                </div>
                <MDBBtn
                  className="mb-3 blue darken-2"
                  onClick={this.addIntern}>
                  Add
                </MDBBtn>

                <hr></hr>
                <MUIDataTable
                  title={"List Intern"}
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

            <MDBModalBody >
              <MDBInput fullwidth="true" size="" label="Name" name="name" value={this.state.name} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput fullwidth="true" label="Phone" name="phone" value={this.state.phone} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput fullwidth="true" label="Email" iconClass="dark-grey" name="email" value={this.state.email} onChange={this.handleChangeValue.bind(this)} />
              <FormControl fullWidth>
                <InputLabel htmlFor="select-multiple">Gender</InputLabel>
                <Select  label="Gender" name="gender" value={this.state.gender} onChange={this.handleChangeValue.bind(this)}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl ><br />
              <FormControl fullWidth>
                <InputLabel htmlFor="select-multiple">Course</InputLabel>
                <FormControl fullWidth>
    
                                    <MDBInput label="Course" name="course" htmlFor="select-multiple" value={this.state.course} display='false' />
    
                                </FormControl>
              </FormControl>

              <MDBInput
                label="Dob" name="dob" id="date" type="date"
                value={this.state.dob}
                onChange={this.handleChangeValue.bind(this)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField fullWidth label="University" name="text" name="University" value={this.state.University} onChange={this.handleChangeValue.bind(this)} />
              <div className="text-center mt-1-half">
                <TextField fullWidth label="Faculty" name="text" name="Faculty" value={this.state.Faculty} onChange={this.handleChangeValue.bind(this)} />
                <div className="text-center mt-1-half">
                  
                  {
                    this.state.isUpdate &&
                    <MDBBtn
                      className="mb-2 blue darken-2"
                      onClick={this.handlerEditIntern}>
                      Update
                  <MDBIcon icon="edit" className="ml-1" />
                    </MDBBtn>
                  }
                </div>
              </div>
            </MDBModalBody>
          </MDBModal>
        </Row>
      </React.Fragment>
    )
  }
}
export default withStyles(styles)(Internshipfor);