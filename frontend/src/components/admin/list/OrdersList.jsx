import styled from "styled-components";

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from "react-redux";
import { ordersEdit, ordersFetch } from "../../../slices/ordersSlice";
import moment from "moment";


export default function OrdersList() {
    //const navigate = useNavigate();
    const {list } = useSelector((state) => state.orders);
    const dispatch = useDispatch();

    React.useEffect(() =>{
        dispatch(ordersFetch())
    }, [dispatch]);

    const rows = list && list.map(order => {
        return{
            id: order._id,
            cName: order.shipping.name,
            amount: (order.total/100).toLocaleString(),
            dStatus: order.delivery_status,
            date: moment(order.createdAt).fromNow(),
        }
    })
    const columns = [
        { field: 'id', headerName: 'ID', width: 220 },

        { field: 'cName', headerName: 'Name', width: 130 },
        {
          field: 'amount',
          headerName: 'Amount',
          width: 80,
        },
        {
            field: 'dStatus',
            headerName: 'delivery',
            width: 130,
            renderCell:(params) =>{
                return(
                    <div>
                        {params.row.dStatus === "pending" ? (<Pending>Pending</Pending>) : 
                        params.row.dStatus === "dispatched" ? (<Dispatched>Dispatched</Dispatched>):
                        params.row.dStatus === "delivered" ? (<Delivered>Delivered</Delivered>):
                         ("error") 
                         }
                    </div>
                  
                )},
          },
        {
            field: 'date',
            headerName: 'date_ordered',
            width: 130,
        },
        {
          field: 'actions',
          headerName: 'Actions',
          sortable: false,
          width: 220,
          renderCell:(params) =>{
            return(
                <Actions>
                    <Dispatchbtn onClick={() => handleOrderDispatch(params.row.id)}>Dispatch</Dispatchbtn>
                    <Deliverybtn onClick={() => handleOrderDeliver(params.row.id)}>Delivered</Deliverybtn>
                    <View>View</View>
          
                </Actions>
              
            )},
        },
    ]
    const handleOrderDispatch = (id) =>{
        dispatch(ordersEdit({
            id,
            delivery_status: "dispatched",
        }))

    };
    const handleOrderDeliver = (id) =>{
        dispatch(ordersEdit({
            id,
            delivery_status: "delivered",
        }))

    };

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

const Actions = styled.div`
    width:100%;
    display:flex;
    justify-content:space-between;
    button{
        border:none;
        outline:none;
        padding: 3px 5px;
        color: white;
        border-radius:3px;
        cursor:pointer;
}  
`;

const Dispatchbtn = styled.button`
    background-color: rgb(38, 198,249);
`;
const Deliverybtn = styled.button`
    background-color:rgb(102, 255, 135);
`;

const View = styled.button`
    background-color: rgb(114, 225, 40);
`;

const Pending =styled.div`
    color: rgb(253, 181, 40);
    background: rgba(253, 181, 40, 0.12);
    padding:3px 5px;
    border-radius: 3px;
    font-size:14px;
`;
const Dispatched = styled.div`
    color: rgb(38, 198, 249);
    background-color: rgba(38, 198, 249, 0.12);
    padding: 3px 5px;
    border-radius:3px;
    font-size: 14px;  
`;

const Delivered = styled.div`
    color: rgb(102, 255, 148);
    background-color: rgba(102, 108, 255, 0.12);
    padding: 3px 5px;
    border-radius: 3px;
    font-size:14px;
`;