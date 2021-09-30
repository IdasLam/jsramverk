import './App.css'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Home from './views/home'
import Login from './views/login'
import { isLoggedIn } from './helpers/login'
import { root } from './helpers/root'

function App() {
    const loggedIn = isLoggedIn()

    const loggedin = !loggedIn?.data?.authorized && !loggedIn.isLoading

    return (
        <Router>
            {loggedin && <Redirect to={root} />}
            <Switch>
                <Route exact path={root}>
                    <Login />
                </Route>
                <Route exact path={`${root}doc`}>
                    <Home />
                </Route>
            </Switch>
        </Router>
    )
}

export default App
