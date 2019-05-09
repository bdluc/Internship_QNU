
import React from 'react'
import {
    Row, Col, Card, CardBody, MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal,
} from 'mdbreact';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import MUIDataTable from "mui-datatables";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
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
            internName: [],
            checkValidate: true
        };
    }

    GetInternListAbsent() {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        fetch('http://localhost:8080/internshowattend')
            .then(response => response.json())
            .then(data => {
                let NewData = []
                let stt = 1
                data.map(row => {
                    NewData.push([stt, row._id, row.InternName, row.Email, (new Date(row.Date)).toLocaleDateString('en-US', options),  row.Status,
                    ])
                    stt++
                    return NewData
                })
                this.setState({
                    internList: NewData,
                })
            });
    }

    GetInternListName() {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        fetch('http://localhost:8080/internabsent')
            .then(response => response.json())
            .then(data => {
                let NewData = []
                let stt = 1
                data.map(row => {
                    NewData.push({
                        STT: stt, ID: row._id, Name: row.InternName, Email: row.Email, Date: (new Date(row.Date)).toLocaleDateString('en-US', options), Status: row.Status,
                    })
                    stt++
                    return NewData
                })
                this.setState({
                    internName: NewData,

                })
            });
    }

    componentDidMount() {

        this.GetInternListAbsent()
        this.GetInternListName()
    }

    columnsIntern = [
        {
            name: "NO",
            options: {
                filter: false,
                sort: true,
                display: 'export',
            }
        },
        {
            name: "ID",
            options: {
                filter: false,
                sort: false,
                display: 'export',
            }
        },
        {
            name: "NAME",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "EMAIL",
            options: {
                filter: true,
                sort: false,
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
            name: "STATUS",
            options: {
                filter: true,
                sort: false,
                display: 'export',
            }
        },
    ]


    optionsIntern = {
        filterType: "dropdown",
        responsive: "scroll",
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
                    </MDBModal>
                </Row>
            </React.Fragment>
        )
    }
}
export default withStyles(styles)(ListInternAbsent);