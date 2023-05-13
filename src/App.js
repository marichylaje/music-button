import React, { useState, useEffect } from 'react';
import './App.css';
import Searcher from './Searcher.js';

const colorList = [
  '#fdcae1',
  '#84b6f4',
  '#fdfd96',
  '#fdf9c4',
  '#b2e2f2',
  '#e79eff'
];

const App = () => {
  const [buttons, setButtons] = useState([]);
  const [usedColors, setUsedColors] = useState([]);
  const [inputData, setInputData] = useState({
    nombre: '',
    url: '',
    inicio: '',
    fin: ''
  });
  const [bgColor, setBgColor] = useState('');

  const handleButtonClick = () => {
    let randomColor = '';
    let colorFound = false;

    while (!colorFound) {
      randomColor = () => colorList[Math.floor(Math.random() * colorList.length)];
      if (!usedColors.includes(randomColor)) {
        colorFound = true;
      }
    }

    setBgColor(randomColor);

    const updatedButtons = buttons.map((button) => ({
      ...button,
      color: randomColor
    }));

    setButtons(updatedButtons);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const { nombre, url, inicio, fin } = inputData;
    if (nombre && url && inicio && fin) {
      let randomColor = '';
      let colorFound = false;

      while (!colorFound) {
        randomColor = colorList[Math.floor(Math.random() * colorList.length)];
        if (!usedColors.includes(randomColor)) {
          colorFound = true;
        }
      }

      const newItem = {
        nombre: inputData.nombre,
        color: randomColor
      };

      setButtons([...buttons, newItem]);
      setInputData({ nombre: '', url: '', inicio: '', fin: '' });
      setUsedColors([...usedColors, randomColor]);
    }
  };

  const CLIENT_ID=process.env.REACT_APP_SPOTIFY_CLIENT_ID
  const REDIRECT_URI =process.env.REACT_APP_SPOTIFY_REDIRECT_URI 
  const AUTH_ENDPOINT =process.env.REACT_APP_SPOTIFY_AUTH_ENDPOINT 
  const RESPONSE_TYPE = process.env.REACT_APP_SPOTIFY_RESPONSE_TYPE

   const [token, setToken] = useState("");

   useEffect(() => { 
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");
  
        if (hash && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
            window.location.hash = "";
            window.localStorage.setItem("token", token);
        }

        setToken(token)
    }, [])

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
    }

  return (
    <div className="App">
      <div className="top-section" style={{ backgroundColor: bgColor }}>
      {!token ? 
              <div > 
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
                 Login to Spotify
               </a>
              </div> 
              :
              <div> 
                <Searcher token={token} />
                <button className= "logOut"onClick={logout}>Logout</button> 
              </div >
            }
        {buttons.map((item, index) => (
          <button
            key={index}
            style={{ backgroundColor: item.color, display: "block" }}
            onClick={handleButtonClick}
          >
            {item.nombre}
          </button>
        ))}
      </div>
      <div className="bottom-section">
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={inputData.nombre}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="url"
            placeholder="URL"
            value={inputData.url}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="inicio"
            placeholder="Inicio"
            value={inputData.inicio}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="fin"
            placeholder="Fin"
            value={inputData.fin}
            onChange={handleInputChange}
          />
          <button type="submit">Agregar</button>
        </form>
      </div>
    </div>
  );
};

export default App;
