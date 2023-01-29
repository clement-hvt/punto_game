import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {RequireAuth} from "./requireAuth";
import 'bootstrap-dark-5/dist/css/bootstrap-night.min.css';
import 'bootstrap-dark-5/dist/css/bootstrap.min.css'
import Connection from "./components/connection";
import Registration from "./components/registration";
import Board from "./components/board";
import Card from "./components/card";
import SignInGame from "./components/signin-game";
import {ProvideAuth} from "./hooks/use-auth";
import Game from "./components/game";
import GlobalDndContext from "./components/global-dnd-context";

const root = ReactDOM.createRoot(document.getElementById('root'));
const game = new Game('63d117c6ebeb0b8fdb1e5dbb')
root.render(
  <React.StrictMode>
      <ProvideAuth>
          <BrowserRouter>
              <Routes>
                  <Route path='/connexion' element={<Connection />}/>
                  <Route path='/inscription' element={<Registration />}/>
                  <Route path='/board' element={
                      <GlobalDndContext>
                        <Board game={game}/>
                      </GlobalDndContext>
                  }/>
                  <Route path='/card' element={<Card />}/>
                  <Route path='/signin' element={<SignInGame />}/>
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
      </ProvideAuth>

  </React.StrictMode>
);