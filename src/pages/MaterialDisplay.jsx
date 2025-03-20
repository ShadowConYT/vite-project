import React, { useEffect } from "react";
import { Paper, CircularProgress } from "@mui/material";
import { DataGrid, GridToolbar  } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getMaterials } from "../actions/materialAction";

const MaterialDisplay = () => {
  const dispatch = useDispatch();
  const { loading, materials, error } = useSelector((state) => state.material);

  const data = materials && materials?.items;
  // Fetch materials from the backend
  useEffect(() => {
    dispatch(getMaterials());
  }, [dispatch]);

  console.log(materials && materials.items)
  // Define columns dynamically based on materials data
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "hblNo", headerName: "HBL No", width: 160 },
    { field: "plant", headerName: "Plant", width: 100 },
    { field: "purchasingDocument", headerName: "Purchasing Doc", width: 150 },
    { field: "item", headerName: "Item", width: 80 },
    { field: "material", headerName: "Material", width: 120 },
    { field: "shortText", headerName: "Short Text", width: 250 },
    { field: "scheduledQuantity", headerName: "Scheduled Qty", width: 120 },
    { field: "deliveryDate", headerName: "Delivery Date", width: 150 },
    { field: "expectedDeliveryNumber", headerName: "Expected Delivery No", width: 180 },
  ];

  const convertExcelDate = (serial) => {
    const date = new Date(1899, 11, 30); // Excel base date
    date.setDate(date.getDate() + Number(serial));
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format as DD/MM/YYYY
  };
  
  const rows = data?.map((row, index) => ({
    id: index + 1,
    hblNo: row["HBL No"] || "N/A",
    plant: row.Plant || "N/A",
    purchasingDocument: row["Purchasing Document"] || "N/A",
    item: row.Item || "N/A",
    material: row["Material"] || "N/A",
    shortText: row["Short Text"] || "N/A",
    scheduledQuantity: row["Scheduled Quantity"] || "N/A",
    deliveryDate: row["Delivery Date"] ? convertExcelDate(row["Delivery Date"]) : "N/A",
    expectedDeliveryNumber: row["Expected Delivery Number"] || "N/A",
  }));
  
  

    console.log(rows)

  if (loading) {
    return (
      <Paper style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper style={{ padding: 20, border:'0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </Paper>
    );
  }

  return (
    <Paper style={{ padding: 20}}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
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

export default MaterialDisplay;
