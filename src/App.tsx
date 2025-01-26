import {  useState } from 'react';
import './App.css';
import CharacterSheet from './components/CharacterSheet'

function App() {
  const [characters, setCharacters] = useState([1])

  const addChar = () => {
    setCharacters((prev) => [...prev, prev.length+1])
  }

  return (
    <div className='App-section'>
    <button onClick={() => addChar()} >Add New Character</button>
    {
      characters.map((char) => <CharacterSheet charName={char} key={char} />)
    }
    </div>
)}

export default App;
