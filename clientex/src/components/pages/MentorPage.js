import React from 'react';
import { MDBBtn, MDBTable, MDBTableBody, MDBTableHead, MDBIcon, MDBInput } from 'mdbreact';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const MentorPage = (props) => {
  const columns = [
    {
      label: '#',
      field: 'id',
      sort: 'asc'
    },
    {
      label: 'Name',
      field: 'name',
      sort: 'asc'
    },
    {
      label: 'Phone',
      field: 'phone',
      sort: 'asc'
    },
    {
      label: 'Email',
      field: 'email',
      sort: 'asc'
    },
    {
      label: 'Gender',
      field: 'gender',
      sort: 'asc'
    },
    {
      label: 'DoB',
      field: 'dob',
      sort: 'asc'
    },
    {
      label: 'Department',
      field: 'department',
      sort: 'asc'
    },
    {
      label: 'SupervisorID',
      field: 'supervisorid',
      sort: 'asc'
    },
    {
      label: 'IsDeleted',
      field: 'isdeleted',
      sort: 'asc'
    },
    {
      label: '',
      field: 'edit',
      sort: 'asc'
    },
    // {
    //   label: '',
    //   field: 'delete',
    //   sort: 'asc'
    // }

  ];

  const rows_regular_btn = [
    {
      'id': 1,
      'name': 'Nguyen Van A',
      'phone': '0342239381',
      'email': 'vana@gmail.com',
      'gender': 'male',
      'dob': '09/02/1992',
      'department': 'DC99',
      'supervisor': 'SD22dcc',
      // 'isdetected':<MDBInput type="checkbox" id="checkbox1" className="mb-5"/>,
      'edit': <MDBBtn color="orange" rounded size="sm" ><MDBIcon icon="edit" /></MDBBtn>,
      'delete': <MDBBtn color="red" rounded size="sm"  ><MDBIcon icon="minus" /></MDBBtn>

    },
    {
      'id': 2,
      'name': 'Nguyen Van B',
      'phone': '0342239381',
      'email': 'vana@gmail.com',
      'gender': 'male',
      'dob': '09/02/1992',
      'department': 'DC99',
      'supervisor': 'SD22dcc',
      // 'isdetected':  <MDBInput  type="checkbox" id="checkbox1" />      ,
      'edit': <MDBBtn color="orange" rounded size="sm" ><MDBIcon icon="edit" /></MDBBtn>,
      'delete': <MDBBtn color="red" rounded size="sm"  ><MDBIcon icon="minus" /></MDBBtn>

    }
  ];

  return (
    <div>
      <Fab  style={{ backgroundColor: 'red'}} color="primary" aria-label="Add">
        <AddIcon />
      </Fab>
      <MDBTable btn >

        <MDBTableHead columns={columns} />
        <MDBTableBody rows={rows_regular_btn} />

      </MDBTable>
    </div>
  );
};

export default MentorPage;