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



class EditInforForMentor extends React.Component {

    constructor() {
        super();
        this.addNotification = this.addNotification.bind(this);
        this.notificationDOMRef = React.createRef();
        this.state = {
            id: JSON.parse(sessionStorage.getItem('user')).ID,
            modal: false,
            data: [],
            value: 0,
            mentor: [],
            isUpdate: false,
            // checkValidate: true,
            btnMode: 'on'
        };
    }

    // componentWillMount(){
    //     this.GetMentor()
    // }
    componentDidMount() {
        this.GetMentor()
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



    GetMentor() {
        const id = this.state.id;
        const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
        fetch('http://localhost:8080/getmentor/' + id)
            .then(response => response.json())
            .then(data => {


                data.Gender = data.Gender ? "Male" : "Female";
                data.DoB = this.convertDate(new Date(data.DoB).toLocaleDateString('en-US', options));


                console.log(data)

                this.setState({
                    mentor: data
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
                    dismiss: { duration: 2000 },
                    dismissable: { click: true }
                });
                break;
            case "successUpdate":
                this.notificationDOMRef.current.addNotification({
                    title: "Success",
                    message: "Update mentor info successfully !",
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


    handlerEditMentor = () => {
        var moment = require('moment');
        const date = moment.utc(this.state.mentor.DoB).format();
        console.log("dt" + date);
        const data = {
            "Name": this.state.mentor.Name,
            "PhoneNumber": this.state.mentor.PhoneNumber,
            "Email": this.state.mentor.Email,
            "Gender": this.state.mentor.Gender === "Male" ? true : false,
            "Dob": date,
            "Department": this.state.mentor.Department,
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
            .then(this.addNotification("successUpdate"))
            .then(this.GetMentor())
            .then(this.GetMentor())

    }

    // handlerCheckEmailExits() {
    //     var checkEmail = false
    //     $.ajax({
    //         url: "http://localhost:8080/checkemail/" + this.state.mentor.Email,
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
        //  this.state.mentor.DoB = this.convertDate(this.state.mentor.DoB);
        e.target.className = "form-control"
        switch (name) {
            case "name":
                this.state.mentor.Name = value
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
                console.log(this.state.mentor)

                break;
            case "phone":
                this.state.mentor.PhoneNumber = value
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
                this.state.mentor.Email = value
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
                this.state.mentor.Gender = value
                if (value.trim().length > 0) {
                    this.setState({
                        doneGender: true,
                    })
                }
                // console.log(this.state.dob)

                break;
            case "dob":
                this.state.mentor.DoB = value
                if (value.trim().length > 0) {
                    this.setState({
                        doneDOB: true,
                    })
                }
                break;
            // case "mentor":
            //     this.state.mentor.mentor = value
            //     if (value.trim().length > 0) {
            //         this.setState({
            //             doneMentor: true,
            //         })
            //         e.target.className += " valid"
            //     }
            //     break;
            case "department":
                this.state.mentor.Department = value
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
        // if (this.state.doneName === true &&
        //     this.state.donePhone === true &&
        //     this.state.doneGender === true &&
        //     this.state.doneEmail === true &&
        //     this.state.doneDepartment === true &&
        //     this.state.doneDOB === true) {
        //     this.setState({
        //         btnMode: "on"
        //     })
        // }
    }



    render() {
        const { classes } = this.props;

        // this.state.mentor.map((value, key) => {
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
                                <MDBInput label="Name" name="name" value={this.state.mentor.Name} onChange={this.handleChangeValue.bind(this)} ></MDBInput>
                                <MDBInput label="Phone" name="phone" value={this.state.mentor.PhoneNumber} onChange={this.handleChangeValue.bind(this)} />
                                <MDBInput label="Email" name="email" value={this.state.mentor.Email} onChange={this.handleChangeValue.bind(this)} />
                                <FormControl fullWidth >
                                    {/* <InputLabel htmlFor="select-multiple">Gendor</InputLabel> */}
                                    <Select fullWidth label="Gender" name="gender" value={this.state.mentor.Gender} onChange={this.handleChangeValue.bind(this)}>
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                </FormControl>

                                <MDBInput

                                    label="Dob"
                                    name="dob"
                                    id="date"
                                    type="date"
                                    value={this.state.mentor.DoB}
                                    onChange={this.handleChangeValue.bind(this)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <MDBInput label="Department" name="department" value={this.state.mentor.Department} onChange={this.handleChangeValue.bind(this)} />
                                <div className="text-center mt-1-half">



                                    <MDBBtn
                                        className="mb-2 blue darken-2"
                                        onClick={this.handlerEditMentor}
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

EditInforForMentor.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(EditInforForMentor);