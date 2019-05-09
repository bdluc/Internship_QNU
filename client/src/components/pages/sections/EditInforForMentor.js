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
            btnMode: 'off',
            doneName: true,
            donePhone: true,
            doneGender: true,
            doneEmail: true,
            doneDepartment: true,
            doneDOB: true,
            fisrt: true,
            mess : "",
            uname: JSON.parse(sessionStorage.getItem('user')).UserName
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
                    dismiss: { duration: 5000 },
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
                    dismiss: { duration: 5000 },
                    dismissable: { click: true }
                });
                break;

        }
    }


    handlerEditMentor() {
        var moment = require('moment');
        const date = moment.utc(this.state.mentor.DoB).format();
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

    handleGetEmailState(){
        if(this.state.mentor.Email != ''){
            fetch('http://localhost:8080/checkemail/'+this.state.mentor.Email)
        .then(response => response.json())
        .then(data => {
            this.setState({
              mess: data
            })
          });
        }

    }

    handlerCheckEmailExits = () =>{    

        if(this.state.mentor.Email != this.state.uname){
            if (this.state.mess.message == "Error") {
                this.addNotification("errEmail")
                }
            else {
                    this.handlerEditMentor()
                }       
         }   else {
            this.handlerEditMentor()
        }   
    }

   

    handleChangeValue(e) {
        const { name, value } = e.target;
        //  this.state.mentor.DoB = this.convertDate(this.state.mentor.DoB);
        e.target.className = "form-control"
        var temp = false;
        switch (name) {
            case "name":
                this.state.mentor.Name = value
                if (value.trim().length === 0) {
                    this.setState({
                        doneName: false,
                        name: " ",
                        errorName: "Name can not be blank"
                    })
                    e.target.className += " invalid"
                } else if (value.trim().length < 6) {
                    this.setState({
                        doneName: false,
                        errorName: "Name contains more than 5 characters"
                    })
                    e.target.className += " invalid"
                } else {
                    this.setState({
                        doneName: true,
                    })
                    temp = true;
                    e.target.className += " valid"
                }

                break;
            case "phone":
                this.state.mentor.PhoneNumber = value
                e.target.className = "form-control"
                const regexPhone = /^[0-9\b]+$/
                if (value.trim().length === 0) {
                    this.setState({
                        donePhone: false,
                        phone: " ",
                        errorPhone: "Phone can not be blank"
                    })
                    e.target.className += " invalid"
                } else if (!regexPhone.test(value.trim())) {
                    this.setState({
                        donePhone: false,
                        errorPhone: "Phone contains only numeric characters"
                    })
                    e.target.className += " invalid"
                } else if (value.length !== 10) {
                    this.setState({
                      phone: this.state.PhoneNumber,
                      donePhone: false,
                      errorPhone: "Phone not contains 10 number",
                    })
                    e.target.className += " invalid"
                  }else {
                    this.setState({
                        donePhone: true,
                    })
                    temp = true;
                    e.target.className += " valid"
                }
                break;
            case "email":
                this.state.mentor.Email = value
                e.target.className = "form-control"
                const regexEmail = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
                console.log(value, value.trim().length === 0)
                if (value.trim().length === 0) {
                    this.setState({
                        doneEmail: false,
                        email: " ",
                        errorEmail: "Email can not be blank"
                    })
                    e.target.className += " invalid"
                } else if (!regexEmail.test(value.trim())) {
                    this.setState({
                        doneEmail: false,
                        errorEmail: "Not a valid email address"
                    })
                    e.target.className += " invalid"
                } else {
                    this.setState({
                        doneEmail: true,
                        errorEmail: null
                    })
                    temp = true;
                    e.target.className += " valid"
                }
                // console.log(this.state.dob)

                break;
            case "gender":
                this.state.mentor.Gender = value
                if (value.trim().length > 0) {
                    this.setState({
                        doneGender: true,
                    })
                    temp = true;
                }else{
                    this.setState({
                        doneGender: false,
                    })
                }
                // console.log(this.state.dob)

                break;
            case "dob":
            var standard = new Date('1988/1/1').getTime();
            var currentDate = new Date().getTime();
            var valueofUser = new Date(value).getTime();
                this.state.mentor.DoB = value
                if (value.trim().length > 0) {
                    if ((currentDate - valueofUser) < standard || valueofUser < 0) {
                        this.setState({
                          doneDOB: false,
                        })
                        e.target.className += " invalid"
                      } else {
                        this.setState({
                          doneDOB: true,
                        })
                        temp = true;
                        e.target.className += " valid"
                      }
                }else {
                    this.setState({
                      doneDOB: false,
                    })
                    e.target.className += " invalid"
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
                    temp = true;
                    e.target.className += " valid"
                }else{
                    this.setState({
                        doneDepartment: false,
                    })
                }
                break;
            default:
                break;
        }
        this.setState({
            fisrt: false,
        })
        this.handleGetEmailState()

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
                                <MDBInput label="Name" name="name" value={this.state.mentor.Name} onInput={this.handleChangeValue.bind(this)} ></MDBInput>
                                <MDBInput label="Phone" name="phone" value={this.state.mentor.PhoneNumber} onInput={this.handleChangeValue.bind(this)} />
                                <MDBInput label="Email" name="email" value={this.state.mentor.Email} onInput={this.handleChangeValue.bind(this)} />
                                <FormControl fullWidth >
                                    {/* <InputLabel htmlFor="select-multiple">Gendor</InputLabel> */}
                                    <Select  label="Gender" name="gender" value={this.state.mentor.Gender} onInput={this.handleChangeValue.bind(this)}>
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                </FormControl>

                                <MDBInput

                                    label="DOB"
                                    name="dob"
                                    id="date"
                                    type="date"
                                    value={this.state.mentor.DoB}
                                    onInput={this.handleChangeValue.bind(this)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <MDBInput label="Department" name="department" value={this.state.mentor.Department} onInput={this.handleChangeValue.bind(this)} />
                                <div className="text-center mt-1-half">


                                    {
                                        (this.state.doneName === true &&
                                        this.state.donePhone === true &&
                                        this.state.doneGender === true &&
                                        this.state.doneEmail === true &&
                                        this.state.doneDepartment === true &&
                                        this.state.doneDOB === true && 
                                        !this.state.fisrt) ?
                                        <MDBBtn
                                            className="mb-2 blue darken-2"
                                            onClick={this.handlerCheckEmailExits}
                                        // disabled="true"
                                        >
                                            Change
                                            <MDBIcon icon="send" className="ml-1" />
                                        </MDBBtn>
                                        : null
                                    }
                                    {
                                        (this.state.doneName === false||
                                            this.state.donePhone === false ||
                                            this.state.doneGender === false ||
                                            this.state.doneEmail === false ||
                                            this.state.doneDepartment === false ||
                                            this.state.doneDOB === false || 
                                            this.state.fisrt) ?
                                        <MDBBtn
                                            className="mb-2 blue darken-2"
                                            onClick={this.handlerCheckEmailExits}
                                            disabled="true"
                                        >
                                            Change
                                            <MDBIcon icon="send" className="ml-1" />
                                        </MDBBtn>
                                        : null
                                    }
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