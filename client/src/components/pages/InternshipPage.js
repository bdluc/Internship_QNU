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
                    <th>#</th>
                    <th>First</th>
                    <th>Last</th>
                    <th>Date</th>
                    <th>Week</th>
                  </tr>
                </TableHead>
                <TableBody>
                <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td><Fab color="primary" size="small" aria-label="Edit"><CreateIcon /></Fab></td>
                    <td><Fab size="small" href="#" ><DeleteIcon /></Fab></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td><Fab color="primary" size="small" aria-label="Edit"><CreateIcon /></Fab></td>
                    <td><Fab size="small" href="#" ><DeleteIcon /></Fab></td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td><Fab color="primary" size="small" aria-label="Edit"><CreateIcon /></Fab></td>
                    <td><Fab size="small" href="#" ><DeleteIcon /></Fab></td>
                  </tr>
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