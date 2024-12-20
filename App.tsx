import React, {useEffect} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import AppNavigator from './src/navigation/AppNavigator';
import {requestUserPermission, NotificationListener} from './src/utils/helpers';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    requestUserPermission();
    NotificationListener();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
    </QueryClientProvider>
  );
};

export default App;
