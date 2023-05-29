import { useEffect, useState } from "react";

type Listener<Type> = (value: Type) => void;

type AtomicSetterFn<Type> = (current: Type) => Type;
type Setter<Type> = (value: Type | AtomicSetterFn<Type>) => void;
type Unsubscribe = () => void;

class ListenerStore<Type> {
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

export class AtomicVariable<Type> {
  value: Type;
  set: Setter<Type>;
  listeners = new ListenerStore<Type>();
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
}

export const useVariable = <Type>(
  variable: AtomicVariable<Type>
): [Type, Setter<Type>] => {
  const [value, setValue] = useState(variable.value);

  useEffect(() => {
    variable.subscribe(setValue);
  }, [variable]);

  return [value, variable.set];
};

export const useValue = <Type>(variable: AtomicVariable<Type>): Type => {
  const [value, setValue] = useState(variable.value);

  useEffect(() => {
    return variable.subscribe(setValue);
  }, [variable]);

  return value;
};

export const useSetValue = <Type>(
  variable: AtomicVariable<Type>
): Setter<Type> => {
  return variable.set;
};

/*
// Usage

const counterVariable = new AtomicVariable(0);

const App = () => {
  const [counter, setCounter] = useVariable(counterVariable);

  return (
    <div>
      <button onClick={() => setCounter((c) => c + 1)}>Increment</button>
      <button onClick={() => setCounter((c) => c - 1)}>Decrement</button>
      <p>Counter: {counter}</p>
    </div>
  );
}
 */
