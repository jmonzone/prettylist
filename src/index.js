import './index.scss';

export default class PrettyList {
  constructor(list) {
    list.classList.add('prettylist');
    console.log(list.className);
  }
}

