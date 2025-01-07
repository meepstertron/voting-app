import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Vote from './vote';
import Editor from './Editor';
import { Toaster } from "@/components/ui/toaster";

const Home = () => <h1>Home</h1>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote/:pollid" element={<Vote />} />
        <Route path='/editor' element={<Editor />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;