import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
//List Imports
import InboxIcon from '@mui/icons-material/Inbox';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
//Drawer Imports
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import { styled, useTheme } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BuildIcon from '@mui/icons-material/Build';
import ScheduleIcon from '@mui/icons-material/Schedule';

import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import api from '../../api/axiosConfig.js';

import Alert from '@mui/material/Alert';

//SignOutButton
import { getAuth, signOut } from "firebase/auth";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
  
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Modify = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { id } = useParams();
  //const [actualTask, setActualTask] = useState([]);
  const [title, setTitle]  = useState("");
  const [description, setDescription]  = useState("");
  const [miniTasks, setMiniTasks] = useState([]);
  const [value, setValue] = useState(dayjs());
  const [actualMiniTask, setActualMiniTask] = useState([]);
  const [done, setDone] = useState(false);

  const [empty, setEmpty] = useState(false);

  const [tasks, setTasks] = React.useState([]);

  const navigate = useNavigate();

  const { t, i18n } = useTranslation('global');

  const [language, setLanguage] = React.useState('en');

  const handleChange = (lng) => {
    setLanguage(lng);

    i18n.changeLanguage(lng);
  };

  const handleDescription = (description) => {
    //console.log(description); 
    setDescription(description.toString());
  };

  const handleTitle = (title) => {
      //console.log(title);
      setTitle(title.toString());
  };

  const addMiniTask = async () => {
    if (actualMiniTask != "") {
      if (miniTasks) {
          if (miniTasks.length > 0) {
              await api.post("/task/new/minitask", {
                  id: id,
                  title: actualMiniTask,
              }, {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              }).then(async (response) => {
                  if (response) {
                    const aux = miniTasks;
                    aux.push(actualMiniTask);
                    setMiniTasks(aux);
                  } 
              });
          }
          else {
            await api.post("/task/new/minitask", {
                id: id,
                title: actualMiniTask,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(async (response) => {
                if (response) {
                  const aux = [];
                  aux.push(actualMiniTask);
                  setMiniTasks(aux);
                } 
            });
          }
      }
      else {
        await api.post("/task/new/minitask", {
            id: id,
            title: actualMiniTask,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            if (response) {
              const aux = [];
              aux.push(actualMiniTask);
              setMiniTasks(aux);
            } 
        });
      }
      setActualMiniTask("");
    }
  };

  const miniTaskList = (miniTasks) => {
    if (miniTasks) {
      return miniTasks.map((mt) => retListItems(mt));
    }
  };

  const retListItems = (mt) => {
      return (
          <ListItem>
              <ListItemText primary = {mt.title} />    
          </ListItem>
      );
  };
    
  const handleDrawerOpen = () => {
      setOpen(!open);
  };

  const handleIcon = (index) => {
      if (index === 0) {
          return <InboxIcon/>;
      }
      else if (index === 1) {
          return <CalendarMonthIcon/>;
      }
      else if (index === 2) {
          return <ScheduleIcon/>;
      }
      else if (index === 3) {
          return <BuildIcon/>;
      }
  }

  const linkage = (index) => {
      if (index === 0) {
          return "/home";
      }
      else if (index === 1) {
          return "/calendar";
      }
      else if (index === 2) {
        return "/pomodoro";
      }
      
  }

  const signOutButton = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
        console.log("Sign-out Succesful"); 
        navigate('/');
    }).catch((error)=> {
        console.log(error);
    })
  }

  const setValues = (aux) => {
    setTitle(aux.title);
    if (aux.description) {
      setDescription(aux.description);
    }
    const aux2 = dayjs(aux.startDateTime);
    setValue(aux2.add(2, 'hour'));
    if (aux.miniTasks.length > 0) {
      setMiniTasks(aux.miniTasks);
    }
    setDone(aux.done);
  }

  const modifyTask = async () => {
    if (title != null && title != "") {
        if (value != null) {
          await api
          .post("/task/update?id="+id+"&title="+title+"&description="+description+"&date="+value.toString()+"&done="+done)
          .then((response) => {
            if (response.data.id != 0) {
              modifyInCalendar(id);
              navigate('/home');
            }
          });           
        }
    }
  };

  const modifyInCalendar = async (id) => {

    const fecha = value.add(1, 'hour');

    const eventDetails = {
        summary: title,
        description: description,
        start: {
            dateTime: value.toISOString(),
            timeZone: 'Europe/Madrid',
        },
        end: {
            dateTime: fecha.toISOString(),
            timeZone: 'Europe/Madrid',
        },
        reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 60 },
              { method: 'popup', minutes: 30 },
            ],
        },
    };

    await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events/focus"+id, {
        method: "PUT",
        headers: {
            'Authorization':'Bearer ' + localStorage.getItem("calendar") // Access token for google
        },
        body: JSON.stringify(eventDetails)
    }).then((data) => {
        return data.json();
    }).then((data) => {
        console.log(data);
    });
};

  const getListTasks = async() => {
    const user = localStorage.getItem("userInfo");

    if (user) {
        if (user != "") {
            await getTasks(user);
        } 
    }
  };

  const errorModify = () => {
    if (empty) {
      return (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
              <Toolbar>
              <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                  marginRight: 5,
                  ...(open && { display: 'none' }),
                  }}
              >
                  <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                  {t("header.modify")}
              </Typography>
              </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
            <IconButton onClick={handleDrawerOpen}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {[ t("header.home") , t("header.calendar"), t("header.pomodoros")].map((text, index) => (
                  <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                          sx={{
                          minHeight: 48,
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                          }} 
                          component={Link} to={linkage(index)}
                      >
                          <ListItemIcon
                          sx={{
                              minWidth: 0,
                              mr: open ? 3 : 'auto',
                              justifyContent: 'center',
                          }}
                          >
                              {handleIcon(index)}
                          </ListItemIcon>
                          <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                      </ListItemButton>
                  </ListItem>
              ))}
              <ListItem className='block fixed' disablePadding>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }} 
                  onClick={() => signOutButton()}>
                    <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}>
                        <LogoutIcon/>
                    </ListItemIcon>
                    <ListItemText primary={t("header.sign-out")} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
          <Alert className="mx-10 my-24" severity="error">Don't try to access other people's data!</Alert>
        </Box>
      );
    }
    else {
      return modificationBody();
    }
  };

  const getTasks = async (uid) => {
    try {
      const response = await api.get('/task/user?user_id='+uid);
      setTasks(response.data);
      const idInt = parseInt(id);
      if (response.data.length === 0) {
        setEmpty(true);
      }
      else {
        const aux = response.data.find(task => task.id === idInt);
        setValues(aux);
      }
    } 
    catch(err){
        console.log(err);
    }
  };

  const modificationBody = () => {
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
                }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
                {t("header.modify")}
            </Typography>
            </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
          <IconButton onClick={handleDrawerOpen}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          </DrawerHeader>
          <Divider />
          <List className='justify-center'>
            {[ t("header.home") , t("header.calendar"), t("header.pomodoros")].map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        }} 
                        component={Link} to={linkage(index)}
                    >
                        <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                        }}
                        >
                            {handleIcon(index)}
                        </ListItemIcon>
                        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
            ))}
            <ListItem className='block fixed' disablePadding>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }} 
                onClick={() => signOutButton()}>
                  <ListItemIcon
                  sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                  }}>
                      <LogoutIcon/>
                  </ListItemIcon>
                  <ListItemText primary={t("header.sign-out")} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box sx={{ marginLeft: '20px', marginTop: '90px'}}>
          <div>
              <Typography variant="h4">
                  {t("task.modify-title")}
              </Typography>
          </div>
          <br/>
          <div className='spacing'>
              <TextField
                  required
                  id="task-title"
                  label={t("task.title")}
                  value={title}
                  onChange={(event) => handleTitle(event.target.value)}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                      label="Date and Time Picker"
                      value={value}
                      onChange={(newValue) => setValue(newValue)}
                  />
              </LocalizationProvider>
          </div>
          <div>
              <TextField
                  id="task-description"
                  label={t("task.description")}
                  fullWidth 
                  value={description}
                  onChange={(event) => handleDescription(event.target.value)}
                  margin="normal"
              />
          </div>
          <div className='spacing'>
              <TextField
                  id="miniTask-title"
                  label={t("task.miniTask")}
                  value={actualMiniTask}
                  fullWidth
                  onChange={(event) => setActualMiniTask(event.target.value)}
                  margin="normal"
              />
              <Button variant="contained" onClick={addMiniTask}>{t("task.add-miniTask")}</Button>
          </div>
          <div className='spacing'>
            <List>
                {miniTaskList(miniTasks)}
            </List>
          </div>
          <div>
              <Button variant="contained" onClick={modifyTask}>{t("task.modify")}</Button>
              <Button component={Link} to={"/home"}>{t("task.cancel")}</Button>
          </div>
        </Box>
      </Box>
    );
  }

  useEffect(() => {
    if (tasks.length === 0) {
      getListTasks();
    }
    const lng = localStorage.getItem("lng");
    if (language != lng) {
      handleChange(lng);
    }
  },[]);

  return (
    <div>
      {errorModify()}
    </div>
  );
}

export default Modify;