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

  if (callbacks) {
    Object.keys(callbacks).forEach((event) => {
      element.addEventListener(event, callbacks[event]);
    });
  }

  return element;
}

class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {};
    this._domNode = null;
  }

  getDomNode() {
    if (!this._domNode) {
      this._domNode = this.render();
    }

    return this._domNode;
  }

  update() {
    if (!this._domNode) {
      return;
    }

    const newDomNode = this.render();
    this._domNode.replaceWith(newDomNode);
    this._domNode = newDomNode;
  }
}

class AddTask extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement(
        "input",
        {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
          value: this.props.currentInputValue,
        },
        null,
        {
          input: (event) => this.props.onAddInputChange(event.target.value),
        }
      ),
      createElement(
        "button",
        { id: "add-btn" },
        "+",
        {
          click: () => this.props.onAddTask(),
        }
      ),
    ]);
  }
}

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleteArmed: false,
    };
  }

  onDeleteClick() {
    if (!this.state.isDeleteArmed) {
      this.state.isDeleteArmed = true;
      this.update();
      return;
    }
    this.props.onDeleteTask(this.props.index);
  }

  render() {
    const labelStyles = this.props.todo.completed ? "color: gray;" : "";
    const deleteButtonStyles = this.state.isDeleteArmed
      ? "background-color: red; color: white;"
      : "";

    return createElement("li", {}, [
      createElement(
        "input",
        {
          type: "checkbox",
          ...(this.props.todo.completed ? { checked: "" } : {}),
        },
        null,
        {
          change: () => this.props.onToggleTask(this.props.index),
        }
      ),
      createElement("label", { style: labelStyles }, this.props.todo.text),
      createElement(
        "button",
        { style: deleteButtonStyles },
        "Удалить",
        {
          click: () => this.onDeleteClick(),
        }
      ),
    ]);
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

  onAddTask() {
    const text = this.state.currentInputValue;

    this.state.todos.push({ text, completed: false });
    this.state.currentInputValue = "";
    this.update();
  }

  onAddInputChange(value) {
    this.state.currentInputValue = value;
    this.update();
  }

  onDeleteTask(index) {
    this.state.todos = this.state.todos.filter((_, todoIndex) => todoIndex !== index);
    this.update();
  }

  onToggleTask(index) {
    this.state.todos = this.state.todos.map((todo, todoIndex) => {
      if (todoIndex !== index) {
        return todo;
      }
      return { ...todo, completed: !todo.completed };
    });
    this.update();
  }

  render() {
    const addTask = new AddTask({
      currentInputValue: this.state.currentInputValue,
      onAddTask: () => this.onAddTask(),
      onAddInputChange: (value) => this.onAddInputChange(value),
    });

    const todoItems = this.state.todos.map((todo, index) => {
      const task = new Task({
        todo,
        index,
        onDeleteTask: (taskIndex) => this.onDeleteTask(taskIndex),
        onToggleTask: (taskIndex) => this.onToggleTask(taskIndex),
      });

      return task.getDomNode();
    });

    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      addTask.getDomNode(),
      createElement("ul", { id: "todos" }, todoItems),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});