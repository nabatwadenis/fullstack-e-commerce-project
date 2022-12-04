
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { usersFetch } from "../../../slices/userSlice";
import styled from 'styled-components';


export default function UsersList() {
    const { list } = useSelector((state) => state.users);
    const dispatch = useDispatch();
   

    useEffect(() =>{
        dispatch(usersFetch())
    },[dispatch])

    const rows = list && list.map(user => {
        return{
            id: user._id,
            uName: user.name,
            uEmail: user.email,
            isAdmin: user?.isAdmin,

        }
    })
    const columns = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'uName', headerName: 'Name', width: 130 },
        {
          field: 'uEmail',
          headerName: 'email address',
          width: 220,
        },
        {
            field: 'isAdmin',
            headerName: 'isAdmin',
            width: 100,
            renderCell: (params) => {
                return(
                    <div>
                        {params.row.isAdmin ? (<Admin>Admin</Admin>) : (<Customer>Customer</Customer>)}
                    </div>
                )
            }
        },
    ]


    return (
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
        />
        </div>
    );
};

const Admin = styled.div`
    color: rgb(253, 181, 40);
    background-color: rgba(253, 181, 40, 0.12);
    padding: 3x 5px;
    border-radius: 3px;
    font-size:14px;
    
`
const Customer = styled.div`
    color: rgb(38, 98, 249);
    background-color: rgba(38, 98, 249, 0.12);
    padding: 3x 5px;
    border-radius: 3px;
    font-size:14px;
    
`

