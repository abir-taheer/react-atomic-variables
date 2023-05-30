# react-atomic-variables

## How To Use

```tsx
import { useVariable, AtomicVariable } from "react-atomic-variables";

const variable = new AtomicVariable(0);

const App = () => {
  const [counter, setCounter] = useVariable(variable);
  return (
    <div>
      <button onClick={() => setCounter((c) => c + 1)}>Increment</button>
      <button onClick={() => setCounter((c) => c - 1)}>Decrement</button>
      <p>Counter: {counter}</p>
    </div>
  );
};
```

## API

### `AtomicVariable<Type>`

This class represents a single self-contained variable.

#### `constructor(initialValue: Type)`

The constructor only takes one parameter, the initialValue of the variable.

```typescript
type User = {
  name: string;
  age: number;
};

const jeff: User = {
  name: "Jeff",
  age: 21,
};

const variable = new AtomicVariable(jeff); // Type is inferred as User
```

#### `getValue()`

This function returns the current value of the variable. This can be called from anywhere in the application including outside react components

```typescript
const variable = new AtomicVariable(0);

console.log(variable.getValue()); // 0
```

#### `set(newValue: Type | Setter<Type>)`

This method is used to set the value of the variable.

It takes either a new value or a setter function.

The setter function is passed the current value of the variable and should return the new value.

```typescript
const variable = new AtomicVariable(0);

variable.set(1);
console.log(variable.getValue()); // 1

variable.set((c) => c + 1);
console.log(variable.getValue()); // 2
```

#### `subscribe(callback: (newValue: Type) => UnsubscribeFn)`
This method is used to subscribe to changes in the variable. The callback is called whenever the value of the variable changes. 
The callback is passed the new value of the variable.

The callback returns an unsubscribe function which can be used to remove the listener from the variable.

```typescript
const variable = new AtomicVariable(0);

const unsubscribe = variable.subscribe((newValue) => {
  console.log(newValue);
});


variable.set(1); // This should trigger the callback and log 1 to the console

unsubscribe(); // This removes the listener from the variable

variable.set(2); // This should not trigger the callback
```

### `useVariable<Type>(variable: AtomicVariable<Type>): [Type, Setter<Type>]`
This is similar to the `useState` react hook except that it takes an AtomicVariable as a parameter instead of an initial value.

It returns a tuple containing the current value of the variable and a setter function.

```tsx
const variable = new AtomicVariable(0);

const App = () => {
  const [counter, setCounter] = useVariable(variable);
  return (
    <div>
      <button onClick={() => setCounter((c) => c + 1)}>Increment</button>
      <button onClick={() => setCounter((c) => c - 1)}>Decrement</button>
      <p>Counter: {counter}</p>
    </div>
  );
};
```


### `useValue`
This is a hook that takes an `AtomicVariable` and returns the current value of the variable. 

It will trigger a re-render of the component anytime the setter function is called.

```tsx
const variable = new AtomicVariable(0);

const App = () => {
  const counter = useValue(variable)
  return (
    <p>Counter: {counter}</p>
  );
};
```

### `useSetVariable`
This is a hook that takes an `AtomicVariable` and returns the setter function of the variable.
All this hook really does is just return `AtomicVariable.set` since the reference to the setter in the current implementation never changes.

```tsx
const variable = new AtomicVariable(0);

const App = () => {
  const setCounter = useSetVariable(variable)
  return (
    <div>
      <button onClick={() => setCounter((c) => c + 1)}>Increment</button>
      <button onClick={() => setCounter((c) => c - 1)}>Decrement</button>
    </div>
  );
};
```