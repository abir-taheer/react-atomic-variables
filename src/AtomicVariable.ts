import { ListenerStore } from "./ListenerStore";

export type AtomicSetterFn<Type> = (current: Type) => Type;
export type Setter<Type> = (value: Type | AtomicSetterFn<Type>) => void;
export type Unsubscribe = () => void;

export class AtomicVariable<Type> {
  private value: Type;
  set: Setter<Type>;
  private listeners = new ListenerStore<Type>();
  subscribe: (callback: (value: Type) => void) => Unsubscribe;

  constructor(value: Type) {
    this.value = value;
    this.set = (newValue) => {
      const isFn = newValue instanceof Function;

      if (isFn) {
        this.value = newValue(this.value);
      } else {
        this.value = newValue;
      }

      this.listeners.emit(this.value);
    };

    this.subscribe = (callback: (value: Type) => void) => {
      const listener = () => {
        const newValue = this.value;
        callback(newValue);
      };

      this.listeners.addListener(listener);

      return () => this.listeners.removeListener(listener);
    };
  }

  getValue(): Type {
    return this.value;
  }
}
