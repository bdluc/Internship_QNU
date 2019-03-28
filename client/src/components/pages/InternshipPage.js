// import React from 'react'
import { Row, Col, Card, CardBody, Table, TableHead, TableBody } from 'mdbreact';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import AddIntern from './sections/AddIntern';
import React, { Component } from 'react';
import PickCoure from './sections/PickCoure';



class InternshipPage extends Component {
  constructor() {
    super();
    this.state = {
      Intern: []
    };
  }

  componentDidMount() {

    fetch('http://localhost:8080/intern')
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.setState({
          Intern: result
        });
      })


  }

  render() {
    const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return (
      <div>
        <React.Fragment>
          <Row>
            <Col md="12">
              <Card className="mt-5">

                <CardBody>
                  <tr>
                    <td><AddIntern></AddIntern></td>
                    <td><PickCoure></PickCoure></td>
                  </tr>
                  <hr></hr>
                  <Table>

                    <TableHead color="primary-color" textWhite>

                      <tr>
                        <th>STT</th>
                        <th>Name</th>
                        <th>DayofBirth</th>
                        <th>Email</th>
                        <th>University</th>
                        <th>Faculty</th>
                        <th>PhoneNumber</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </TableHead>
                 
                    <TableBody>
                      {this.state.Intern.map((item, index) =>
                        (
                          <tr key={index}>
                            <th>{index}</th>
                            <th>{item.Name}</th>
                            <th>{(new Date(item.DoB)).toLocaleDateString('en-US', DATE_OPTIONS)}</th>
                            <th>{item.Email}</th>
                            <th>{item.University}</th>
                            <th>{item.Faculty}</th>
                            <th>{item.PhoneNumber}</th>
                            <th><Fab color="primary" size="small" aria-label="Edit"><CreateIcon /></Fab></th>
                            <th><Fab size="small" href="#" ><DeleteIcon /></Fab></th>
                          </tr>
                        )
                      )}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </React.Fragment>
      </div>
    )
  }
}

export default InternshipPage;