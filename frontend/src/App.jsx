import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AddSamajPage from './components/AddSamajPage';
import FamilyPage from './components/FamilyPage';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{ duration: 3500 }}
      />
      <Routes>
        <Route path="/" element={<AddSamajPage />} />
        <Route path="/family" element={<FamilyPage />} />
      </Routes>
    </>
  );
}

export default App;
