import './index.scss';

export default class PrettyList {
  constructor(items, container, options) {

    this.items = items;
    this.list = document.createElement('div');
    this.list.classList.add('prettylist');
    container.append(this.list);

    this.options = {
      visible: 3,
      rotation: 1,
      opacity: 0.3,
      direction: "vertical",
      loop: true,
    }

    Object.assign(this.options, options);

    this.rotation = this.options.rotation;
    this.visible = this.options.visible;
    this.direction = this.options.direction;

    if (this.visible > this.items.length) console.error(`PRETTYLIST: you are asking for ${this.visible} items to be visible, but you only have ${this.items.length} items.`);

    this.currentIndex = 0;

    // init items
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      item.classList.add('prettylist-item');
      item.classList.add('hidden');
      this.list.appendChild(item);
    }


    //todo i hate this
    this.offset = 0.5;
    this.y = this.offset;
    this.sensitivity = 0.001;

    this.scroll = this.scroll.bind(this);
    this.update = this.update.bind(this);
    this.list.addEventListener('wheel', this.scroll);
    window.addEventListener('DOMContentLoaded', this.update);
  }

  setRotation(value) {
    this.rotation = value;
    this.update();
  }

  setVisible(value) {
    for (let i = 0; i < this.items.length; i += 1) {
      this.items[i].classList.add('hidden');
    }
    this.visible = parseInt(value);
    this.update();
  }

  setDirection(value) {
    this.direction = value;
    this.update();
  }

  scroll({deltaY}) {
    
    this.y += deltaY * this.sensitivity;
    
    if (this.y > 1) this.increment();
    else if (this.y < 0) this.decrement();

    this.y = (this.y + 1) % 1;
    this.update();
  }

  increment() {
    if (this.options.loop == false && this.currentIndex == this.items.length - this.visible) return;

    this.items[this.currentIndex].classList.add('hidden');
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  decrement() {
    if (this.options.loop == false && this.currentIndex == 0) return;

    const itemIndex = (this.currentIndex + this.visible - 1) % this.items.length;
    this.items[itemIndex].classList.add('hidden');
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
  }

  update() {

    const angle = 0;

    for (let i = -1; i < this.visible + 1; i += 1) {
      const itemIndex = (i + this.currentIndex + this.items.length) % this.items.length;

      const item = this.items[itemIndex];
      if (i >= 0 && i < this.visible ) item.classList.remove('hidden');

      let rotation = (this.rotation * ((this.visible - 1) * 0.5) - this.rotation * (i - this.y + 0.5));
      let top = (100 / (this.visible + 1)) * (i + 1.5 - this.y) * 0.01 * this.list.offsetHeight;
      let left = (this.list.offsetWidth)- (this.list.offsetWidth/ 2) * Math.cos(rotation * Math.PI/ 180);

      if (this.direction == 'horizontal') {
        rotation *= -1;
        left = (i + 1 - this.y + this.offset) * (this.list.offsetWidth / (this.visible + 1));
        top = this.list.offsetHeight / 2 + this.list.offsetHeight - (this.list.offsetHeight) * Math.cos(rotation * Math.PI/ 180);
      }
      
      item.style.setProperty('--rotation', rotation + "deg");
      item.style.setProperty('--left', left + "px");
      item.style.setProperty('--top', top + "px");
      
      const opacity =  1 - (Math.abs((i - ((this.visible - 1) * 0.5))) * this.options.opacity);
      item.style.setProperty('--opacity', opacity);
    }

    // for (let i = -1; i < this.visible + 1; i += 1) {
    //   const itemIndex = (i + this.currentIndex + this.items.length) % this.items.length;

    //   const item = this.items[itemIndex];
    //   if (i >= 0 && i < this.visible ) item.classList.remove('hidden');

    //   const rotation = this.rotation * ((this.visible - 1) * 0.5) - this.rotation * (i - this.y + 0.5);
    //   item.style.setProperty('--rotation', rotation + "deg");
      

      
    //   const opacity =  1 - (Math.abs((i - ((this.visible - 1) * 0.5))) * this.options.opacity);
    //   item.style.setProperty('--opacity', opacity);
    // }
   
  }
}

