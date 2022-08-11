// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	console.log(tasks);
}

tasks.forEach(function (task) {
		
	// Формируем CSS класс
		const cssClass = task.done ? "sticker active" : "sticker";
	
		// Формируем разметку для новой задачи 
		const taskHTML = `<div id="${task.id}" class="list-group-item">
		<div class="sticker ${cssClass}">
		<div class="sticker__header sticker__header-red">
			<p class="task__number">${tasks.indexOf(task) + 1 + '.'}</p>
			<div class="emoji emoji-mood"></div>
		
		</div>
		<p class="task-title">
			${task.text}
		</p>
		<div class="sticker__icons">
		   <button class="sticker__icon sticker__icon-color" data-action="done" title="Все готово?"></button>
		   <button class="sticker__icon sticker__icon-trash" data-action="delete" title="Удалить задачу?"></button>
		</div>
	</div>
	</div>`;
	
	// Добавляем задачу на страницу 
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
})
console.log(3)
checkEmptyList(); 

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// Функции
function addTask(event) {
	// Отменяем отправку формы
	event.preventDefault();

	// Достаем текст из поля ввода
	const taskText = taskInput.value;

	// Описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	}

	// Добавляем задачу в массив с задачами 
	tasks.push(newTask);

	// Сохраняем задачу в хранилище браузера localStorage
	saveToLocalStorage();

	// Формируем CSS класс
	const cssClass = newTask.done ? "sticker active" : "sticker";

	// Формируем разметку для новой задачи 
	const taskHTML = `<div id="${newTask.id}" class="list-group-item">
	<div class="sticker ${cssClass}">
	<div class="sticker__header sticker__header-red">
		<p class="task__number">${tasks.indexOf(newTask) + 1 + '.'}</p>
		<div class="emoji emoji-mood"></div>
	
	</div>
	<p class="task-title">
		${newTask.text}
	</p>
	<div class="sticker__icons">
	   <button class="sticker__icon sticker__icon-color" data-action="done" title="Все готово?"></button>
	   <button class="sticker__icon sticker__icon-trash" data-action="delete" title="Удалить задачу?"></button>	  
	</div>
</div>
</div>`;

// Добавляем задачу на страницу 
tasksList.insertAdjacentHTML('beforeend', taskHTML);

// Очищаем поле ввода и возвращаем на него фокус
taskInput.value = "";
taskInput.focus(); 
console.log(2)
checkEmptyList();
}

function deleteTask(event) {
	
	// Проверяем, что клик был по кнопке "удалить задачу"
	if (event.target.dataset.action === 'delete') {
		const parenNode = event.target.closest('.list-group-item');

		// Определяем ID задачи 
		const id = Number(parenNode.id);

		// Находим индекс задачи в ммссиве
		const index = tasks.findIndex(function (task) {
			if (task.id === id) {
				return true;
			}
		})

		// Удаляем задачу из массива с задачами
		tasks.splice(index, 1);

		// Сохраняем задачу в хранилище браузера localStorage
		saveToLocalStorage();

		// Удаляем из разметки
		parenNode.remove()
		checkEmptyList()

		const taskNumbers = document.querySelectorAll('.task__number'); 
		taskNumbers.forEach((taskNumber, index) => { 
		taskNumber.innerHTML = index + 1 + '.';
	});
	}

}

function doneTask(event) {
	
	// Проверяем, что клик был по кнопке "задача выполнена"
	if (event.target.dataset.action === "done") {
		const parentNode = event.target.closest('.list-group-item');

		// Определяем ID задачи
		const id = Number(parentNode.id);

		const task = tasks.find(function (task) {
			if (task.id === id) {
				return true
			}
		})

		task.done = !task.done;

		// Сохраняем задачу в хранилище браузера localStorage
		saveToLocalStorage();

		const Sticker = parentNode.querySelector('.sticker');
		Sticker.classList.toggle('active');
	}
}

function checkEmptyList() {
	console.log('checkEmptyList')
	if (tasks.length === 0) {
		const emptyListHTML = `<div class="empty-list list-group-item" id="emptyList">
		<img src="img/empty.png">
		<div class="empty-list__desc">
		<h3 class="empty-list__text">список дел пуст! ура!</h3>
		</div>
	</div>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}

}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}