import './Calendar.css'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

//Calendar Imports
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';

//List Imports
import InboxIcon from '@mui/icons-material/Inbox';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import NoteIcon from '@mui/icons-material/Note';

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
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import api from '../../api/axiosConfig.js';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

//SignOutButton
import { getAuth, signOut } from "firebase/auth";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

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

//Creates the badge for the calendar days that have tasks
function ServerDay(props) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
    const isSelected = highlightedDays.find((date) => props.day.$D === date.$D && props.day.$M === date.$M && props.day.$y === date.$y);
    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        color='error'
        size="small"
        badgeContent={isSelected ? ' ' : undefined}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
}

//Handles if a task is done or not
const isDone = (boolean) => {
    if (boolean) {
        return (<CheckIcon/>);
    }
    else {
        return (<CloseIcon/>);
    }
}

const Calendar = () => {
    const [highlightedDays, setHighlightedDays] = useState([]);
    const [value, setValue] = React.useState(dayjs());
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [openMessage, setMessageOpen] = React.useState(false);
    const [calendarDate, setCalendarDate] = React.useState(dayjs());
    const [expanded, setExpanded] = React.useState(false);
    const [tasks, setTasks] = React.useState([]);
    const [actualTask, setActualTask] = React.useState([]);

    const [reload, setReload] = useState(false);

    const navigate = useNavigate();

    const { t, i18n } = useTranslation('global');

    const [language, setLanguage] = React.useState('en');
  

    const markAsDone = (task) => {
        if (task.miniTasks) {
            if (task.miniTasks.length === 0) {
                if (task.done) {
                    return (
                        <Tooltip title={t("tooltips.todo-button")} arrow>
                            <IconButton aria-label="check"
                                onClick={() => {changeBoolean(task)}}
                            >
                                {isDone(task.done)}
                            </IconButton>
                        </Tooltip>
                    );
                }
                else {
                    return (
                        <Tooltip title={t("tooltips.done-button")} arrow>
                            <IconButton aria-label="check"
                                onClick={() => {changeBoolean(task)}}
                            >
                                {isDone(task.done)}
                            </IconButton>
                        </Tooltip>
                    );
                }
            }
        }
    }

    const changeBoolean = async (task) => {
        if (task.done === false) {
            const response = await api.post("/task/update", {
                id: task.id,
                title: task.title,
                description: task.description,
                date: task.startDateTime,
                done: true
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            window.location.reload();
        }
        else {
            const response = await api.post("/task/update", {
                id: task.id,
                title: task.title,
                description: task.description,
                date: task.startDateTime,
                done: false
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            window.location.reload();
        }
    };

    const handleChange = (lng) => {
        setLanguage(lng);
    
        i18n.changeLanguage(lng);
    };

    function handleClose() {
        setMessageOpen(!openMessage);
    }

    const getListTasks = async() => {
        const user = localStorage.getItem("userInfo");

        if (user) {
            if (user != "") {
                await getTasks(user);
                
            } 
        }
    };

    const getTasks = async (uid) => {
        try {
            const response = await api.get('/task/user?user_id='+uid);
            setTasks(response.data);
            const aux = response.data.map(task => dayjs(task.startDateTime));
            setHighlightedDays(aux);
        } 
        catch(err){
            console.log(err);
        }
    };

    const handleErase = async () => {
        const apiUrl = 'https://focustfg-2-production.up.railway.app/task/delete';
        const aux = actualTask.id;
        api.delete(`${apiUrl}?id=${aux}`);
        
        setActualTask([]);
        handleClose();
        window.location.reload();
    }

    //Creation of the task cards
    const loadTask = () => {
        return (
            <Box>
                <Container maxWidth="sm" > 
                    <Card sx={{ maxWidth: 600 }}>
                        <CardHeader
                            action={
                                <div>
                                    {markAsDone(actualTask)}
                                    
                                    <IconButton aria-label="edit" component={Link} to={'/modify/'+actualTask.id}>
                                        <EditIcon />
                                    </IconButton>
                                    
                                    <IconButton 
                                        aria-label="delete"
                                        onClick={handleClose}>
                                        <DeleteForeverIcon />
                                    </IconButton>

                                    <Dialog
                                        open={openMessage}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">
                                            {t("erase-dialog.title")}
                                        </DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                {t("erase-dialog.subtitle")}
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleClose}>{t("erase-dialog.disagree-button")}</Button>
                                        <Button onClick={handleErase} autoFocus>
                                            {t("erase-dialog.agree-button")}
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
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
                            
                        </CardContent>
                        <CardActions disableSpacing>        
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </CardActions>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>                               
                                <Typography variant="body2" color="text.secondary">
                                    {t("task.creation-date")} {actualTask.creationDateTime}
                                </Typography>
                            </CardContent>
                        </Collapse>
                    </Card>
                </Container>
            </Box>
        );
    }

    //Expands the card
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    //Creates the list of Tasks for each day that has them
    const retListItems = (task) => {
        return (
            <ListItem 
                key = {task.id}
            >
                <ListItemButton
                    onClick={(event) => handleListItemClick(event, task)}                    
                >
                    <ListItemIcon>
                        <NoteIcon 
                            key = {task.id + 'N'} 
                        />
                    </ListItemIcon>
                    <ListItemText primary = {task.title} />
                </ListItemButton>        
            </ListItem>
        );
    };

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
            const indice = actualTask.miniTasks.findIndex((mt) => mt.id === idmt);
            const aux = actualTask;
            aux.miniTasks[indice].done = false;
            setActualTask(aux);
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
            const indice = actualTask.miniTasks.findIndex((mt) => mt.id === idmt);
            const aux = actualTask;
            aux.miniTasks[indice].done = true;
            setActualTask(aux);
        }
    };

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

    const progressCalc = (task) => {
        const aux = task.miniTasks.filter(miniTask => miniTask.done === true);
        return ((aux.length/(task.miniTasks).length)*100);
    }

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
                                        {t("task.miniTask-list")}
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
                    <LinearProgress variant="determinate" value={(actualTask.done)*100}/>
                );
            }
        }
        
    };

    //Selects the tasks for each day that has them
    const TaskDay = (tasks, calendarDate) => {
        const aux = tasks.filter(task => dayjs(task.startDateTime).$D === calendarDate.$D && dayjs(task.startDateTime).$M === calendarDate.$M && dayjs(task.startDateTime).$y === calendarDate.$y);
        if (aux.length > 0) {
            return aux.map((task) => retListItems(task));
        }
    };

    //Opens the menu drawer
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    //Closes the menu drawer
    const handleDrawerClose = () => {
        setOpen(false);
    };

    //Handles if the task is shown or not 
    function handleTask() {
        var box = document.getElementById("myBox");
        if (box.style.display === "none") {
            box.style.display = "block";
        } else {
            box.style.display = "none";
        }
    }

    //Shows task
    function showTask() {
        var box = document.getElementById("myBox");
        box.style.display = "block";
    }

    //Hids task
    function closeTask() {
        var box = document.getElementById("myBox");
        box.style.display = "none";
    }

    //Handles what happens when you click a task
    const handleListItemClick = (event, task) => {
        if (task === actualTask) {
            handleTask();
        }
        else {
            setActualTask(task);
            showTask();
        }

    };

    //Handles what happens when you click a day on the calendar.
    const handleCalendarClick = (newValue) => {
        setValue(newValue);
        setCalendarDate(newValue);
        closeTask();
    };

    //Selects what icon is shown for each button of the menu drawer
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

    useEffect(() => {
        if (tasks.length === 0) {
            getListTasks();
        }
        if (reload) {
            console.log("reload");
            getListTasks();
            
            setReload(!reload);
        }
        const lng = localStorage.getItem("lng");
        if (language != lng) {
            handleChange(lng);
        }
    },[reload]);

    if (!tasks) {
        return (
            <div>
                <div> No tasks available. </div>
                <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} readOnly />
                    </LocalizationProvider>
                </div>
            </div>
        )
    }

    else {
        return (
            <div className="Row">
                <div className="Column">
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
                                {t("header.calendar")}
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
                        <Box sx={{marginTop: '70px', width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    value={value} onChange={(newValue) => handleCalendarClick(newValue)}
                                    renderLoading={() => <DayCalendarSkeleton />}
                                    slots={{
                                        day: ServerDay,
                                    }}
                                    slotProps={{
                                        day: {
                                            highlightedDays,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                            <List sx={{width: '100%', maxWidth: 500}}>
                                {TaskDay(tasks, calendarDate)}
                            </List>
                        </Box>
                    </Box>
                </div>
                <div className="Column">
                    <div id="myBox" className ="hidden-box">
                        {loadTask()}
                    </div>
                </div>
            </div>
        );
    }
};

export default Calendar;