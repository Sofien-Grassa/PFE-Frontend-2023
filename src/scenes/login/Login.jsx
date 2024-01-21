import React, { useState, Fragment } from 'react'
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import '../../App.css';
import Topbar from "../../scenes/global/Topbar";

        const Login = ({ onLoginSuccess }) => {
            const [Login, setLogin] = useState("");
            const [Password, setPassword] = useState("");
            const apiUrl = "https://localhost:7010/api/Login/login";
            const IsValidate = () => {
                let isproceed = true;
                let errormessage = 'Please enter the value in ';

                if (Password === null || Password === '') {
                    isproceed = false;
                    errormessage += ' Password';
                }
                if (Login === null || Login === '') {
                    isproceed = false;
                    errormessage += ' Login';
                }

                if (!isproceed) {
                    toast.warning(errormessage)
                }
                return isproceed;
            }

            const validateLogin = async () => {
                if (IsValidate()) {
                    const data = { Login: Login, Password: Password };
                    try {
                        const result = await axios.post(apiUrl, data);
                        console.log(result.data);
                        if (result.status === 200) {
                            toast.success("ok user exist");
                            return result;
                        }
                    } catch (error) {
                        toast.error("You need to register");
                        return null;
                    }
                }
                return null;
            };

            const handleLoginSubmit = async (event) => {
                event.preventDefault();

                const result = await validateLogin();

                if (result) {
                    onLoginSuccess(result.data.userId); // Ajoutez l'ID de l'utilisateur ici
                }
            };



            return (
                <Fragment>
                    <Topbar showLogout={false} /> 
                    <ToastContainer />
                    <div className="main">
                        <div className="sub-main">
                            <div>
                                <div className="imgs">
                                    <div className="container-image">
                                        <img src="/assets/a.png" alt="profile" className="profile" />
                                    </div>
                                </div>
                                <div>
                                    <a className="large-heading">Login Page</a>
                                    <form onSubmit={handleLoginSubmit}>

                                    <div>
                                        <img src="/assets/login.png" alt="email" className="email" />
                                            <input type="text" name="Login" value={Login} onChange={(e) => setLogin(e.target.value)} className="name login-input" placeholder="Login" />
                                    </div>
                                    <div className="second-input">
                                        <img src="/assets/pass.png" alt="pass" className="pass" />
                                            <input type="Password" name="Password" onChange={(e) => setPassword(e.target.value)} value={Password} className="name login-input" placeholder="Password" />
                                    </div>

                                    <div>
                                            <button className="login-button" type="submit"> Login </button>&nbsp;&nbsp;
                                    </div>

                                    </form>


                                </div>
                            </div>
                        </div>
                    </div>

                </Fragment>

            );
}

export default Login;