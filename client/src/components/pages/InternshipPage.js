
import React from 'react'
import {
  Row, Col, Card, CardBody, MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal,
} from 'mdbreact';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import TextField from '@material-ui/core/TextField';
import MUIDataTable from "mui-datatables";
import DatePickers from './sections/DatePickers'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
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


class InternPage extends React.Component {

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
      courseName: ''
    };
  }
  addNotification(kind) {
    switch(kind) {
      case "successAdd" : 
      this.notificationDOMRef.current.addNotification({
        title: "Success",
        message: "Add course successfully !",
        type: "success", //success, danger, default, info, warning or custom
        message : "This is a success message!",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 2000 },
        dismissable: { click: true }
      });
      break;
      case "errorAdd" :
      this.notificationDOMRef.current.addNotification({
        title: "Error",
        message: "Add course fail",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 2000 },
        dismissable: { click: true }
      });
      break;
      case "successUpdate" : 
      this.notificationDOMRef.current.addNotification({
        title: "Success",
        message: "Update course successfully !",
        type: "success", //success, danger, default, info, warning or custom
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 2000 },
        dismissable: { click: true }
      });
      break;
      case "successDelete" : 
      this.notificationDOMRef.current.addNotification({
        title: "Success",
        message: "Delete course successfully !",
        type: "success", //success, danger, default, info, warning or custom
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 2000 },
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
            row.Intern.University, row.Intern.Faculty, row.Course,
            // format datetime,
            row.Department, row.CourseID])
          stt++
          return NewData
        })
        this.setState({
          internList: NewData
        })
        console.log(data)
      });
  }

  handleChangeTab = (event, value) => {
    this.setState({ value });
  };

  componentDidMount() {

    this.GetInternList()
    this.GetListCourse()
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
      courseName: "",
      dob: "",
      University: "",
      Faculty: "",
      icon: "plus",
      isUpdate: false,
      checkValidate: false
    });
    this.toggleIntern()
  }

  handlerAddIntern = () => {
    // if (confirm("You definitely want to add intern?")) { //eslint-disable-line

    // }
    var moment = require('moment');

    const date = moment.utc(this.state.dob).format();
    // const dt = this.state.dob.split(/-|\s/)
    // let date = new Date(dt[2], dt[1], dt[0])
    const data = {
      "Name": this.state.name,
      "PhoneNumber": this.state.phone,
      "Email": this.state.email,
      "Gender": this.state.gender === "Male" ? true : false,
      "DoB": date,
      "University": this.state.University,
      "Faculty": this.state.Faculty,
      "CourseID": this.state.course,
      "IsDeleted": false
    }
    console.log(data)
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
    this.addNotification("successAdd")
    // window.location.reload();
  }


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

  handlerDeleteIntern = () => {
    if (confirm("bạn chắc chắn muốn xóa ?")) { //eslint-disable-line

    }
    fetch("http://localhost:8080/intern/" + this.state.id, {
      method: 'DELETE',
      mode: 'cors',
    })
      .then(this.GetInternList())
    this.toggleIntern()

    window.location.reload();
  }

  handlerEditIntern = () => {
    var moment = require('moment');

    const date = moment.utc(this.state.dob).format();

    // const dt = this.state.dob.split(/-|\s/)
    // let date = new Date(dt[2], dt[1], dt[0])

    //new Date(dt[2], dt[1], dt[0])
    // console.log(this.state.date)
    console.log("dt" + date);
    const data = {
      "Name": this.state.name,
      "PhoneNumber": this.state.phone,
      "Email": this.state.email,
      "Gender": this.state.gender === "Male" ? true : false,
      "DoB": date,
      "University": this.state.University,
      "Faculty": this.state.Faculty,
      "CourseID": this.state.course,
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
    console.log(this.state.id)

    this.addNotification("successUpdate")

    window.location.reload();
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
        sort: false,
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
    download: false,
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
        this.setState({ course: value })
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
  onSelect = (course) => {
    console.log(course.Name);
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
            <Card className="mt-5">
              <CardBody>
              <div className="app-content">
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

            <MDBModalBody>
              <MDBInput fullwidth="true" size="" label="Name" name="name" value={this.state.name} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput fullwidth="true" label="Phone" name="phone" value={this.state.phone} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput fullwidth="true" label="Email" iconClass="dark-grey" name="email" value={this.state.email} onChange={this.handleChangeValue.bind(this)} />
              {/* <MDBInput label="Gender" name="gender" value={this.state.gender} onChange={this.handleChangeValue.bind(this)} /> */}
              <Select fullWidth label="Gender" name="gender" value={this.state.gender} onChange={this.handleChangeValue.bind(this)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select><br />
              <label>Course</label>
              <select className="browser-default custom-select custom-dropdown custom-margin" onChange={this.handleChangeValue.bind(this)} name="course" size="lg">
                {this.state.courseList.map(function (course, index) {
                  return <option key={index} value={course.ID}>{course.Name}</option>;
                })}
              </select><br />

              <label>Date</label>
              <input type="date" name="dob" size="lg" value={this.state.dob} onChange={this.handleChangeValue.bind(this)} /><br></br>
              <TextField label="University" name="text" name="University" value={this.state.University} onChange={this.handleChangeValue.bind(this)} />
              <div className="text-center mt-1-half">
                <TextField fullWidth label="Faculty" name="text" name="Faculty" value={this.state.Faculty} onChange={this.handleChangeValue.bind(this)} />
                <div className="text-center mt-1-half">
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
                      onClick={this.handlerEditIntern}>
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
              </div>
            </MDBModalBody>
          </MDBModal>
        </Row>
      </React.Fragment>
    )
  }
}
export default withStyles(styles)(InternPage);