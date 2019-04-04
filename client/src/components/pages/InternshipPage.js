
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
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

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
        let stt = 1
        data.map(row => {
          NewData.push([stt, row.Intern.ID, row.Intern.Name, row.Intern.PhoneNumber, row.Intern.Email, row.Intern.Gender ? "Male" : "Female", row.Intern.DoB, row.Intern.University, row.Intern.Faculty, row.Course,
            // format datetime
            (new Date(row.DoB)).toLocaleDateString('en-US', options),
            row.Department, row.CourseID])
          stt++
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
      "CourseID": "5c9b53dbda51e308e86b2243",
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
      name: "Day & Birth",
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
        } else if (value.trim().length < 4) {
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
    const { classes } = this.props;
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
              <MDBInput fullWidth size="" label="Name" name="name" value={this.state.name} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput fullWidth label="Phone" name="phone" value={this.state.phone} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput fullWidth label="Email" iconClass="dark-grey" name="email" value={this.state.email} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput label="Gender" name="gender" value={this.state.gender} onChange={this.handleChangeValue.bind(this)} />
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="demo-controlled-open-select">Course</InputLabel>
                <Select
                  open={this.state.openIntern}
                  onClose={this.handleCloseIntern}
                  onOpen={this.handleOpenIntern}
                  value={this.state.ageIntern}
                  onChange={this.handleChangeIntern}
                  inputProps={{
                    name: 'Course',
                    id: 'demo-controlled-open-select',
                  }}
                >
                  <MenuItem value="">
                    <em>Course</em>
                  </MenuItem>
                  <MenuItem value={0}>All</MenuItem>
                  <MenuItem value={10}>Golang</MenuItem>
                  <MenuItem value={20}>ReactJs</MenuItem>
                  <MenuItem value={30}>NodeJS</MenuItem>
                </Select>
              </FormControl>
              <DatePickers
                label="Day of Birth"
                name="dob"
                value={this.state.dob}
                onChange={this.handleChangeValue.bind(this)}
              />
              <TextField label="University" name="text" name="University" value={this.state.University} onChange={this.handleChangeValue.bind(this)} />
              <div className="text-center mt-1-half">
                <TextField fullWidth label="Faculty" name="text" name="Faculty" value={this.state.Faculty} onChange={this.handleChangeValue.bind(this)} />
                <div className="text-center mt-1-half">
                <TextField fullWidth label="Course" name="text" name="Course" value={this.state.CourseID} onChange={this.handleChangeValue.bind(this)} />
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
              </div>
            </MDBModalBody>
          </MDBModal>
        </Row>
      </React.Fragment>
    )
  }
}
export default withStyles(styles)(InternPage);

