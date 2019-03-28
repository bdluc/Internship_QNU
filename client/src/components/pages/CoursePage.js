
import { Row, Col, Card, CardBody, Table, TableHead, TableBody } from 'mdbreact';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import AddCource from './sections/AddCource';
import AddIcon from '@material-ui/icons/Add';
import AddCourse from './sections/AddCourse'
import React, { Component } from 'react';

class CourcePage extends Component {
  constructor() {
    super();
    this.state = {
      Course: []
    };
  }

  componentDidMount() {

    fetch('http://localhost:8080/courses')
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.setState({
          Course: result
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
                  <td><Fab size="small" style={{ backgroundColor: "#92B558" }} aria-label="Add">
                    <AddIcon />
                    <AddCourse></AddCourse>
                  </Fab></td>


                </tr>
                <hr></hr>
                <Table>

                  <TableHead color="primary-color" textWhite>

                    <tr>
                      <th>#</th>
                      <th>Course Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Mentor</th>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {this.state.Course.map((item, index) =>
                      (
                        <tr key={index}>
                          <th>{index}</th>
                          <th>{item.CourseName}</th>
                          <th>{(new Date(item.StartDate)).toLocaleDateString('en-US', DATE_OPTIONS)}</th>
                          <th>{(new Date(item.EndDate)).toLocaleDateString('en-US', DATE_OPTIONS)}</th>
                          <th>{item.MentorName}</th>
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
    );
  }
}

export default CourcePage;