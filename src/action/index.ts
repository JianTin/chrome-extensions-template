import {render} from 'react-dom'
import {createElement} from 'react'
import App from './app'

console.log(
    chrome.i18n.getMessage('name')
)
render(createElement(App), document.getElementById('app'))