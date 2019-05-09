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
import './components/report.css';

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

class MentorPageForMentor extends React.Component {

  constructor() {
    super();
    this.state = {
      modal: false,
      data: [],
      value: 0,
      mentorList: [],
      isUpdate: false,
      // checkValidate: true,
      btnMode: 'off'
    };


  }

  GetMentorList() {
    const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
    fetch('http://localhost:8080/mentors')
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
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20],
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
      SelectStyle: {
        marginLeft: "8px",
      }
    },
    onRowClick: (rowData) => {
      console.log(this.state.mentorList)

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


  render() {
    this.state.mentorList.map((value, key) => {
      return (<option key={key} value={value[1]}>{value[1]}</option>)
    })
    return (
      <React.Fragment className="hidescroll">
        <Row>
          <Col md="12">
            <Card>

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
        </Row>


      </React.Fragment>

    )

  }
}
export default withStyles(styles)(MentorPageForMentor);
