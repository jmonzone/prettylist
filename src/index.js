import './index.scss';

export default class PrettyList {
  constructor(items, options) {

    this.items = items;
    this.list = document.createElement('div');
    this.list.classList.add('prettylist');

    this.options = {
      visible: 3,
      rotation: 1,
      opacity: 0.3,
      loop: true,
    }

    Object.assign(this.options, options);

    if (this.options.visible > this.items.length) console.error(`PRETTYLIST: you are asking for ${this.options.visible} items to be visible, but you only have ${this.items.length} items.`);

    this.currentIndex = 0;

    // init items
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      item.classList.add('prettylist-item');
      item.classList.add('hidden');
      this.list.appendChild(item);
    }

    this.styleVisibleItems();


    //todo i hate this
    this.canScroll = true;
    this.onWheel = this.onWheel.bind(this);
    this.list.addEventListener('wheel', this.onWheel);
  }

  onWheel({deltaY}) {
    if (!this.canScroll) return;
    
    if (deltaY > 0) {
      this.increment();
    }
    else {
      this.decrement();
    }

    this.canScroll = false;
    setTimeout(() => this.canScroll = true, 1000);
  }

  increment() {
    if (this.options.loop == false && this.currentIndex == this.items.length - this.options.visible) return;

    this.items[this.currentIndex].classList.add('hidden');
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.styleVisibleItems();
  }

  decrement() {
    if (this.options.loop == false && this.currentIndex == 0) return;

    const itemIndex = (this.currentIndex + this.options.visible - 1) % this.items.length;
    this.items[itemIndex].classList.add('hidden');
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.styleVisibleItems();
  }

  styleVisibleItems() {
    for (let i = 0; i < this.options.visible; i += 1) {
      const itemIndex = (i + this.currentIndex) % this.items.length;
      const item = this.items[itemIndex];
      item.classList.remove('hidden');

      const rotation = this.options.rotation * ((this.options.visible - 1) * 0.5) - this.options.rotation * i;
      item.style.setProperty('--rotation', rotation + "deg");
      
      const top = (100 / (this.options.visible + 1)) * (i + 1);
      item.style.setProperty('--top', top + "%");

      const left = 100 - 100 * Math.cos(rotation * Math.PI/ 180);
      item.style.setProperty('--left', left + "%");
      
      const opacity =  1 - (Math.abs((i - ((this.options.visible - 1) * 0.5))) * this.options.opacity);
      item.style.setProperty('--opacity', opacity);
    }

    if (this.items.length > this.options.visible) {
      const pre = this.items[ (this.currentIndex - 1 + this.items.length) % this.items.length];
      pre.style.setProperty('--top', "0%");
      const prerotation = this.options.rotation * ((this.options.visible + 1) * 0.5);
      pre.style.setProperty('--rotation', prerotation + "deg");
      const preleft = 100 - 100 * Math.cos(prerotation * Math.PI/ 180);
      pre.style.setProperty('--left', preleft + "%");
  
      const post = this.items[ (this.currentIndex + this.options.visible) % this.items.length];
      post.style.setProperty('--top', "100%");
      const postrotation = this.options.rotation * ((this.options.visible - 1) * 0.5) - this.options.rotation * this.options.visible;
      post.style.setProperty('--rotation', postrotation + "deg");
      const postleft = 100 - 100 * Math.cos(postrotation * Math.PI/ 180);
      post.style.setProperty('--left', postleft + "%");
    }
   
  }
}

