import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import DataGridPage from "./DataGridPage.js";
import DetailPage from "./DetailPage.js";
function App() {
  return (

    <Routes>
      <Route path="/" element={<DataGridPage />} />
      <Route path="/detailPage" element={<DetailPage />} />
    </Routes>
  );
}

export default App;
