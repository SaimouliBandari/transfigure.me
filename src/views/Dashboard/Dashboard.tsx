
import { ArrowDropDown, CloudDownload, CloudUpload } from "@mui/icons-material";
import { AppBar, Box, Button, ButtonGroup, CircularProgress, ClickAwayListener, Container, CssBaseline, Grid2, Grow, IconButton, List, ListItem, ListItemText, MenuItem, MenuList, Paper, Popper, Toolbar, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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
  console.log(files, "<<<< files read");

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

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Access-Control-Allow-Origin', '*',)
  myHeaders.append('Accept', '*')

  console.log(myHeaders, "headers");


  var raw = JSON.stringify({
    base64: file.data
  });

  var requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
    mode: 'cors'
  };

  // fetch("http://localhost:3000/upload", requestOptions)
  //   .then(response => response.text())
  //   .then(result => console.log(result))
  //   .catch(error => console.log('error', error));
  return fetch("https://ljjhen55ci.execute-api.us-east-1.amazonaws.com/upload", requestOptions)
    .then(response => response.json());
}

function bytesToSize(bytes: number) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return 'n/a';
  var i = parseInt('' + (Math.floor(Math.log(bytes) / Math.log(1024))));
  if (i == 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};


export default function Dashboard() {
  const [files, setFiles] = useState<IFiles[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [open, setOpen] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState<any>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef(null);

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

    const resolverArray = [
      new Promise((res) => {
        setTimeout(() => {
          res('Timed Out');
        }, 30000);
      })
    ];
    
    saveFile(files[0])?.then((value) => {
      setConvertedFiles(value)      
      resolverArray.unshift(
         Promise.resolve(value)
      )
    })

    Promise.race(resolverArray).then((val) => {
      console.log(val);
      download(convertedFiles['data'])
      setLoading(false);
    })


  };

  const download = (data: any) => {
    const element = document.createElement("a");
    const textFile = new Blob([JSON.stringify(data, null, 2)], {type: 'text/plain'}); //pass data from localStorage API to blob
    element.href = URL.createObjectURL(textFile);
    element.download = "userFile.txt";
    document.body.appendChild(element); 
    element.click();
  }


  console.warn('Init');

  useEffect(() => {
    return () => beforeUpload()
  });

  function readSaveSaveFiles(event: any) {
    const f = readFiles(event.target.files)
      ?.then((uploadedFiles) => {
        if (uploadedFiles) {
          setFiles([...uploadedFiles])
          console.log(uploadedFiles, 'uploadedFiles');
          console.log(files, 'filtes', event.target.files);
        }
      });
    console.log(f, "files",);
  }



  function beforeUpload() {
    if ((inputRef.current as any).target?.files) {
      (inputRef.current as any)['target']['files'] = null
    }
  }

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    if(event)
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };




  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ height: '100%' }}>
        <Box component="section" sx={{ "marginBottom": '10px' }}>
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
                  onChange={(event) => readSaveSaveFiles(event)}
                  ref={inputRef}
                />
              </Button>

              {/* <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                  variant="contained"
                  sx={buttonSx}
                  disabled={loading || !files?.length}
                  onClick={handleButtonClick}
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
              </Box> */}


              <Box sx={{ m: 2, position: 'relative' }}>
                <ButtonGroup
                  variant="contained"
                  ref={anchorRef}
                  aria-label="Button group with a nested menu"
                  disabled={loading || !files?.length}
                >

                  <Button
                    variant="contained"                   
                    onClick={handleButtonClick}
                  >
                    {options[selectedIndex]}
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

                  <Button
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                  >
                    <ArrowDropDown />
                  </Button>
                </ButtonGroup>
                <Popper
                  sx={{ zIndex: 1 }}
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === 'bottom' ? 'center top' : 'center bottom',
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList id="split-button-menu" autoFocusItem>
                            {options.map((option, index) => (
                              <MenuItem
                                key={option}
                                disabled={index === 2}
                                selected={index === selectedIndex}
                                onClick={(event) => handleMenuItemClick(event, index)}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Box>

              Do you wan't to download the response

              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudDownload />}
                onClick={() => download(convertedFiles)}
                disabled={!convertedFiles}
              >
                Download
                
              </Button>

            </Box>
          </Grid2>
        </Grid2>
      </Container >
    </>
  )
}
