import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import Home from './views/home'
import Login from './views/login'

const queryClient = new QueryClient()
function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Login />
                    </Route>
                    {localStorage.getItem('token') && (
                        <Route exact path="/doc">
                            <Home />
                        </Route>
                    )}
                </Switch>
            </Router>
        </QueryClientProvider>
    )
}

export default App
