import { Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadShipmentDetails } from '../actions/shipmentAction';

const LiveStatus = () => {
  const { loading, loadedShipmentsFromDatabase: shipments, error } = useSelector(state => state.shipment);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadShipmentDetails());
  }, [dispatch]);

  const formatDate = (date) => {
    if (!date) return 'Invalid Date';
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return 'Invalid Date';
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!loading) {
    shipments.map((shipment) => {
      console.log("before ", shipment.estimated_arrival_date);
      console.log("after ", formatDate(shipment.estimated_arrival_date));
    });
  }

  const columns = [
    { field: 'liner', headerName: 'Liner', width: 100 },
    { field: 'mot', headerName: 'MOT', width: 100 },
    { field: 'origin', headerName: 'Origin', width: 150 },
    { field: 'plant', headerName: 'Plant', width: 150 },
    { field: 'hbl', headerName: 'HBL', width: 130 },
    { field: 'invoiceDate', headerName: 'Invoice Date', width: 130 },
    {
      field: 'etd',
      headerName: 'Estimated Departure Date',
      width: 130,
      renderCell: (params) => formatDate(params.value),
      cellClassName: '!flex !justify-start !items-center'
    },
    {
      field: 'eta',
      headerName: 'Estimated Arrival Date',
      width: 150,
      renderCell: (params) => formatDate(params.value),
      cellClassName: '!flex !justify-start !items-center'
    },
    { field: 'destination', headerName: 'Destination', width: 300 },
    { field: 'status', headerName: 'Status', width: 180 },
    { field: 'agreedLT', headerName: 'Agreed LT', width: 100 },
    { field: 'ltStatus', headerName: 'LT Status', width: 100 },
    { field: 'ltDays', headerName: 'LT Days Difference', width: 100 }
  ];

  const rows = !loading ? shipments.map((shipment, index) => {
    const invoiceDate = new Date(shipment.invoice_date);
    const estimatedArrivalDate = new Date(shipment.estimated_arrival_date);
    const updatedInvoiceDate = new Date(invoiceDate.setDate(invoiceDate.getDate() + shipment.lt_days));
    const ltDaysDifference = Math.abs(Math.ceil((estimatedArrivalDate - updatedInvoiceDate) / (1000 * 60 * 60 * 24)));

    return {
      id: `${index + 1}a`,
      liner: shipment.liner_name,
      mot: shipment.mode_of_transport,
      origin: shipment.origin_location,
      plant: shipment.plant || 'N/A',
      hbl: shipment.ref,
      invoiceDate: formatDate(shipment.invoice_date) || 'processing...',
      etd: shipment.estimated_departure_date,
      eta: shipment.estimated_arrival_date, 
      destination: shipment.arrival_location,
      status: shipment.status,
      agreedLT: shipment.lt_days,
      ltStatus: shipment.lt_status || "On-Time",
      ltDays: ltDaysDifference
    };
  }) : [];

  return (
    <Paper style={{ padding: 20 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Paper>
  );
};

export default LiveStatus;