import React, { Component } from 'react';

const moduleDefaultExport = module => module.default || module;

export default function asyncRoute(getComponent) {
  return class AsyncRoute extends Component {
    static Component = null;

    state = {
      Component: AsyncRoute.Component
    };

    componentWillMount() {
      if (!this.state.Component) {
        getComponent().then(moduleDefaultExport).then(Component => {
          AsyncRoute.Component = Component;

          if (this._mounted) {
            this.setState({ Component });
          } else {
            this.state.Component = Component;
          }
        });
      }
    }

    componentDidMount() {
      this._mounted = true;
    }

    render() {
      const { Component } = this.state;
      return Component ? <Component {...this.props} /> : null;
    }
  };
}
