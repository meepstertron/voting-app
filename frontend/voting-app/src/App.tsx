import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Vote from './vote';
import Editor from './Editor';
import { Toaster } from "@/components/ui/toaster";
import Poll from './Poll';

const Home = () => <h1>Home</h1>;

function App() {
  if (localStorage.getItem('uuid') === null) {
    localStorage.setItem('uuid', crypto.randomUUID());
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote/:pollid" element={<Vote />} />
        <Route path='/editor' element={<Editor />} />
        <Route path="/poll/:pollid" element={<Poll />} />
        <Route path='*' element={<h1>404</h1>} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;