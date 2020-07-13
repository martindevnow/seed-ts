import React from 'react';
import './App.scss';
import { TextInput } from './components/ui/text-input/TextInput';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TextInput>Label</TextInput>
      </header>
    </div>
  );
}

export default App;
