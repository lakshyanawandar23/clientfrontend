import {BrowserRouter,Route,Routes} from 'react-router-dom'
import LoginScreen from './components/Login';
import HomeScreen from './components/home';
import Transaction from './components/transcation';
import AdminPanel from './components/Admin';
function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<LoginScreen></LoginScreen>}></Route>
    <Route path="/home" element={<HomeScreen></HomeScreen>} ></Route>
    <Route path="/transaction" element={<Transaction></Transaction>}></Route>
    <Route path="/admin" element={<AdminPanel></AdminPanel>} ></Route>
  </Routes>
    </BrowserRouter>
  );
}

export default App;