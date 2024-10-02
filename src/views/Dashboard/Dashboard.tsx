
import { Close, CloudDownload, CloudUpload } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Button, Checkbox, CircularProgress, Container, CssBaseline, Drawer, Grid2, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import transformFile from "./dashboard.api.service";
import { useUpload } from "hooks/fileUpload/useUpload";
import { useDownload } from "hooks/fileDownload/useDownload";
interface IFiles {
  name: string;
  size: number;
  lastModified: number;
  data: string;
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

const options = ['Convert and Transform', 'Convert'];


function readFiles(files: FileList | null) {
  console.log(files, "<<<< files");

  if (!files) {
    return null;
  }

  const filesArray = Array.from(files);
  const response: Promise<IFiles>[] = filesArray.map((file) => {
    return new Promise<IFiles>((res) => {
      const reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onload = async () => {
        console.warn('taking time');
        try {
          res(
            {
              name: file.name,
              size: file.size,
              lastModified: file.lastModified,
              data: (reader.result as string).split('base64,')[1]
            }
          )

        } catch (error) {
          res({
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
            data: "Error While Reading Files"
          })

        }
      }
    }).then((val) => {
      console.log(val);
      // response.push(val);
      return val;
    })
  })


  console.log('response, ', response);
  return Promise.all(response);
}

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


export default function Dashboard() {
  const {files, read} = useUpload();
  const {buttonRef, fromBase64} = useDownload({autoDownload:true});
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<any>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef(null);
  const [enableTransformation, setTransformation] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

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
    setOpenModal(true);
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
    if ((inputRef.current as any).target?.files) {
      (inputRef.current as any)['target']['files'] = null
    }
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
              Files Uploaded
            </Typography>

            <List sx={{ width: '100%', background: 'background.paper' }}>
              {
                files?.map((file) =>
                  <ListItem alignItems="flex-start">
                    <ListItemText primary={<>
                      <Typography
                        component="p"
                        variant="h6"
                        sx={{ color: 'text.primary' }}
                      >
                        {file.name}
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
        <Box sx={{ width: '100%', minWidth: 500, maxWidth: 800, bgcolor: 'background.paper', padding: '10px' }}>
          <Accordion expanded={enableTransformation}>
            <AccordionSummary
              aria-controls="panel1-content"
              id="panel1-header"
              className="w-full"
            >
              <div className=" w-full flex justify-between items-center">
                Transform
                <Checkbox value='transform' onChange={() => setTransformation(!enableTransformation)} />
              </div>
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </AccordionDetails>
          </Accordion>
          <Box sx={{marginTop: '10px'}}>
            <Typography>Excel Data</Typography>

            <ListItem
            // key={value}
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                {/* <CommentIcon /> */}
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton role={undefined} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText  />
            </ListItemButton>
          </ListItem>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

