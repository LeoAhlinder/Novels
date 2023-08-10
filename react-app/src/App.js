import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Header from "./header/header"
import Profile from "./Profile/Profile"
import BookPage from "./bookpage/bookpage"
import Login from "./logIn/logIn"


function App() {
    return (
    <Router>
      <div>
      <Header/>
          <Routes>
            <Route exact path="/Profile" Component={Profile}/>
            <Route exact path="/book" Component={BookPage}/>
            <Route exact path='/logIn' Component={Login}/>
          </Routes>
      </div>
    </Router>  
    );
}

export default App;
