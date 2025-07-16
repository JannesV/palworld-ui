import GameMap from "./components/GameMap";
import { QueryClientProvider } from "@tanstack/react-query";
import { PlayerList } from "./components/PlayerList";
import { Provider } from "./components/ui/provider";
import { queryClient } from "./utils/trpc";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <Provider value={{}}>
      <QueryClientProvider client={queryClient}>
        <Box w="vw" h="vh">
          <GameMap />
        </Box>
        <PlayerList />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
