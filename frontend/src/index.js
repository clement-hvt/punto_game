import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {RequireAuth} from "./requireAuth";
import 'bootstrap-dark-5/dist/css/bootstrap-night.min.css';
import Connection from "./components/connection";
import Registration from "./components/registration";
import Board from "./components/board";
import Card from "./components/card";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path='/connexion' element={<Connection />}/>
              <Route path='/inscription' element={<Registration />}/>
              <Route path='/board' element={<Board />}/>
              <Route path='/card' element={<Card />}/>
              <Route
                  path='/game/*'
                  element={
                    <RequireAuth>
                        <Route path='/new' />
                    </RequireAuth>
                  }
              />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);