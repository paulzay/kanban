import { useEffect, useState } from 'react';
import './App.css';
import Column from './components/Column/Column';
import { useQuery } from '@apollo/client';
import { LOAD_COLUMNS } from './Graphql/Queries';

function App() {
  const {loading, data} = useQuery(LOAD_COLUMNS);
  const [columns, setColumns] = useState([]);

  useEffect(()=> {
    if(data){
      setColumns(data.columns)
    }
  },[data])

  return (
    <div className="App">
      {loading ? <p>Loading...</p> : 
        columns.map((list, i) => (
          <Column id={list.columnId} text={list.name} key={list.columnId} index={i} 
          columnId={list.columnId}
          />
        ))
      }
    </div>
  );
}

export default App;
