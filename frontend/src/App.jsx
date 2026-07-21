import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import AddSamajPage from './components/AddSamajPage';

function App() {
  const [page, setPage] = useState('add-samaj');

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{ duration: 3500 }}
      />
      {page === 'home' ? (
        <Home onNavigate={setPage} />
      ) : (
        <AddSamajPage onNavigate={setPage} />
      )}
    </>
  );
}

export default App;
