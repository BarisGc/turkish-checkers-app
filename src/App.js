import './App.css';
import GameTable from './components/GameTable'
// import ScoreBar from './components/ScoreBar'
import { Container, Center } from '@chakra-ui/react'
function App() {
  return (
    <Container centerContent >
      <GameTable />
    </Container>
  );
}

export default App;
