module.exports = {
  // setSync: (u, key, payload) => u(key, () => payload),
  selectNetwork: (u, net) => {
    let reset = { status: 'loading', connected: false, type: '', network: '' }
    u('main.connection', connection => {
      connection.network = net
      connection.local = Object.assign({}, connection.local, reset)
      connection.secondary = Object.assign({}, connection.secondary, reset)
      return connection
    })
  },
  selectSecondary: (u, direction) => {
    if (direction === '->') {
      u('main.connection', connection => {
        let options = Object.keys(connection.secondary.settings[connection.network].options)
        let index = options.indexOf(connection.secondary.settings[connection.network].current) + 1
        if (index >= options.length) index = 0
        connection.secondary.settings[connection.network].current = options[index]
        return connection
      })
    } else if (direction === '<-') {
      u('main.connection', connection => {
        let options = Object.keys(connection.secondary.settings[connection.network].options)
        let index = options.indexOf(connection.secondary.settings[connection.network].current) - 1
        if (index < 0) index = options.length - 1
        connection.secondary.settings[connection.network].current = options[index]
        return connection
      })
    }
  },
  setSecondaryCustom: (u, target) => {
    u('main.connection', connection => {
      connection.secondary.settings[connection.network].options.custom = target
      return connection
    })
  },
  toggleConnection: (u, node) => u('main.connection', node, 'on', on => !on),
  setLocal: (u, status) => u('main.connection.local', local => Object.assign({}, local, status)),
  setSecondary: (u, status) => u('main.connection.secondary', secondary => Object.assign({}, secondary, status)),
  setLaunch: (u, launch) => u('main.launch', _ => launch),
  toggleLaunch: u => u('main.launch', launch => !launch),
  toggleReveal: u => u('main.reveal', reveal => !reveal),
  clearPermissions: (u, account) => {
    u('main.accounts', account, account => {
      account.permissions = {}
      return account
    })
  },
  giveAccess: (u, req, access) => {
    u('main.accounts', req.account, account => {
      account = account || { permissions: {} }
      account.permissions[req.handlerId] = { handlerId: req.handlerId, origin: req.origin, provider: access }
      return account
    })
  },
  toggleAccess: (u, account, handlerId) => {
    u('main.accounts', account, account => {
      account.permissions[handlerId].provider = !account.permissions[handlerId].provider
      return account
    })
  },
  syncPath: (u, path, value) => {
    if (!path || path === '*' || path.startsWith('main')) return // Don't allow updates to main state
    u(path, () => value)
  }
}
