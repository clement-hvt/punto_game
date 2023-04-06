import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {RequireAuth} from "./requireAuth";
import 'bootstrap-dark-5/dist/css/bootstrap-night.min.css';
import 'bootstrap-dark-5/dist/css/bootstrap.min.css'
import Connection from "./components/connection";
import Registration from "./components/registration";
import {ProvideAuth} from "./hooks/use-auth";
import GameRoutes from "./components/game/GameRoutes";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ProvideAuth>
          <BrowserRouter>
              <Routes>
                  <Route path='/connexion' element={<Connection />}/>
                  <Route path='/inscription' element={<Registration />}/>
                  <Route
                      path='/game/*'
                      element={
                          <RequireAuth>
                             <GameRoutes/>
                          </RequireAuth>
                      }
                  />
              </Routes>
          </BrowserRouter>
      </ProvideAuth>

  </React.StrictMode>
);