import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const rootEl = document.getElementById('root');

const render = (Root: React.ComponentClass): void => {
    ReactDOM.render(
        <AppContainer>
            <Root />
        </AppContainer>,
        rootEl,
    );
};

declare global {
    interface NodeModule {
        hot:
            | {
                  accept(path: string, callback: () => void): any;
              }
            | undefined;
    }
}

render(App);

if (module.hot) {
    module.hot.accept('./App', () => {
        render(require('./App').default);
    });
}

registerServiceWorker();
