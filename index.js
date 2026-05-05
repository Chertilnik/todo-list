function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

      Object.keys(callbacks).forEach((event) => {
        element.addEventListener(event, callbacks[event]);
      });


  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      todos: [
        { text: "Сделать домашку", completed: false },
        { text: "Сделать практику", completed: false },
        { text: "Пойти домой", completed: false },
      ],
      currentInputValue: "",
    };
  }


  onAddTask(value) {
    this.state.todos.push({text:value, completed: false});
  }

  onAddInputChange(value) {
    this.state.currentInputValue = value;
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement("input", {id: "new-todo", type: "text", placeholder: "Задание", value: this.state.currentInputValue}), [],
        {input: (e) => {
          this.onAddInputChange(e.target.value);
        }},
        createElement("button", { id: "add-btn" }, "+",
            {click: () => {
                this.onAddTask(this.state.currentInputValue);
              }}),
      ]),
      createElement("ul", { id: "todos" }, 
      this.state.todos.map(todo => 
          createElement("li", {}, [
            createElement("input", { type: "checkbox", ...(todo.completed ? { checked: "" } : {}) }),
            createElement("label", {}, todo.text),
            createElement("button", {}, "🗑️")
          ])
        ))
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
