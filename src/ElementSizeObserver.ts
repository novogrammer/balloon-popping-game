
type SimpleCallback = () => void;
interface ElementSizeObserverParams {
  elementForSize: HTMLElement;
  onResize?: SimpleCallback;
}
interface Size {
  width: number;
  height: number;
}
export default class ElementSizeObserver {
  previousSize: Size | null = null;

  elementForSize: HTMLElement;

  onResize: SimpleCallback | undefined;

  constructor({ elementForSize, onResize }: ElementSizeObserverParams) {
    this.elementForSize = elementForSize;
    this.onResize = onResize;

  }

  getSize(): Size {
    const width = this.elementForSize.clientWidth;
    const height = this.elementForSize.clientHeight;
    return {
      width,
      height,
    }
  }

  update() {
    const size = this.getSize();
    if ((!this.previousSize) || size.width !== this.previousSize.width || size.height !== this.previousSize.height) {
      if (this.onResize) {
        this.onResize();
      }
      this.previousSize = size;
    }

  }
}