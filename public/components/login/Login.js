import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { useTranslation } from 'react-i18next';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const Login = () => {
    const { t, i18n } = useTranslation('global');

    const [language, setLanguage] = React.useState('en');

    const handleChange = (event) => {
        setLanguage(event.target.value);

        i18n.changeLanguage(event.target.value);
    };

    const navigate = useNavigate();

    const signInWithPopUp = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        await signInWithPopup(auth, provider)
        .then((result) => {
            console.log('Inicio de sesión exitoso');
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            localStorage.setItem("userInfo", user.uid);

            navigate('/home');
        }).catch((error) => {
            console.log('Error al iniciar sesión con Google', error);
        });
    }

    const handlePopUp = () => {
        signInWithPopUp();
    }

    return (
        <div>
            <div className='flex w-full justify-between items-center h-24 max-w-[1240px] mx-auto px-4 shadow-sm'>
                <h1 className='text-4xl font-bold text-[#2196f3]'>
                    { "Focus" }
                </h1>
                <ul className='flex'>
                    <li className='px-4 py-5'>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">{ t("login.language") }</InputLabel>
                            <Select
                                value={language}
                                label="language"
                                onChange={handleChange}
                            >
                            <MenuItem value={'en'}>English</MenuItem>
                            <MenuItem value={'es'}>Español</MenuItem>
                            <MenuItem value={'cat'}>Català</MenuItem>
                            </Select>
                        </FormControl>
                    </li>
                    
                    <li className='hidden md:block px-5 py-5 items-center'>
                        <button onClick={handlePopUp} className='@apply transition-[background-color] duration-[0.3s,box-shadow] delay-[0.3s] shadow-[0_-1px_0_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.25)] text-[#757575] text-sm font-medium bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=)] bg-[white] bg-no-repeat bg-[12px_17px] pl-[42px] pr-6 py-3 rounded-[3px] border-[none] hover:shadow-[0_-1px_0_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.25)] active:bg-[#eeeeee]
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'>
                                { t("login.button-text") }
                        </button>
                    </li>
                </ul>
                
            </div>
            <div>
                <h3 className='md:text-3xl sm:text-xl text-lg font-bold py-3 lg:py-12 xl:py-12'>{t("login.title")}</h3>
            </div>
            <div className='flex w-full justify-between items-center max-w-[1240px] mx-auto px-6 py-3 lg:py-12 xl:py-12'>
                <div className='mx-auto max-w-[620px]'>
                    <h5 className='text-justify md:text-xl sm:text-sm text-sm'>{t("login.text-1")}</h5>
                    <h5 className='text-justify md:text-xl sm:text-sm text-sm'>{t("login.text-2")}</h5>
                    <h5 className='text-justify md:text-xl sm:text-sm text-sm'>{t("login.text-3")}</h5>
                </div>
                <div className='hidden md:block mx-auto'>
                    <h5 className='text-justify md:text-xl font-bold'>{t("login.start-by")}</h5>
                    <button onClick={handlePopUp} className='@apply transition-[background-color] duration-[0.3s,box-shadow] delay-[0.3s] shadow-[0_-1px_0_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.25)] text-[#757575] text-sm font-medium bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=)] bg-[white] bg-no-repeat bg-[12px_17px] pl-[42px] pr-6 py-3 rounded-[3px] border-[none] hover:shadow-[0_-1px_0_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.25)] active:bg-[#eeeeee]
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'>
                            { t("login.button-text") }
                    </button>
                </div>
            </div>
            <br/>
            <div className='sm:block md:hidden lg:hidden xl:hidden'>
                <button onClick={handlePopUp} className='@apply transition-[background-color] duration-[0.3s,box-shadow] delay-[0.3s] shadow-[0_-1px_0_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.25)] text-[#757575] text-sm font-medium bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=)] bg-[white] bg-no-repeat bg-[12px_17px] pl-[42px] pr-6 py-3 rounded-[3px] border-[none] hover:shadow-[0_-1px_0_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.25)] active:bg-[#eeeeee]
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'>
                        { t("login.button-text") }
                </button>
            </div>
        </div>
    );
};

export default Login;