import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./initializeAuth";
import { AppRouter } from "./AppRouter";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    async function init() {
      await initializeAuth()(dispatch);
    }

    init();
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
