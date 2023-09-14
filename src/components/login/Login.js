import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Typography } from '@mui/material';

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
            <Box>
                <Typography variant='h2' >
                    { t("login.title") }
                </Typography>
                <br />
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
            </Box>
            <button onClick={handlePopUp}>{ t("login.button-text") }</button>
        </div>
    );
};

export default Login;