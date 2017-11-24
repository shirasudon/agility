import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { compose, withState, withHandlers } from 'recompose'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import { withStyles } from 'material-ui/styles'

import { login as loginAction } from '../actions/AuthActions'
import { toJS } from './ToJS'

const styleSheet = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  loginButton: {
    marginTop: theme.spacing.unit,
  },
})

export const withLoginFailState = withState('loginFail', 'setLoginFail', false)
export const withUserState = withState('user', 'setUser', {
  username: '',
  password: '',
})

export const handlerFunctions = {
  /**
   * This method get called when username or password changes.
   * Internally it synchronizes the values of input boxes with component's state.
   * @param e event object
   */
  handleChange: ({ setUser, user }) => event => {
    const { value, name } = event.target
    const newState = Object.assign({}, user)
    newState[name] = value
    setUser(newState)
  },
  /**
   * This method get called when login button is pressed.
   * It validates the username and password. Upon successful login, user will be redirected to chat page.
   * Otherwise, stuck on the same page.
   * @param e event object
   */
  handleSubmit: ({ login, user, setUser, setLoginFail }) => event => {
    event.preventDefault()
    return login(user).then(success => {
      if (!success) {
        setLoginFail(true)
      }
    })
  },
}

export const withLoginHandlers = withHandlers(handlerFunctions)

export const Login = ({
  handleChange,
  handleSubmit,
  user: { username, password },
  loginFail,
  authenticated,
  sessionUser,
  classes,
}) => {
  if (authenticated && Object.keys(sessionUser).length > 0) {
    return <Redirect to="/chat" />
  }

  return (
    <div>
      <Grid container justify="center">
        {loginFail && (
          <strong className="error">
            Wrong username or password! Please try again!
          </strong>
        )}
        <TextField
          name="username"
          label="ユーザー名"
          value={username}
          className={classes.textField}
          onChange={handleChange}
          margin="normal"
        />
      </Grid>
      <Grid container justify="center">
        <TextField
          name="password"
          type="password"
          label="パスワード"
          value={password}
          className={classes.textField}
          onChange={handleChange}
          margin="normal"
        />
      </Grid>
      <Grid container justify="center">
        <Button
          color="primary"
          raised
          onClick={handleSubmit}
          className={classes.loginButton}
        >
          ログイン
        </Button>
      </Grid>
    </div>
  )
}

export const mapStateToProps = state => ({
  authenticated: state.getIn(['session', 'authenticated']),
  sessionUser: state.getIn(['session', 'user']),
})

export const mapDispatchToProps = dispatch => {
  return {
    login: (user, cb) => {
      return dispatch(loginAction(user, cb))
    },
  }
}

export const enhancer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  toJS,
  withLoginFailState,
  withUserState,
  withLoginHandlers,
  withStyles(styleSheet)
)

export default enhancer(Login)
