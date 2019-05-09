import React from 'react'
import {
  Row, Col, Card, CardBody, MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal,
} from 'mdbreact';
import MUIDataTable from "mui-datatables";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';

// /* Import MUIDataTable using command "npm install mui-datatables --save" */

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

function TabContainer(props) {

  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);


const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  main: {
    backgroundColor: "#007bff",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

class MentorPageForIntern extends React.Component {

  constructor() {
    super();
    this.state = {
      modal: false,
      internId: JSON.parse(sessionStorage.getItem('user')).ID,
      data: [],
      value: 0,
      mentorList: [],
      isUpdate: false,
      // checkValidate: true,
      btnMode: 'off'
    };
  }

  GetMentorList() {
    const internId = this.state.internId
    const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
    fetch('http://localhost:8080/course/'+ internId +'/mentor')
      .then(response => response.json())
      .then(data => {
        let NewData = []
        let cnt = 1
        data.map(row => {
          NewData.push([cnt, row.ID, row.Name, row.PhoneNumber, row.Email, row.Gender ? "Male" : "Female",
          this.convertDate2((new Date(row.DoB)).toLocaleDateString('en-US', options)), row.Department])
          //, row.SupervisorID
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
      modalMentor: false,
    //   !this.state.modalMentor,
    });
  };

  togglePopup = () => {
    this.setState({
      popupShow: !this.state.popupShow,
    })
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
      // checkValidate: false,
      btnMode: 'off',
      doneName: false,
      donePhone: false,
      doneGender: false,
      doneEmail: false,
      doneDepartment: false,
      doneDOB: false,
      

    });
    // const dateInForm =
    this.toggleMentor()
  }



  handlerAddMentor = () => {

    var moment = require('moment');
    const date = moment.utc(this.state.dob).format();
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


  }


  handlerDeleteMentor = () => {
    fetch("http://localhost:8080/mentor/" + this.state.id, {
      method: 'DELETE',
      mode: 'cors'
    })
      .then(this.GetMentorList())
    this.toggleMentor()


  }

  handlerEditMentor = () => {
    var moment = require('moment');
    const date = moment.utc(this.state.dob).format();
    console.log("dt" + date);
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
    fetch("http://localhost:8080/mentoru/" + this.state.id, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(this.setState({ open: true }))
      .then(this.GetMentorList())

    this.toggleMentor()
    // console.log(this.state.id)

    // window.location.reload();

    // this.setState({

    // })
  }
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };
  columnsMentor = [
    {
      name: "NO.",
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
    // {
    //   name: "SUPERVISOR",
    //   options: {
    //     filter: true,
    //     sort: false,
    //   }
    // },
  ]


  optionsMentor = {
    filterType: "dropdown",
    responsive: "scroll",
    download: false,
    viewColumns: false,
    print: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "Sorry, you can not access this data !!",
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
      SelectStyle: {
        marginLeft: "8px",
      }
    },
    onRowClick: (rowData) => {
      let std = this.convertDate(rowData[6])
      this.setState({
        id: rowData[1],
        name: rowData[2],
        phone: rowData[3],
        email: rowData[4],
        gender: rowData[5],
        dob: std,
        department: rowData[7],
        icon: "edit",
        isUpdate: true,
        // checkValidate: true,
        btnMode: 'off',
        

      });
      // console.log("day" + this.state.dob);
      this.toggleMentor()
    }


  }

  // checkValidate() {

  //   return false;
  // }
  convertDate(rowData) {
    var moment = require('moment')
    let strDate = ""
    let strMon = ""
    let strYea = ""
    let ye = moment(rowData, "DD-MM-YYYY").get('year');
    let mo = moment(rowData, "DD-MM-YYYY").get('month') + 1;  
    let da = moment(rowData, "DD-MM-YYYY").get('date');
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
  // checkValidate() {

  //   return false;
  // }
  convertDate2(rowData) {
    var moment = require('moment')
    let strDate = ""
    let strMon = ""
    let strYea = ""
    let ye = moment(rowData).get('year');
    let mo = moment(rowData).get('month') + 1;  
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
    return strDate + "/" + strMon + "/" + strYea
  }
  handleChangeValue(e) {
    const { name, value } = e.target;
    e.target.className = "form-control"
    switch (name) {
      case "name":
        this.setState({ name: value })
        if (value.trim().length === 0) {
          this.setState({
            btnMode: 'off',
            name: " ",
            errorName: "Name can not be blank"
          })
          e.target.className += " invalid"
        } else if (value.trim().length < 6) {
          this.setState({
            btnMode: 'off',
            errorName: "Name contains more than 5 characters"
          })
          e.target.className += " invalid"
        } else {
          this.setState({
            doneName: true,
            })
          e.target.className += " valid"
        }
        break;
      case "phone":
        this.setState({ phone: value })
        e.target.className = "form-control"
        const regexPhone = /^[0-9\b]+$/
        if (value.trim().length === 0) {
          this.setState({
            btnMode: 'off',
            phone: " ",
            errorPhone: "Phone can not be blank"
          })
          e.target.className += " invalid"
        } else if (!regexPhone.test(value.trim())) {
          this.setState({
            btnMode: 'off',
            errorPhone: "Phone contains only numeric characters"
          })
          e.target.className += " invalid"
        } else {
          this.setState({
            donePhone: true,
            })
          e.target.className += " valid"
        }
        break;
      case "email":
        this.setState({ email: value })
        e.target.className = "form-control"
        const regexEmail = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
        if (value.trim().length === 0) {
          this.setState({
            btnMode: 'off',
            email: " ",
            errorEmail: "Email can not be blank"
          })
          e.target.className += " invalid"
        } else if (!regexEmail.test(value.trim())) {
          this.setState({
            btnMode: 'off',
            errorEmail: "Not a valid email address"
          })
          e.target.className += " invalid"
        } else {
          this.setState({
            doneEmail: true,
            })
          e.target.className += " valid"
        }
        // console.log(this.state.dob)

        break;
      case "gender":
        this.setState({ gender: value })
        if (value.trim().length > 0) {
          this.setState({
            doneGender: true,            
          })
        }
        // console.log(this.state.dob)

        break;
      case "dob":
        this.setState({ dob: value })
        if (value.trim().length > 0) {
          this.setState({
            doneDOB: true,            
          })
        }
        break;
      case "mentor":
        this.setState({ mentor: value })
        if (value.trim().length > 0) {
          this.setState({
            doneMentor: true,            
          })
          e.target.className += " valid"
        }
        break;
      case "department":
        this.setState({ department: value })
        if (value.trim().length > 0) {
          this.setState({
            doneDepartment: true,            
          })
          e.target.className += " valid"
        }
        break;
      default:
        break;
    }
    /*
    doneName
    donePhone
    doneGender
    doneEmail
    doneDepartment
    doneDOB
    */
    if(this.state.doneName ===  true && 
      this.state.donePhone ===  true && 
      this.state.doneGender ===  true && 
      this.state.doneEmail ===  true && 
      this.state.doneDepartment ===  true && 
      this.state.doneDOB ===  true )
    {
      this.setState({
        btnMode: "on"
      })
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
                {/* <MDBBtn
                  className="mb-3 blue darken-2"
                  onClick={this.addMentor}>
                  Add
                </MDBBtn> */}

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
            //Popup
          }
          <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant="success"
            message="Đã cập nhật thành công!"
          />
        </Snackbar>

          {
            // AddMentor, Edit table
          }
          <MDBModal
            isOpen={this.state.modalMentor}
            toggle={this.toggleMentor}
            size="md"
            cascading>

            <MDBModalBody>
              <MDBInput label="Name" name="name" value={this.state.name} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput label="Phone" name="phone" value={this.state.phone} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput label="Email" name="email" value={this.state.email} onChange={this.handleChangeValue.bind(this)} />
              <FormControl fullWidth >
              <InputLabel htmlFor="select-multiple">Gender</InputLabel>
              <Select  label="Gender" name="gender" value={this.state.gender} onChange={this.handleChangeValue.bind(this)}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
              </FormControl>

              <MDBInput

                label="Dob"
                name="dob"
                id="date"
                type="date"
                value={this.state.dob}
                onChange={this.handleChangeValue.bind(this)}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <MDBInput label="Department" name="department" value={this.state.department} onChange={this.handleChangeValue.bind(this)} />
              <div className="text-center mt-1-half">
                {
                  (this.state.isUpdate === false) &&
                  this.state.btnMode === 'on' &&
                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerAddMentor}
                  >
                    Create
                  <MDBIcon icon="send" className="ml-1" />
                  </MDBBtn>
                }

                {
                  (this.state.isUpdate === false) &&

                  this.state.btnMode === 'off' &&
                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerAddMentor}
                    disabled="true"
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
export default withStyles(styles)(MentorPageForIntern);