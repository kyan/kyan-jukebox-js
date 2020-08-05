import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

class Worker {
  constructor(stringUrl) {
    this.url = stringUrl
    this.onmessage = () => {}
    this.addEventListener = () => {}
  }

  postMessage(msg) {
    this.onmessage(msg)
  }
}
window.Worker = Worker

function noOp() {}

if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: noOp })
}
