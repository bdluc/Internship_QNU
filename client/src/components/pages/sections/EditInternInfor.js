import React from 'react'
import {
    MDBRow, MDBCol, Card, CardBody, MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal,
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
import ReactNotification from "react-notifications-component";
import { unstable_Box as Box } from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import $ from 'jquery';


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
    card: {
        backgroundColor: "#ffffff",
        "box-shadow": 2,

    }
});



class EditInternInfor extends React.Component {

    constructor() {
        super();
        this.addNotification = this.addNotification.bind(this);
        this.notificationDOMRef = React.createRef();
        this.state = {
            id: JSON.parse(sessionStorage.getItem('user')).ID,
            modal: false,
            data: [],
            value: 0,
            intern: [],
            isUpdate: false,
            // checkValidate: true,
            btnMode: 'on'
        };
    }

    // componentWillMount(){
    //     this.GetIntern()
    // }
    componentDidMount() {
        this.GetIntern()
    }


    convertDate(rowData) {
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
        return strYea + "-" + strMon + "-" + strDate
    }



    GetIntern() {
        const id = this.state.id;
        const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
        fetch('http://localhost:8080/getintern/' + id)
            .then(response => response.json())
            .then(data => {
                var intern = data.Intern
                intern.Gender = intern.Gender ? "Male" : "Female";
                intern.DoB = this.convertDate(new Date(intern.DoB).toLocaleDateString('en-US', options));
                intern.CourseName = data.Course;
                this.setState({
                    intern: intern
                })
            }).catch(
                // Log the rejection reason
                function (reason) {
                    console.log('Handle rejected promise (' + reason + ') here.');
                });
    }




    convertDate(rowData) {
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
        return strYea + "-" + strMon + "-" + strDate
    }
    addNotification(kind) {
        switch (kind) {
            case "errEmail":
                this.notificationDOMRef.current.addNotification({
                    title: "Error",
                    message: "Email exist",
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
                    message: "Update intern info successfully !",
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


    handlerEditIntern = () => {
        var moment = require('moment');
        const date = moment.utc(this.state.intern.DoB).format();
        console.log(this.state.intern.course);
        const data = {
            "Name": this.state.intern.Name,
            "PhoneNumber": this.state.intern.PhoneNumber,
            "Email": this.state.intern.Email,
            "Gender": this.state.intern.Gender === "Male" ? true : false,
            "Dob": date,
            "University": this.state.intern.University,
            "Faculty": this.state.intern.Faculty,
            "CourseID": this.state.intern.CourseID,
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
            .then(this.addNotification("successUpdate"))
            .then(this.GetIntern())
            .then(this.GetIntern())

    }

    // handlerCheckEmailExits() {
    //     var checkEmail = false
    //     $.ajax({
    //         url: "http://localhost:8080/checkemail/" + this.state.intern.Email,
    //         type: "GET",
    //         async: false,
    //         success: function (response) {
    //             if (!(response['message'] == "Success")) {
    //                 this.addNotification("errEmail")
    //             }
    //         }
    //     });
    //     if (checkEmail == true) {
    //         this.addNotification("successUpdate")
    //     }
    //     else {
    //         this.addNotification("errEmail")
    //     }
    // }



    handleChangeValue(e) {
        const { name, value } = e.target;
        //  this.state.intern.DoB = this.convertDate(this.state.intern.DoB);
        e.target.className = "form-control"
        switch (name) {
            case "name":
                this.state.intern.Name = value
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
                console.log(this.state.intern)

                break;
            case "phone":
                this.state.intern.PhoneNumber = value
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
                this.state.intern.Email = value
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
                    // this.handlerCheckEmailExits()
                }
                // console.log(this.state.dob)

                break;
            case "gender":
                this.state.intern.Gender = value
                if (value.trim().length > 0) {
                    this.setState({
                        doneGender: true,
                    })
                }
                // console.log(this.state.dob)

                break;
            case "dob":
                this.state.intern.DoB = value
                if (value.trim().length > 0) {
                    this.setState({
                        doneDOB: true,
                    })
                }
                break;
            // case "intern":
            //     this.state.intern.intern = value
            //     if (value.trim().length > 0) {
            //         this.setState({
            //             doneIntern: true,
            //         })
            //         e.target.className += " valid"
            //     }
            //     break;
            case "University":
                this.state.intern.University = value
                if (value.trim().length > 0) {
                    this.setState({
                        doneUniversity: true,
                    })
                    e.target.className += " valid"
                }
                break;
            case "Faculty":
                this.state.intern.Faculty = value
                if (value.trim().length > 0) {
                    this.setState({
                        doneFaculty: true,
                    })
                    e.target.className += " valid"
                }
                break;
            default:
                break;
        }
        if (this.state.doneName === true &&
            this.state.donePhone === true &&
            this.state.doneGender === true &&
            this.state.doneEmail === true &&
            this.state.doneFaculty === true &&
            this.state.doneUniversity === true &&
            this.state.doneDOB === true) {
            this.setState({
                btnMode: "on"
            })
        }
    }



    render() {
        const { classes } = this.props;

        // this.state.intern.map((value, key) => {
        //     return (<option key={key} value={value[1]}>{value[1]}</option>)
        //   })
        return (
            <React.Fragment className={classes.root}>
                <ReactNotification ref={this.notificationDOMRef} />
                <MDBRow >
                    <MDBCol md="3" />
                    <Box
                        // bgcolor="background.paper"
                        // borderColor="text.primary"
                        m={1}
                        border={1}
                        borderRadius="borderRadius" style={{ backgroundColor: "#ffffff", width: '5rem', height: '5rem' }} clone>

                        <MDBCol md="6" className={classes.card}>
                            <p>{this.state.errorEmail}</p>

                            <form >
                                <MDBInput label="Name" name="name" value={this.state.intern.Name} onChange={this.handleChangeValue.bind(this)} ></MDBInput>
                                <MDBInput label="Phone" name="phone" value={this.state.intern.PhoneNumber} onChange={this.handleChangeValue.bind(this)} />
                                <MDBInput label="Email" name="email" value={this.state.intern.Email} onChange={this.handleChangeValue.bind(this)} />
                                <FormControl fullWidth >
                                    <Select  label="Gender" name="gender" value={this.state.intern.Gender} onChange={this.handleChangeValue.bind(this)}>
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                </FormControl>

                                <MDBInput label="Course" name="course" htmlFor="select-multiple" value={this.state.intern.CourseName} display='false' />

                                <MDBInput

                                    label="Dob"
                                    name="dob"
                                    id="date"
                                    type="date"
                                    value={this.state.intern.DoB}
                                    onChange={this.handleChangeValue.bind(this)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <MDBInput label="University" name="University" value={this.state.intern.University} onChange={this.handleChangeValue.bind(this)} />
                                <MDBInput label="Faculty" name="Faculty" value={this.state.intern.Faculty} onChange={this.handleChangeValue.bind(this)} />
                                <div className="text-center mt-1-half">

                                    <MDBBtn
                                        className="mb-2 blue darken-2"
                                        onClick={this.handlerEditIntern}
                                    // disabled="true"
                                    >
                                        Change
                  <MDBIcon icon="send" className="ml-1" />
                                    </MDBBtn>

                                </div>
                            </form>
                        </MDBCol>
                    </Box>

                </MDBRow>
            </React.Fragment >
        );
    };
}

EditInternInfor.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(EditInternInfor);