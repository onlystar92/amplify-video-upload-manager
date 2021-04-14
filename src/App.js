import './App.css';

import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TopAppBar from "./Components/TopAppBar";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import Input from '@material-ui/core/Input';
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import RefreshIcon from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import VideoList from "./Components/VideoList";
import ReactPlayer from "react-player";
import {AMPLIFY_CONFIG} from "./config/constant";
import Alert from "@material-ui/lab/Alert"
import {withAuthenticator} from '@aws-amplify/ui-react'

import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import Storage from '@aws-amplify/storage';
import awsmobile from "./aws-exports";
import Utils from './Utils';
Amplify.configure(awsmobile);

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  upload: {
    marginLeft: theme.spacing(5),
    marginTop: theme.spacing(5),
    marginRight: theme.spacing(5),
    padding: theme.spacing(2),
    width: '100%'
  },
  uploadButton: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  fileName: {
    marginRight: '10px'
  },
  videoPlayer: {
    marginTop: theme.spacing(2),
    // padding: theme.spacing(2)
  }
}));


function App() {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [list, setList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = React.useState('');
  const [isUploadComplete, setUploadComplete] = React.useState(false);
  const [isShownMessge, setMessageState] = React.useState(false);

  const fileInput = React.createRef();


  const fetchVideoList = async () => {
    setIsLoading(true);
    await Storage.list(AMPLIFY_CONFIG.AMPLIFY_UPLOADED_FOLDER, {level: '2'}) // for listing ALL files without prefix, pass '' instead
      .then(result => {
        console.log(result);
        setIsLoading(false);
        setMessageState(false);
        setList(result)
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setUploadComplete(true);
    fetchVideoList();
    // setName("aaaaaaaaaaaaaaaa.mp4")
  }, []);

  const handleClick = (url) => {
    const fileName = Utils.getFileName(url);
    const filePath = AMPLIFY_CONFIG.AMPLIFY_CONVERTED_FOLDER + fileName + AMPLIFY_CONFIG.AMPLIFY_CONVERTED_M3U8_PATH + fileName + '.m3u8';
    setVideoUrl(`https://${awsmobile.aws_user_files_s3_bucket}.s3.amazonaws.com/${filePath}`);
  };

  const onSubmit = (e) =>{
    console.log("onSubmit");
    e.preventDefault();
    document.getElementById('file-input').click();
  }
  const onUpdate = async (e) => {
    e.preventDefault();
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("aaaaaaa1",e);
      setUploadComplete(false);
      setMessageState(false);
      setName(file.name);
      setResponse(`Uploading...`);
      console.log("bbbbbb" + file.name + ":" + file.type);
      await Storage.put(AMPLIFY_CONFIG.AMPLIFY_UPLOADED_FOLDER + file.name, file, {
        contentType: file.type,
        progressCallback(progress) {
          setProgress((progress.loaded/progress.total*100).toFixed())
        },
      })
        .then((result) => {
          console.log(result);
          setResponse(`Success uploading file: ${name}!`);
          const index = list.findIndex((e) => e.key === result.key);
          // if (index === -1) {
          //   fetchVideoList();
          // }
          setUploadComplete(true);
          setMessageState(true);

        })
        .then(() => {
          document.getElementById('file-input').value = null;
          setProgress(0);
          setName('');
          setResponse('');
        })
        .catch((err) => {
          console.log(err);
          setResponse(`Can't upload file: ${err}`)
        })
    } else {
      setResponse(`Files needed!`)
    }
  }

  return (

    <Box color="text.primary" component="span" m={0}>
      <TopAppBar />
      <Grid container>
        <Grid item xs={6} container justify='center'>
          <Paper elevation={3} className={classes.upload}>
            <form >
              <Grid >
                <Grid container className={classes.uploadButton} justify='flex-center'>
                  <label htmlFor="file-input" style={{justifyContent:'center'
                  ,justifyContent: 'center',width: '100%' ,textAlign: 'center'
                  ,display:'flex'}}>
                    <input
                      style={{display:'none'}}
                      id="file-input"
                      name="input-video"
                      type="file"
                      onChange={(e) => onUpdate(e)}
                      data-classButton="btn btn-primary"
                      ref = {fileInput}
                    />
                    <div>
                    <Typography
                      style={{ width:'fullWidth' }}
                      variant='h6'
                    >
                      {name}
                    </Typography>
                    <Button
                      style={{ width:'fullWidth' }}
                      color="primary"
                      variant="contained"
                      onClick={(e) => onSubmit(e)}
                      disabled={!isUploadComplete}
                    >
                      Click here to upload video  <CloudUploadIcon style={{marginLeft:'8px'}} />
                    </Button>
                    </div>
                  </label>
                </Grid>
              </Grid>
            </form>
            {isShownMessge ? ( 
              <Alert severity="success" variant='outlined'>  
              The video file has been uploaded successfully. Please click 
              <a onClick={fetchVideoList}> refresh</a> button below after a few seconds (depending on the size of the video file) to see the new one
              </Alert>
            ) : (
               null 
               )
            }
            { progress ? <LinearProgress variant="determinate" value={Number(progress)} /> : null }
            <Grid container justify='center'>
              <Typography variant='h6'>
                {response}
              </Typography>
            </Grid>
          </Paper>
          <Paper elevation={3} className={classes.upload}>
            <div style={{display:'flex' ,marginBottom:'5px'} }>
              <Typography variant='h6'
                style={{margin:'0px',alignSelf:'center'}}
              >
                Video List
              </Typography>
              <Button
                style={{marginLeft:'auto'}}
                variant="contained"
                color="secondary"
                onClick= {fetchVideoList}
                className={classes.button}
                startIcon={<RefreshIcon />}
              >
                Refresh
              </Button>
            </div>
            <Divider/>
            {
              isLoading ? (
                <Grid container justify='center'>
                  <CircularProgress style={{marginTop:'60px',marginBottom:'60px'}}/>
                </Grid>
                ) : (<VideoList data={list} style={{minHeight : '200px'}} handleClick={handleClick}/>)
            }
            <Grid>
              <Alert severity="warning">
                Note: Since this is a prototype, the above video list is fetched from the AWS S3 Storage directly, so you need to click the refresh button if you want to see the latest video files.<br />
                Integrating with DynamoDB & GraphQL is under progress, you can see the list in real-time once we have finished the implementation.
              </Alert>  
            </Grid>

          </Paper>
        </Grid>
        <Grid container className={classes.uploadButton} justify='flex-center'
        item xs={6} className={classes.videoPlayer}>
          <ReactPlayer url={videoUrl}
            style={{marginTop:'24px', marginRight:"40px",minHeight:'100px'}}
            playing={false}
            width='100%'
            height='auto'
            controls
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload"
                }
              }
            }}
          />
        </Grid>
        
      </Grid>
      
    </Box>
  );
}

export default withAuthenticator(App);
