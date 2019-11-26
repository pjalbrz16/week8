import React from 'react'
import './App.css'
import Layout from './Layout'
import {ThemeProvider} from '../../contexts/Theme/Theme';
import { BrowserRouter as Router } from "react-router-dom";
const { ipcRenderer } = window.require('electron')

const IPC_MAIN_WEB_STATUS = "WebStatusChannel"

let onlineStatus

function App() {
  window.addEventListener('online', changeOnlineStatus)
  window.addEventListener('offline', changeOnlineStatus)
  return (
    <ThemeProvider>
        <Router>
            <Layout/>
        </Router>
    </ThemeProvider>    
  )
}

const changeOnlineStatus = () => {
  onlineStatus = navigator.onLine ? 'online' : 'offline'
  ipcRenderer.send(IPC_MAIN_WEB_STATUS, onlineStatus)
}

export default App;
