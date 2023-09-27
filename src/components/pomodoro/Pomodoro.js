import React, { useEffect, useState, useRef} from 'react'
import { Link } from 'react-router-dom';

//List Imports
import InboxIcon from '@mui/icons-material/Inbox';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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
//SignOutButton
import { getAuth, signOut } from "firebase/auth";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
//Settings
import Slider from '@mui/material/Slider';
//Timer
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import bellSound from './campana.mp3';

import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';

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

const RestSlider = styled(Slider)({
    color:'#009900',
    height: 10
});

const WorkSlider = styled(Slider)({
    height: 10
});

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

const Pomodoro = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [work, setWork] = useState(25);
    const [rest, setRest] = useState(5);
    const [isPaused, setIsPaused] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [mode, setMode] = useState('work');

    const [screenWakeLock, setScreenWakeLock] = useState(null);

    const requestScreenWakeLock = async () => {
        try {
            const wakeLock = await navigator.wakeLock.request('screen');
            setScreenWakeLock(wakeLock);
            console.log('Pantalla activa');
        } catch (error) {
            console.error('No se pudo mantener la pantalla activa: ', error);
        }
    };

    const releaseScreenWakeLock = () => {
        if (screenWakeLock) {
            screenWakeLock.release();
            setScreenWakeLock(null);
            console.log('Pantalla desactivada');
        }
    };

    const [audio] = useState(new Audio(bellSound));

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    const { t, i18n } = useTranslation('global');

    const [language, setLanguage] = React.useState('en');

    const handleChange = (lng) => {
        setLanguage(lng);

        i18n.changeLanguage(lng);
    };

    const progressBarColor = () => {
        if (mode === 'break') {
            return (<CircularProgressbar value={percentage} text={minutes+':'+seconds} styles={buildStyles({
                textColor: '#009900',
                pathColor: '#009900'
            })}/>);
        }
        else {
            return (<CircularProgressbar value={percentage} text={minutes+':'+seconds} styles={buildStyles({
                textColor: '#2196f3',
                pathColor: '#2196f3'
            })}/>);
        }
    }

    const Settings = () => {
        return(
            <div style={{textAlign:'left'}}>
                <div className='mx-auto my-4'>
                    <Typography variant="h5">{t("pomodoro.work-minutes")} {work}:00</Typography>
                    <WorkSlider aria-label="Work Minutes"
                        value={work}
                        valueLabelDisplay="auto"
                        step={5}
                        marks
                        min={10}
                        max={60}
                        onChange={(newValue) => setWork(newValue.target.value)}
                    />
                </div>
                <div className='mx-auto my-4'>
                    <Typography variant="h5">{t("pomodoro.rest-minutes")} {rest}:00</Typography>
                    <RestSlider aria-label="Rest Minutes"
                        value={rest}
                        valueLabelDisplay="auto"
                        step={1}
                        min={3}
                        max={20}
                        onChange={(newValue) => setRest(newValue.target.value)}
                    />
                </div>
                <Button variant="contained" onClick={() => setShowSettings(!showSettings)}>{t("pomodoro.confirm-button")}</Button>
                <Alert className="mx-10 my-10" severity="error"><h7>{t("pomodoro.error-ios")}</h7></Alert>
            </div>
        );
    }

    const Timer = () => {
        return (
            <div className='contenedor'>
                <Box sx={{width: '35%', bgcolor: 'background.paper'}}>
                    
                    {progressBarColor()}
    
                    <Stack sx={{ marginTop: '30px' }} justifyContent="center" direction="row" spacing={2}>
                        <IconButton onClick={() => {handleButtonClick()}}>
                            {handleButton()}
                        </IconButton>
                    </Stack>
                    <Button id="adjustments" sx={{ marginTop: '30px' }} variant="outlined" startIcon={<SettingsIcon />} onClick={() => {setShowSettings(!showSettings); handlePause(); initTimer(); releaseScreenWakeLock();}}>{t("pomodoro.adjustments-button")}</Button>
                </Box>
            </div>
            
        );
    }

    const handleButton = () => {
        if (isPaused) {
            return (<PlayArrowIcon/>);
        }
        else {
            return (<PauseIcon/>);
        }
    }

    function handleButtonClick() {
        if (isPaused) {
            handleStart();  
            requestScreenWakeLock();
            var boton = document.getElementById("adjustments");
            boton.disabled = true;
        }
        else {
            handlePause(); 
            releaseScreenWakeLock();
            var boton = document.getElementById("adjustments");
            boton.disabled = false;
        }
    }
    
    function handleStart() {
        setIsPaused(false);
        isPausedRef.current = false;
    }

    function handlePause() {
        setIsPaused(true);
        isPausedRef.current = true;
    }

    function initTimer() {
        setSecondsLeft(work * 60);
        secondsLeftRef.current = work*60;
    }

    function switchMode() {
        const nextMode = modeRef.current === 'work' ? 'break' : 'work';
        setMode(nextMode);
        modeRef.current = nextMode;

        const nextTime = nextMode === 'work' ? (work * 60) : (rest * 60);
        setSecondsLeft(nextTime);
        secondsLeftRef.current = nextTime;
    }   

    function tick() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }

    useEffect(() => {
        initTimer();

        const lng = localStorage.getItem("lng");
        if (language != lng) {
            handleChange(lng);
        }

        const interval = setInterval(() => {
            if (isPausedRef.current) {
                return;
            }

            if (secondsLeftRef.current === 0) {
                audio.play();
                return switchMode();
            }

            tick();
        }, 1000)

        return () => clearInterval(interval);
    }, [work, rest]);

    const totalseconds = mode === 'work' ? (work*60) : (rest*60);

    const percentage = Math.round((secondsLeftRef.current/totalseconds) * 100);

    const minutes = Math.floor(secondsLeftRef.current/60);
    let seconds = secondsLeftRef.current%60;
    if (seconds < 10) seconds = '0'+seconds;
    const navigate = useNavigate();

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

    return(
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
                        {t("header.pomodoros")}
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
                <Box sx={{ marginLeft: '20px', marginTop: '90px', width: '94%', bgcolor: 'background.paper' }}>
                    {showSettings ? Settings() : Timer()}
                </Box>
            </Box>                      
        </div>
    )
}

export default Pomodoro

