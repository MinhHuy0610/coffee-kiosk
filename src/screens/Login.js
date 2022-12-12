/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Card } from '@material-ui/core'
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function Login({ setToken, setRole, setUserId, setShopId }) {
  const [inputs, setInputs] = useState({});
  const [inputsUser, setInputsUser] = useState({});
  const [layoutName, setLayoutName] = useState("default");
  const [inputName, setInputName] = useState("default");
  const keyboard = useRef();

  const userRef = useRef()
  const errRef = useRef()

  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [username, password])

  const onChangeAll = inputs => {
    setInputs({ ...inputs });
    console.log("Inputs changed", inputs);
  };
  const handleShift = () => {
    const newLayoutName = layoutName === "default" ? "shift" : "default";
    setLayoutName(newLayoutName);
  };
  const onKeyPress = button => {
    console.log("Button pressed", button);
    if (button === "{shift}" || button === "{lock}") handleShift();
  };
  // const onChangeUserInput = event => {
  //   const inputVal = event.target.value;
  //   setUsername(event.target.value)
  //   setInputsUser({
  //     ...inputsUser,
  //     [inputName]: inputVal
  //   });

  //   keyboard.current.setInput(inputVal);
  // };
  const onChangeInput = event => {
    const inputVal = event.target.value;
    // setPassword(event.target.value)
    setInputs({
      ...inputs,
      [inputName]: inputVal
    });

    keyboard.current.setInput(inputVal);
  };
  const getInputValue = inputName => {
    return inputs[inputName] || "";
  };
  async function loginUser(credentials) {
    console.log(credentials)
    console.log(JSON.stringify(credentials))
    return fetch('https://localhost:44361/api/v1/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.status)
        else {
          return response.json()
        }
      })
      .catch((error) => {
        console.log(error)
        if (error.status === 404) {
          setErrMsg('Tên đăng nhập hoặc mật khẩu không chính xác')
        } else {
          setErrMsg('Tên đăng nhập hoặc mật khẩu không chính xác')
        }
        errRef.current.focus()
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const username = e.target.username.value;
    const password = e.target.password.value;
    console.log(username)
    console.log(password)
    const data = await loginUser({
      username,
      password,
    })
    console.log(data)
    if (!data) {
      setToken('')
      setRole('')
    } else {
      // var obj = JSON.parse(JSON.stringify(data))
      console.log(data.data)
      setToken(data.data.token)
      setShopId(data.data.shopId)
      setRole(data.data.roleName)
      setUserId(data.data.id)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      {/* <CCardGroup> */}
      <Card className="p-4 align-items-center">
        <form onSubmit={handleSubmit}>
          <h1>Đăng nhập</h1>
          <p
            ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <input
            type="text"
            id="username"
            ref={userRef}
            value={getInputValue("username")}
            onFocus={() => setInputName("username")}
            onChange={onChangeInput}
            className="input"
            placeholder="Tài Khoản"
            required
          />
          {/* <CFormInput
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      placeholder="Tài Khoản"
                      feedbackInvalid="Vui lòng nhập tài khoản"
                      required
                    /> */}
          <input
            type="password"
            id="password"
            value={getInputValue("password")}
            onFocus={() => setInputName("password")}
            onChange={onChangeInput}
            className="input"
            placeholder="Mật Khẩu"
            required
          />
          <button color="primary" className="px-4" type="submit">
            Đăng Nhập
          </button>
          <Keyboard
            keyboardRef={r => (keyboard.current = r)}
            inputName={inputName}
            layoutName={layoutName}
            onChangeAll={onChangeAll}
            onKeyPress={onKeyPress}
          />
        </form>
      </Card>
    </div>
  )
}
Login.propTypes = {
  setToken: PropTypes.func.isRequired,
}
Login.propTypes = {
  setRole: PropTypes.func.isRequired,
}
Login.propTypes = {
  setUserId: PropTypes.func.isRequired,
}
Login.propTypes = {
  setShopId: PropTypes.func.isRequired,
}
