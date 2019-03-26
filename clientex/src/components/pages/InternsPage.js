import React from 'react';
import { MDBBtn, MDBTable, MDBTableBody, MDBTableHead, MDBIcon } from 'mdbreact';

const InternsPage = (props) => {
  const columns= [
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
      label: 'Course',
      field: 'course',
      sort: 'asc'
    },
    {
      label: '',
      field: 'edit',
      sort: 'asc'
    },
    {
      label: '',
      field: 'delete',
      sort: 'asc'
    }
    
  ];

  const rows_rounded_btn = [
    {
      'id': 1,
      'name': 'Nguyen Van A',
      'course': 'Golang',
      'edit':<MDBBtn color="red"  rounded size="sm" ><MDBIcon icon="edit"/></MDBBtn>,
      'delete':<MDBBtn color="red"  rounded size="sm"  ><MDBIcon icon="minus"/></MDBBtn>
      
    },
    {
      'id': 2,
      'name':'Nguyen Van B',
      'course':'Java',
      'edit':<MDBBtn color="red"  rounded size="sm"  ><MDBIcon icon="edit"/></MDBBtn>,
      'delete':<MDBBtn color="red"  rounded size="sm"  ><MDBIcon icon="minus"/></MDBBtn>
    }
  ];

  return(
    <div>
      <MDBBtn color='green' rounded outline size="sm"><MDBIcon icon="plus"/></MDBBtn>
    
    <MDBTable>
    
      <MDBTableHead columns={columns} />
      <MDBTableBody rows={rows_rounded_btn} />

    </MDBTable>
</div>
  );
};

export default InternsPage;