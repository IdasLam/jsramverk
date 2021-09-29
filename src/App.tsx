import './App.css'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Home from './views/home'
import Login from './views/login'
import { isLoggedIn } from './helpers/login'

function App() {
    const loggedIn = isLoggedIn()

    const loggedin = !loggedIn?.data?.authorized && !loggedIn.isLoading

    return (
        <Router>
            {loggedin && <Redirect to="/" />}
            <Switch>
                <Route exact path="/">
                    <Login />
                </Route>
                <Route exact path="/doc">
                    <Home />
                </Route>
            </Switch>
        </Router>
    )
}

export default App
