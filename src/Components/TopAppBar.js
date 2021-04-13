import React, {useEffect} from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Amplify from "aws-amplify";
import { AmplifySignOut } from '@aws-amplify/ui-react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  customizeToolbar: {
    minHeight: theme.spacing(10)
  }
}));

const signOut = async () => {
  try {
    await Amplify.signOut();
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

const TopAppBar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense" className={classes.customizeToolbar}>
          <Grid container justify='space-between'>
            <Typography variant="h4" color="inherit">
              Video Upload & Player
            </Typography>
            <Button color="inherit" onClick={() => signOut()}>
              <AmplifySignOut/>
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
    )
}

export default TopAppBar