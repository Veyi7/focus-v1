import { useNavigate } from 'react-router-dom';
import { signInWithRedirect, signInWithPopup } from "firebase/auth";
import { getAuth, getRedirectResult, GoogleAuthProvider } from "firebase/auth";

const Login = () => {

    const navigate = useNavigate();

    const handleRedirect = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        signInWithRedirect(auth, provider);
        navigate('/home');
        
    }

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
            <h2>Iniciar sesión con Google</h2>
            {/* <button onClick={handleRedirect}>Iniciar sesión con Google</button> */}
            <button onClick={handlePopUp}>Iniciar sesión en un PopUp</button>
        </div>
    );
};

export default Login;