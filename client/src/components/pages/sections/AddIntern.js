import React from 'react';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MDBIcon } from 'mdbreact';
import AddInternForm from './AddInternForm'

export default class AddIntern extends React.Component {
    
    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        return (
            <div>
                <Button variant="outlined" style={{ color: "green" }} onClick={this.handleClickOpen}>
                    {/* <MDBIcon icon="plus" /> */}Add
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Add mentor form</DialogTitle>
                    <DialogContent >
                    Hi, Please input your mentor information! We are Lab8 Mentor!
                    {/* Hi, Please input your mentor information!                     Hi, Please input your mentor information! 

                        <div className="form-group">
                            <MDBInput label="ID" />
                            <MDBInput label="Name" />
                            <MDBInput label="Phonenumber"/>
                            <MDBInput label="Email" />
                            <MDBInput label="Gender" />
                            <MDBInput label="DoB" />
                            <MDBInput label="Department" />
                            <MDBInput label="SupervisorID" />
                            <MDBInput label="IsDeleted" />


                            
                        </div>
                         */}

                         <AddInternForm></AddInternForm>
                    </DialogContent>
                    <DialogActions>
                  
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}