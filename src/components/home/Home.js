import Calendar from '../calendar/Calendar';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './Home.css'

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
//Task Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import api from 'E:/UNI/TFG/FocusFront/focus-v1/src/api/axiosConfig.js';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
//Grid Imports
import Grid from '@mui/material/Unstable_Grid2';
//Floating Icon Imports
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ReorderIcon from '@mui/icons-material/Reorder';

// <Calendar tasks = {tasks} />

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));
  
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

const Home = ({tasks}) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [actual, setActual] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
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
            return "/";
        }
        else if (index === 1) {
            return "/calendar";
        }
        
    }

    const progressCalc = (task) => {
        const aux = task.miniTasks.filter(miniTask => miniTask.done === true);
        return ((aux.length/(task.miniTasks).length)*100);
    }

    //Handles what happens when you click on a miniTask
    const handleListMiniTaskClick = async (event, miniTask) => {
        //const boolvalue = false;
        if (miniTask.done === true) {
            const idmt = miniTask.id;
            const titlemt = miniTask.title;
            const response = await api.post("/task/update/minitask", {
                id: idmt,
                title: titlemt,
                done: false
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            miniTask.done = false;
        }
        else if (miniTask.done === false) {
            const idmt = miniTask.id;
            const titlemt = miniTask.title;
            const response = await api.post("/task/update/minitask", {
                id: idmt,
                title: titlemt,
                done: true
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            miniTask.done = true;
        }
    };

    //Handles if a task is done or not
    const isDone = (boolean) => {
        if (boolean) {
            return (<CheckIcon/>);
        }
        else {
            return (<CloseIcon/>);
        }
    }

    //Creates the list of miniTasks for each task that has them
    const retListMiniTasks = (miniTask) => {
        return (
            <ListItem 
                key = {miniTask.id}
            >
                <ListItemButton
                    onClick={(event) => handleListMiniTaskClick(event, miniTask)}                 
                >
                    <ListItemIcon>
                        {isDone(miniTask.done)}
                    </ListItemIcon>
                    <ListItemText primary = {miniTask.title} />
                </ListItemButton>        
            </ListItem>
        );
    };

    //Selects the miniTasks for each task
    const miniTasks = (task) => {
        if (task.miniTasks) {
            if (task.miniTasks.length > 0) {
                return (
                    <Box>
                        <LinearProgress variant="determinate" value={progressCalc(task)} />
                        <List
                            subheader = {
                                <ListSubheader component="div" id="nested-list-subheader">
                                    <Typography variant="h6" color="text.secondary">
                                        Mini Tasks
                                    </Typography>
                                </ListSubheader>
                            }
                        >
                            {(task.miniTasks).map((miniTask) => retListMiniTasks(miniTask))}        
                        </List>
                    </Box>
                );
            }
            else {
                return (
                    <Typography variant="body2" color="text.secondary">
                        Done: {isDone(task.done)}
                    </Typography>
                );
            }
        }
        
    };

    const loadTask = (actualTask) => {
        return (
            <Grid xs={4} sm={4} md={6} key = {actualTask.id}>
                <Card >
                    <CardHeader
                        action={
                            <div>
                                <IconButton aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                            </div>
                        }
                        title={actualTask.title}
                        subheader={actualTask.startDateTime}
                    />
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            {actualTask.description}
                        </Typography>

                        {miniTasks(actualTask)} 
                                    
                        <Typography variant="body2" color="text.secondary">
                            Creation Date: {actualTask.creationDateTime}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    }

    const handleTasks = (tasks) => {
        if (tasks) {
            if (tasks.length > 0) {
                if (actual) {
                    const now = dayjs();
                    const sortedTasks = tasks.sort((a, b) => dayjs(a.startDateTime) - dayjs(b.startDateTime));
                    const daysorted = sortedTasks.filter((task) => dayjs(task.startDateTime) > now);
                    return (
                        <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 18 }}>
                            {daysorted.map((task) => loadTask(task))}
                        </Grid>
                            
                    );
                }
                else {
                    const sortedTasks = tasks.sort((a, b) => dayjs(a.startDateTime) - dayjs(b.startDateTime));
                    return (
                        <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 18 }}>
                            {sortedTasks.map((task) => loadTask(task))}
                              
                        </Grid>
                            
                    );
                }
            }
            else {
                return ("Empty tasks");
            }
        }
        return ("No tasks");
    }

    const changeVisible = () => {
        //setActual(true);
    }

    if (!tasks) {
        return (
            <div>
                <div> No tasks available. </div>
            </div>
        )
    }

    else {
        return(
            <div>
                <div>
                    <div>
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
                                    Home
                                </Typography>
                                </Toolbar>
                            </AppBar>
                            <Drawer variant="permanent" open={open}>
                                <DrawerHeader>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                                </IconButton>
                                </DrawerHeader>
                                <Divider />
                                <List>
                                    {['Home', 'Calendar', 'Pomodoros', 'Adjustments'].map((text, index) => (
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
                                </List>
                            </Drawer>
                            <Box sx={{ marginLeft: '20px', marginTop: '90px', width: '94%', bgcolor: 'background.paper' }}>
                                {handleTasks(tasks)}
                                <div class="floating-buttons">
                                    <Fab color="primary" aria-label="add">
                                        <AddIcon />
                                    </Fab>
                                    <Fab size="medium" color="secondary" aria-label="order" onClick={changeVisible()}>
                                        <ReorderIcon />
                                    </Fab>
                                </div>
                            </Box>
                        </Box>
                    </div>
                </div>                        
            </div>
        )
    }
}

export default Home