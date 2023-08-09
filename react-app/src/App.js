import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Header from "./header/header"
import Profile from "./Profile/Profile"
import BookPage from "./bookpage/bookpage"


function App() {
    return (
    <Router>
      <div>
      <Header/>
          <Routes>
            <Route exact path="/Profile" Component={Profile}/>
            <Route exact path="/book" Component={BookPage}/>
          </Routes>
      </div>
    </Router>  
    );
}

export default App;
