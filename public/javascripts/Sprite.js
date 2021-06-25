import {ctx} from './main.js'

export default class Sprite {
  constructor(url, coords) {
    this.el = null; // Declare img element
    this.url = url;
    this.loaded = false; // bool to keep track of loading of img file
    this.coords = coords;
  }

  load() {
    this.el = new Image();
    this.el.onerror = function () {
      ctx = null;
      alert('Failed loading images');
    }
    this.el.onload = function() {
      this.loaded = true;
    }
    this.el.src = this.url;
  }
}