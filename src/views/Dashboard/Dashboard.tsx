
import { Add, Close, CloudDownload, CloudUpload } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Button, Checkbox, CircularProgress, Container, CssBaseline, Drawer, Grid2, Icon, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Toolbar, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import transformFile from "./dashboard.api.service";
import { useUpload } from "hooks/fileUpload/useUpload";
import { useDownload } from "hooks/fileDownload/useDownload";
import excelImg from '/src/assets/web/xlsx-32.png';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useExcel } from "hooks/excel/useExcel";

interface IFiles {
  name: string;
  size: number;
  lastModified: number;
  data: string;
}

const columns: GridColDef<any>[] = [
  { field: 'columnName', headerName: 'Column Name', width: 150 },
  {
    field: 'aliasName',
    headerName: 'Alias name',
    width: 150,
    editable: true,
  },
  {
    field: 'valueForColumn',
    headerName: 'Computed Value',
    width: 150,
    editable: true,
  },
];

function createTransformationData(data: Record<string, any>) {
  const rows = []
  let i = 0;
  for (const key in data) {
    rows.push({
      id: i++,
      columnName: key,
      aliasName: key.replace(/\s+/g,'_').toLowerCase(),
      age: null
    })
  }
  return rows;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


function saveFile(file: IFiles | null | undefined) {
  if (!file) {
    return;
  }
  return transformFile(file.data);
}

function bytesToSize(bytes: number) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return 'n/a';
  var i = parseInt('' + (Math.floor(Math.log(bytes) / Math.log(1024))));
  if (i == 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

function AddNewColumn({selectedSheet, setSheetWiseTransformationData}:any) {
  
  const [data, setData] = useState<Record<string, any>>({id: 10});

  const handleColumnChange = (e:any ) => {

    const d = {
      columnName: e.target.value,
      aliasName: e.target.value.toLowerCase().replace(/\s+/g, '_')
    }
    setData((pre) => ({...pre,  ...d }))
  }

  const handleChange = (e: any) => {
    setData((pre) => ({ ...pre, [e.target.name]: e.target.value }))
    console.log(data);
  }

  const pushData = () => {
    setSheetWiseTransformationData((pre:any) => {
      try {
        console.log(pre[selectedSheet]);
        const val = [{...data, id: pre[selectedSheet].length+1}, ...pre[selectedSheet]];
        pre[selectedSheet] = val;
        console.log(pre[selectedSheet]);
        
      } catch (error) {
        console.log(error);
        
      }
      return {...pre};
    })
  }

  return <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
    <TextField name="columnName" size="small" placeholder="Enter new colum name u want to add" label="Column Name" onChange={handleColumnChange} />
    <TextField name="aliasName" size="small" disabled value={data['aliasName']} />
    <TextField name="valueForColumn" size="small" placeholder="Enter new value for this colum" label="Value For Column" onChange={handleChange} />
    <IconButton color="primary" onClick={pushData}>
      <Add />
    </IconButton>
  </Box>
}

export default function Dashboard() {
  const { files, read } = useUpload();
  const { buttonRef, fromBase64 } = useDownload({ autoDownload: true });
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<any>(null);
  const [selectedSheet, setSelectedSheet] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef(null);
  const [enableTransformation, setTransformation] = useState(false);
  const excel = useExcel()
  const [excelData, setExcelData] = useState<any>();
  const [sheets, setSheets] = useState<any>();
  const [sheetWiseKeys, setSheetWiseKeys] = useState<Record<string, string[]> | null>();
  const [sheetWiseTransformationData, setSheetWiseTransformationData] = useState<any>();

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
      setSheets(null);
      setSelectedSheet('');
    };
  }, []);

  useEffect(() => {
    if (files) {
      const data = excel.read(files[0].data);
      setExcelData(data);
      const sheets: Record<string, any> = {};
      const sheetWiseKeys: Record<string, any> = {};
      const sheetWiseTransformation: Record<string, any> = {}
      for (let sheet in data) {
        sheets[sheet] = data[sheet].slice(0, 5);
        sheetWiseKeys[sheet] = Object.keys(data[sheet][0] || {}) || [];
        sheetWiseTransformation[sheet] = createTransformationData(sheets[sheet][0] || {})
      }
      setSheetWiseKeys(sheetWiseKeys)
      setSheets(sheets);
      setSelectedSheet(excel.sheetNames?.[0] || '')
      setSheetWiseTransformationData(sheetWiseTransformation);
    }
  }, [files])

  const handleButtonClick = () => {



    if (!files) {
      return;
    }

    if (!loading) {
      setLoading(true);
    }



    new Promise(async (res, rej) => {
      const value = await saveFile(files[0])
      setConvertedFiles(value);
      res(value);

      setTimeout(() => {
        rej('Timeout!.The Request is taking more time');
      }, 3000)
    }).then((val) => {
      console.log(val);
      download(convertedFiles['data'])
      setLoading(false);
    }).catch((err) => {
      alert(err)
    })


  };

  const openTransformation = () => {
    if (excelData) {
      setSelectedSheet(excel.sheetNames?.[0] || '')
      setOpenModal(true);
    }

  }



  const download = (data: any) => {
    const element = document.createElement("a");
    const textFile = new Blob([JSON.stringify(data, null, 2)], { type: 'text/plain' }); //pass data from localStorage API to blob
    element.href = URL.createObjectURL(textFile);
    element.download = "userFile.txt";
    document.body.appendChild(element);
    element.click();
  }

  useEffect(() => {
    return () => beforeUpload()
  });

  function beforeUpload() {
    if ((inputRef.current as any)?.target?.files) {
      (inputRef.current as any)['target']['files'] = null
    }
  }

  function setTransformedData({ row }: any, eve: any) {
    setSheetWiseTransformationData((pre: any) => {
      const indx = pre[selectedSheet]?.findIndex((ele: any) => ele.columnName === row.columnName);
      console.log(row, "param.columnName");

      pre[selectedSheet][indx].aliasName = eve?.target?.value || 'Encountered Error While Updating';
      return pre;
    })
  }

  return (
    <>
      <CssBaseline />
      <Box component="section">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth="xl" sx={{ height: '100%' }}>

        <Grid2 container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, xl: 3 }} height={'100%'}>

          <Grid2 size={4}>
            <Typography variant="h6" display="flex" justifyContent="start">
              Uploaded
            </Typography>

            <List sx={{ width: '100%', background: 'background.paper' }}>
              {
                files?.map((file) =>
                  <ListItem alignItems="flex-start" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={file.name}>
                    <ListItemIcon>
                      <img src={excelImg} />
                    </ListItemIcon>
                    <ListItemText primary={<>
                      <Typography
                        component="p"
                        sx={{ color: 'text.primary' }}
                      >
                        {file.name.replace(/.xlsx|.xls/, '')}
                      </Typography>
                      {bytesToSize(file.size)}
                    </>}
                      sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                    />
                  </ListItem>)
              }
            </List>
          </Grid2>

          <Grid2 size={8} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUpload />}
                onClick={() => beforeUpload()}
              >
                Upload files
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => read(event)}
                  ref={inputRef}
                  accept=".xlsx"
                />
              </Button>

              <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                  variant="contained"
                  disabled={loading || !files?.length}
                  onClick={openTransformation}
                >
                  Convert File
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: green[500],
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
              Do you wan't to download the response

              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudDownload />}
                disabled={!convertedFiles}
                ref={buttonRef}
              >
                Download
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </Container >
      <Drawer
        anchor='right'
        open={openModal}>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>

          <IconButton aria-label="close" sx={{ width: 'fit-content', justifySelf: 'end' }} onClick={() => setOpenModal(false)}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ width: '100%', minWidth: 1000, maxWidth: 1080, bgcolor: 'background.paper', padding: '10px' }}>

          {/* <div className=" my-2">
            <Typography className="text-xl border rounded-lg p-3 my-2">
              Excel Data
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <div className="backdrop-blur-sm box-border border h-full rounded-lg shadow-md">
                <Tabs aria-label="basic tabs example" sx={{ overflowX: 'scroll' }} value={0}>
                  {
                    excel.sheetNames?.map((sheet, index) => <Tab label={sheet} key={index} onClick={() => setSelectedSheet(sheet)} />)
                  }
                </Tabs>
                <TableContainer>
                  <Table sx={{ minWidth: 500, overflow: 'scroll' }} aria-label="simple table" size="medium">
                    <TableHead>
                      <TableRow>
                        {sheetWiseKeys?.[selectedSheet]?.map((key) => <TableCell>
                          <Typography className="truncate">
                            {key}
                          </Typography>
                        </TableCell>)}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sheets?.[selectedSheet]?.map((row: any) => (

                        <TableRow
                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          {sheetWiseKeys?.[selectedSheet].map((key) => <TableCell component="th" scope="row">
                            <Typography className="truncate">

                              {row[key]}
                            </Typography>
                          </TableCell>)}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>

          </div> */}

          {/* <Accordion expanded={!enableTransformation} className="rounded-lg">
            <AccordionSummary
              aria-controls="panel1-content"
              id="panel1-header"
              className="w-full"
            >
              <div className=" w-full flex justify-between items-center">
                <Tabs aria-label="basic tabs example" sx={{ overflowX: 'scroll' }} value={0}>
                  {
                    excel.sheetNames?.map((sheet, index) => <Tab label={sheet} key={index} onClick={() => setSelectedSheet(sheet)} />)
                  }
                </Tabs>
                <Checkbox value='transform' onChange={() => setTransformation(!enableTransformation)} />
              </div>
            </AccordionSummary> */}
            {/* <AccordionDetails> */}
              {/* <Box sx={{ maxHeight: 400, width: '100%' }}> */}
              <DataGrid
                rows={sheetWiseTransformationData?.[selectedSheet] || {}}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                onCellEditStop={(param, eve: any) => setTransformedData(param, eve)}
                sx={{height: 400}}
              />
              <AddNewColumn selectedSheet={selectedSheet} setSheetWiseTransformationData={setSheetWiseTransformationData} />
              {/* </Box> */}
            {/* </AccordionDetails>
          </Accordion> */}
          <Button onClick={() => console.log(sheetWiseTransformationData)}>
            submit
          </Button>
        </Box>
      </Drawer>
    </>
  )
}

