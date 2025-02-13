import { Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { loadShipmentDetails } from '../actions/shipmentAction'

const LiveStatus = () => {
    const {loading, shipments, error} = useSelector(state => state.shipment);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadShipmentDetails());
    }, []);

    const dateAndTimeInLocal = (date) => {
        const localDate = new Date(date);
        return localDate.toLocaleString();
      };
    
      const renderDateAndTime = (dateTime) => {
        const dateandtime = dateAndTimeInLocal(dateTime);
        const datetimeLocal = dateandtime.split(',');
        const date = datetimeLocal[0];
        const time = `${datetimeLocal[1]?.split(' ')[1].split(':').slice(0, 2).join(':')} ${datetimeLocal[1]?.split(' ')[2]}`;
        return (
          <div className='flex flex-col'>
            <div>{date}</div>
            {/* <div>{time}</div> */}
          </div>
        )
      }
    const mockColumns = [
            { field: 'hbl_no', headerName: 'HBL No', width: 150 },
            { field: 'plant', headerName: 'Plant', width: 150 },
            { field: 'purchasing_document', headerName: 'Purchasing Document', width: 150 },
            { field: 'item', headerName: 'Item', width: 150 },
            { field: 'material', headerName: 'Material', width: 150 },
            { field: 'short_text', headerName: 'Short Text', width: 150 },
            { field: 'scheduled_quantity', headerName: 'Scheduled Quantity', width: 150 },
            { field: 'delivery_date', headerName: 'Delivery Date', width: 150 },
            { field: 'expected_delivery_number', headerName: 'Expected Delivery Number', width: 150 },
    ]
    
    const mockRows = [
        {
            id: 1,
            hbl_no: 'HBL No',
            plant: 'Plant',
            purchasing_document: 'Purchasing Document',
            item: 'Item',
            material: 'Material',
            short_text: 'Short Text',
            scheduled_quantity: 'Scheduled Quantity',
            delivery_date: 'Delivery Date',
            expected_delivery_number: 'Expected Delivery Number',
        }
    ]    

    const columns = [
        { field: 'no', headerName: 'No', width: 50, disableColumnMenu: true },
        { field: 'hbl', headerName: 'HBL', width: 130 },
        { field: 'liner', headerName: 'Liner', width: 100 },
        { field: 'origin', headerName: 'Origin', width: 150 },
        {
          field: 'etd', 
          headerName: 'Estimated Departure Date', 
          width: 130,
          renderCell: (params) => renderDateAndTime(params.value), 
          cellClassName: '!flex !justify-start !items-center'   
        },
        { field: 'destination', headerName: 'Destination', width: 300 },
        { field: 'eta', 
          headerName: 'Estimated Arrival Date', 
          width: 150,
          renderCell: (params) => renderDateAndTime(params.value),
          cellClassName: '!flex !justify-start !items-center'
        },
        { field: 'status', headerName: 'Status', width: 180 },
      ];

      const rows = !loading ? shipments.map((shipment, index) => ({
        id: `${index + 1}a`,
        no: index + 1,
        hbl: shipment.ref,
        liner: shipment.liner_name,
        origin: shipment.origin_location,
        etd: shipment.estimated_departure_date,
        destination: shipment.arrival_location,
        eta: shipment.estimated_arrival_date,
        status: shipment.status,
      })) : [];

    return (
        <Paper style={{ padding: 20 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                // checkboxSelection
                disableSelectionOnClick
            />    
        </Paper>
  )
}

export default LiveStatus