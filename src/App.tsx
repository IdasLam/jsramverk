import './App.css'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useJwt } from 'react-jwt'

import Home from './views/home'
import Login from './views/login'

const queryClient = new QueryClient()
function App() {
    const { isExpired } = useJwt(localStorage.getItem('token') ?? '')

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                {isExpired && <Redirect to="/" />}
                <Switch>
                    <Route exact path="/">
                        <Login />
                    </Route>
                    <Route exact path="/doc">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </QueryClientProvider>
    )
}

export default App
