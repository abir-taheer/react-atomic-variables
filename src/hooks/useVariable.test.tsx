import { AtomicVariable } from "../AtomicVariable";
import { use, should } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

// We have to import these like this otherwise sinon has a hard time mocking them
import * as useVariableExports from "./useVariable";
import * as useValueExports from "./useValue";

import jsdom from "jsdom-global";
import React from "react";
import ReactDOM from "react-dom";

should();
use(sinonChai);
jsdom();

const TestComponent = ({ variable }: { variable: AtomicVariable<any> }) => {
  const value = useVariableExports.useVariable(variable);
  return <p>{value}</p>;
};

describe("useVariable", () => {
  const variable = new AtomicVariable(0);

  it("should return an array with the current value and the setter", () => {
    const mock = sinon.mock(useVariableExports);
    const node = document.createElement("p");

    mock
      .expects("useVariable")
      .once()
      .withArgs(variable)
      .returned(
        sinon.match.array.deepEquals([variable.getValue(), variable.set])
      );

    ReactDOM.render(<TestComponent variable={variable} />, node);
    ReactDOM.flushSync(() => {});

    mock.verify();
    mock.restore();
  });

  it("should call useValue", () => {
    const mock = sinon.mock(useValueExports);
    const node = document.createElement("p");

    mock.expects("useValue").once().withArgs(variable);

    ReactDOM.render(<TestComponent variable={variable} />, node);
    ReactDOM.flushSync(() => {});

    mock.verify();
    mock.restore();
  });
});
