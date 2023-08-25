import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Header from "./header/header"
import Profile from "./Profile/Profile"
import BookPage from "./bookpage/bookpage"
import LogIn from "./logIn/logIn"
import Home from "./Home/Home"
import Create from "./Create/create"
import CreateNew from "./Create/createNew"
import SearchBar from './Search/search';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path='/Search' element={<SearchBar />}/>
          <Route path="/create" element={<Create />}/>
          <Route path="/createNovel" element={<CreateNew />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
