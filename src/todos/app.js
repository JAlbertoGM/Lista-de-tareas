import html from "./app.html?raw";
import todoStore, { Filters } from "../store/todo.store";
import { renderTodos, renderPending } from "./use-cases";


const elementIDs = {
    ClearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',

}

/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        //console.log(todos);
        renderTodos(elementIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(elementIDs.PendingCountLabel);
    }

    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    //Referencias HTML, se colocan abajo porque de ponerla arribal del App, no las registraria, ya que no esta creada en el doom
    const newDescriptionInput = document.querySelector(elementIDs.NewTodoInput);
    const todoListUL = document.querySelector(elementIDs.TodoList);
    const todoDeleteUL = document.querySelector(elementIDs.TodoList);
    const todoDeleteCompleted = document.querySelector(elementIDs.ClearCompleted);
    const filtersLIs = document.querySelectorAll(elementIDs.TodoFilters);

    //Listeners
    newDescriptionInput.addEventListener('keyup', (event) => {
        if (event.keyCode !== 13) return;
        if (event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    });

    todoListUL.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();
        //console.log(event.target);
    });

    todoDeleteUL.addEventListener('click', (event) => {
        const destroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');
        if (!element || !destroyElement) return;
        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();
        //console.log(event.target);
    });

    todoDeleteCompleted.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodos();
    });

    filtersLIs.forEach(element => {
        element.addEventListener('click', (element) => {
            filtersLIs.forEach(el => el.classList.remove('selected'));
            element.target.classList.add('selected');

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter(Filters.All)
                    break;

                case 'Completados':
                    todoStore.setFilter(Filters.Completed)
                    break;

                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending)
                    break;
            }
            displayTodos();
        });
    });

}