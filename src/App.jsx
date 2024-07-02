import { useState } from 'react';
import Global from './context/Global';

function App()
{
  const [ count, setCount ] = useState(0);

  return (
    <>
      <Global />
    </>
  );
}

export default App;
