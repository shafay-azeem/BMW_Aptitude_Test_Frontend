import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import apiFunctions from "./global/GlobalFunction";
import { API_URL, BASE_URL } from "./global/Constant";
import Toast from "./Toast.js";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import { createSearchParams, useNavigate } from "react-router-dom";
// import { Box, TextField, Typography, Paper, IconButton } from "@mui/material";
import { Box, TextField, Typography, IconButton, Drawer, Button, MenuItem, Select } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "./components/loader.js";
import axios from "axios";

ModuleRegistry.registerModules([AllCommunityModule]);

const DataGridPage = () => {
    const navigate = useNavigate();
    const [rowData, setRowData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [colDefs, setColDefs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedHeader, setSelectedHeader] = useState("");
    const [filterOption, setFilterOption] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const defaultColDef = {
        flex: 1,
        resizable: true,
        sortable: true,
        filter: true,
        minWidth: 120,
    };

    useEffect(() => {
        const request = axios.CancelToken.source();
        if (searchValue?.trim() === "") {
            getHeadersAndDataRow(request);
        } else {
            getSearchAbleRow(request, searchValue);
        }

        return () => request.cancel();
    }, [searchValue]);

    const getHeadersAndDataRow = async (request) => {
        if (loading) return;
        try {
            setLoading(true);
            const getHeaderAndRowsData = await apiFunctions.GET_REQUEST(
                BASE_URL + API_URL.GET_HEADER_AND_ROW,
                request
            );
            if (getHeaderAndRowsData.status === 200) {
                setRowData(getHeaderAndRowsData?.data?.data);
                setColDefs(
                    getHeaderAndRowsData?.data?.headers
                        ?.map((header) => ({
                            field: header,
                            sortable: false,
                            filter: false,
                            minWidth: 100,
                            maxWidth: 200,
                        }))
                        .concat([
                            {
                                field: "Actions",
                                cellRenderer: ActionsCellRenderer,
                                sortable: false,
                                filter: false,
                                minWidth: 100,
                                maxWidth: 120,
                                cellStyle: { textAlign: "center" },
                            },
                        ])
                );
            } else {
                setRowData([])
                if (axios.isCancel(getHeaderAndRowsData)) {
                    console.log("api is cancelled");
                } else {
                    // const successToast = new Toast(
                    //     getHeaderAndRowsData.response.data.message,
                    //   "error",
                    //   getHeaderAndRowsData.response.status
                    // );
                    // successToast.show();

                }
            }
        } catch (error) {
            const successToast = new Toast("Internal Server Error", "error", 500);
            successToast.show();
        } finally {
            setLoading(false);
        }
    };

    const getSearchAbleRow = async (request, searchValue) => {
        if (loading) return;
        try {
            setLoading(true);
            const getSearchAbleRow = await apiFunctions.GET_REQUEST(
                BASE_URL + API_URL.GET_SEARCH_API + `?value=${searchValue}`,
                request
            );
            if (getSearchAbleRow.status === 200) {
                setRowData(getSearchAbleRow?.data?.data);
            } else {
                setRowData([])
                if (axios.isCancel(getSearchAbleRow)) {
                    console.log("api is cancelled");
                } else {
                    // const successToast = new Toast(
                    //     getSearchAbleRow.response.data.message,
                    //   "error",
                    //   getSearchAbleRow.response.status
                    // );
                    // successToast.show();

                }
            }
        } catch (error) {
            const successToast = new Toast("Internal Server Error", "error", 500);
            successToast.show();
        } finally {
            setLoading(false);
        }
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };
    const getFilterResult = async (request, selectedHeader, filterOption, filterValue) => {
        console.log(filterValue, "filterValue")
        if (loading) return;
        try {
            setLoading(true);
            const getFilterResult = await apiFunctions.GET_REQUEST(
                BASE_URL + API_URL.GET_FILTER_API + `?column=${selectedHeader}&criteria=${filterOption}&value=${filterValue}`,
                request
            );
            if (getFilterResult.status === 200) {
                setRowData(getFilterResult?.data?.data);
            } else {
                setRowData([])
                if (axios.isCancel(getFilterResult)) {
                    console.log("api is cancelled");
                } else {
                    // const successToast = new Toast(
                    //     getFilterResult.response.data.message,
                    //   "error",
                    //   getFilterResult.response.status
                    // );
                    // successToast.show();
                    // setRowData([]);
                }

            }
        } catch (error) {
            const successToast = new Toast("Internal Server Error", "error", 500);
            successToast.show();
        } finally {
            setLoading(false);
        }
    };


    const applyFilter = () => {
        setDrawerOpen(!drawerOpen)
        setSearchValue("")
        const request = axios.CancelToken.source();
        getFilterResult(request, selectedHeader, filterOption, filterValue)
        return () => request.cancel();
        // Add logic to filter data based on selectedHeader, filterOption, and filterValue
    };

    const deleteRowById = async (id) => {
        try {
            const deleteRowById = await apiFunctions.DELETE_REQUEST(
                BASE_URL + API_URL.DELETE_ROW_BY_ID_API + `${id}`
            );
            if (deleteRowById.status === 200) {
                getHeadersAndDataRow();
            }
        } catch (error) {
            const successToast = new Toast("Internal Server Error", "error", 500);
            successToast.show();
        }
    };

    const ActionsCellRenderer = (params) => {
        const handleViewClick = () => {
            let id = params.data._id;
            navigate({
                pathname: "/detailPage",
                search: createSearchParams({ id }).toString(),
            });
        };

        const deleteRow = () => {
            const successToast = new Toast(
                "Row deleted successfully",
                "success",
                500
            );
            successToast.show();
            deleteRowById(params.data._id);
        };

        return (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                <IconButton
                    color="primary"
                    size="small"
                    onClick={handleViewClick}
                    sx={{ padding: 0.5 }}
                >
                    <RemoveRedEyeIcon fontSize="small" />
                </IconButton>
                <IconButton
                    color="error"
                    size="small"
                    onClick={deleteRow}
                    sx={{ padding: 0.5 }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
        );
    };

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: "#f5f5f5", // BMW light gray background
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                pb: 5,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#1E2E3E",
                    color: "#ffffff",
                    borderRadius: "4px",
                }}
            >
                <Typography variant="h5" color="inherit">
                    Data Grid
                </Typography>
                <Box>
                    <IconButton onClick={toggleDrawer} sx={{ color: "#ffffff" }}>
                        <MenuIcon />
                    </IconButton>
                    <TextField
                        id="search"
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        sx={{
                            width: "300px",
                            backgroundColor: "#ffffff",
                            borderRadius: "4px",
                        }}
                    />
                </Box>
            </Box>

            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
                <Box
                    sx={{
                        width: 300,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        backgroundColor: "#1E2E3E", // BMW dark blue background
                        color: "#ffffff", // White text
                        height: "100%",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                            borderBottom: "1px solid #0070C9", // BMW blue underline
                            pb: 1,
                        }}
                    >
                        <Typography variant="h6" color="#ffffff">
                            Filters
                        </Typography>
                        <IconButton onClick={toggleDrawer} sx={{ color: "#ffffff" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Dropdowns and Input */}
                    <Select
                        value={selectedHeader}
                        onChange={(e) => setSelectedHeader(e.target.value)}
                        displayEmpty
                        fullWidth
                        sx={{
                            backgroundColor: "#F7FBFF", // BMW light background
                            borderRadius: "5px",
                            "& .MuiSelect-select": {
                                padding: "10px",
                            },
                        }}
                    >
                        <MenuItem value="" disabled>
                            Select Header
                        </MenuItem>
                        {colDefs
                            .filter((col) => col.field !== "Actions")
                            .map((col) => (
                                <MenuItem key={col.field} value={col.field}>
                                    {col.field}
                                </MenuItem>
                            ))}
                    </Select>

                    <Select
                        value={filterOption}
                        onChange={(e) => setFilterOption(e.target.value)}
                        displayEmpty
                        fullWidth
                        sx={{
                            backgroundColor: "#F7FBFF",
                            borderRadius: "5px",
                            "& .MuiSelect-select": {
                                padding: "10px",
                            },
                        }}
                    >
                        <MenuItem value="" disabled>
                            Select Filter Option
                        </MenuItem>
                        <MenuItem value="contains">Contains</MenuItem>
                        <MenuItem value="equals">Equals</MenuItem>
                        <MenuItem value="starts with">Starts With</MenuItem>
                        <MenuItem value="ends with">Ends With</MenuItem>
                        <MenuItem value="is empty">Is Empty</MenuItem>
                    </Select>

                    <TextField
                        label="Filter Value"
                        variant="outlined"
                        size="small"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        fullWidth
                        sx={{
                            backgroundColor: "#F7FBFF",
                            borderRadius: "5px",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#0070C9", // BMW blue border
                                },
                                "&:hover fieldset": {
                                    borderColor: "#005B99", // BMW hover blue
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#003F72", // BMW focus blue
                                },
                            },
                        }}
                    />

                    {/* Apply Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={applyFilter}
                        disabled={!selectedHeader || !filterOption || !filterValue} // Disable if inputs are empty
                        sx={{
                            backgroundColor: !selectedHeader || !filterOption || !filterValue ? "#0070C9" : "#0070C9", // Light gray for disabled, BMW blue for enabled
                            color: !selectedHeader || !filterOption || !filterValue ? "#B0B0B0" : "#ffffff", // Adjust text color based on state
                            "&:hover": {
                                backgroundColor: !selectedHeader || !filterOption || !filterValue ? "red" : "#005B99", // Hover effect for enabled
                            },
                            padding: "10px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                            textTransform: "uppercase", // Keep text style consistent
                        }}
                    >
                        APPLY FILTER
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setSelectedHeader("");
                            setFilterOption("");
                            setFilterValue("");
                            setSearchValue(""); // Reset search value
                            getHeadersAndDataRow()
                            setDrawerOpen(!drawerOpen)
                        }}
                        sx={{
                            borderColor: "#ffffff", // White border
                            color: "#ffffff", // White text
                            "&:hover": {
                                borderColor: "#D0E8FF", // BMW light blue border
                                backgroundColor: "#6F6F6F", // BMW focus blue background
                            },
                            fontWeight: "bold",
                            borderRadius: "5px",
                            // flex: 1,
                        }}
                    >
                        RESET FILTER
                    </Button>
                </Box>
            </Drawer>

            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80vh",
                    }}
                >
                    <Loader />
                </Box>
            ) : (
                <Box
                    sx={{
                        p: 0, // Remove padding
                        backgroundColor: "transparent", // Remove background color
                    }}
                >
                    <div
                        className="ag-theme-alpine"
                        style={{
                            height: "70vh",
                            width: "100%",
                            "--ag-header-background-color": "#1E2E3E", // BMW dark blue header
                            "--ag-header-foreground-color": "#ffffff", // White header text
                            "--ag-row-hover-color": "#D0E8FF", // BMW light blue row hover
                            "--ag-odd-row-background-color": "#F7FBFF", // BMW light background
                            "--ag-even-row-background-color": "#ffffff", // White even rows
                        }}
                    >
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                            defaultColDef={defaultColDef}
                            domLayout="autoHeight"
                            animateRows={true}
                        />
                    </div>
                </Box>
            )}
        </Box>
    );
};

export default DataGridPage;
