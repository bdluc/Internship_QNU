import React from 'react'
import { Row, Col, View, Card, CardBody, Table, TableHead, TableBody, MDBIcon} from 'mdbreact';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from '@material-ui/core/Icon';


const MentorPage = () => {
  return (
    <React.Fragment>
      <Row>
        <Col md="12">
          <Card className="mt-5">
            <View className="gradient-card-header blue darken-2">
              <h4 className="h4-responsive text-white">Basic tables</h4>
            </View>
            <CardBody>
              <Table>
                <TableHead color="primary-color" textWhite>
                  <tr>
                    <th>#</th>
                    <th>First</th>
                    <th>Last</th>
                    <th>Delete</th>
                    <th>Edit</th>
                  </tr>
                </TableHead>
                <TableBody>
                  <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td><Fab size="small">
                      <DeleteIcon />
                    </Fab></td>
                    <th><Fab color="secondary" aria-label="Edit">
                    <MDBIcon far icon="edit" /> </Fab></th>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td><Fab size="small" >
                      <DeleteIcon />
                    </Fab></td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Larry</td>
                    <td>the Bird</td>
                    <td><Fab size="small" href="#" >
                      <DeleteIcon />
                    </Fab></td>
                  </tr>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default MentorPage;