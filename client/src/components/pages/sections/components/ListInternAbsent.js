
import React from 'react'
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
import $ from 'jquery';
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


class ListInternAbsent extends React.Component {

    constructor() {
        super();
        this.state = {
            modal: false,
            data: [],
            value: 0,
            internList: [],
            checkValidate: true
        };
    }

    GetInternListAbsent() {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        fetch('http://localhost:8080/internshowattend')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                let NewData = []
                let stt = 1
                data.map(row => {
                    NewData.push([stt, row._id, (new Date(row.Date)).toLocaleDateString('en-US', options), row.InternName, row.Status, row.Email,
                    ])
                    stt++
                    return NewData
                })
                this.setState({
                    internList: NewData
                })
            });
    }

    componentDidMount() {

        this.GetInternListAbsent()
        this.GetListCourse()
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

    handlerIntern = () => {
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
          "CourseID": this.state.course,
          "IsDeleted": false
        }
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
                filter: true,
                sort: false,
                display:'export',
            }
        },
        {
            name: "DATE",
            options: {
                filter: false,
                sort: false,
                // display:'export'
            }
        },
        {
            name: "INTERN NAME",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "STATUS",
            options: {
                filter: true,
                sort: false,
            }
        },
        // {
        //     name: "Email",
        //     options: {
        //         filter: true,
        //         sort: false,
        //     }
        // },
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
      
    }

    checkValidate() {

        return false;
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <Row>
                    <Col md="12">
                        <Card>
                            <CardBody>
                                <div className="app-content">
                                    <ReactNotification ref={this.notificationDOMRef} />
                                </div>
                                <hr></hr>
                                <marquee direction="right"><h2><b><i></i></b></h2></marquee>
                                <MUIDataTable
                                    title={<b><i>Intern List Absent</i></b>}
                                    data={this.state.internList}
                                    columns={this.columnsIntern}
                                    options={this.optionsIntern} />
                            </CardBody>
                        </Card>
                    </Col>

                    <MDBModal
                        isOpen={this.state.modalIntern}
                        toggle={this.toggleIntern}
                        size="md"
                        cascading>

                        <MDBModalBody >
                            <MDBInput fullwidth="true" size="" label="Name" name="name" value={this.state.name} />
                            <MDBInput fullwidth="true" label="Phone" name="phone" value={this.state.phone} />
                            <MDBInput fullwidth="true" label="Email" iconClass="dark-grey" name="email" value={this.state.email}  />
                            <FormControl fullWidth>
                                <InputLabel htmlFor="select-multiple">Gender</InputLabel>
                                <Select fullWidth label="Gender" name="gender" value={this.state.gender} >
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
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField fullWidth label="University" name="text" name="University" value={this.state.University} />
                            <div className="text-center mt-1-half">
                                <TextField fullWidth label="Faculty" name="text" name="Faculty" value={this.state.Faculty} />
                                <div className="text-center mt-1-half">

                                </div>
                            </div>
                        </MDBModalBody>
                    </MDBModal>
                </Row>
            </React.Fragment>
        )
    }
}
export default withStyles(styles)(ListInternAbsent);