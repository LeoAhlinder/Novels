import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Header from "./header/header"
import Profile from "./Profile/Profile"
import BookPage from "./bookpage/bookpage"
import LogIn from "./logIn/logIn"
import Home from "./Home/Home"


function App() {
    return (
    <Router>
      <div>
      <Header/>
          <Routes>
            <Route exact path="/" Component={Home}/>
            <Route exact path="/Profile" Component={Profile}/>
            <Route exact path="/book" Component={BookPage}/>
            <Route exact path='/logIn' Component={LogIn}/>
          </Routes>
      </div>
    </Router>  
    );
}

export default App;
