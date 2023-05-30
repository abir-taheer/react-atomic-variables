export type Listener<Type> = (value: Type) => void;

export class ListenerStore<Type> {
  listeners: Listener<Type>[];

  constructor() {
    this.listeners = [];
  }

  addListener(listener: Listener<Type>) {
    this.listeners.push(listener);
  }

  removeListener(listener: Listener<Type>) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  emit(value: Type) {
    this.listeners.forEach((listener) => listener(value));
  }
}
