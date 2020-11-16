function toDoStart() {
	const input = document.querySelector('.todo__input'),
		list = document.querySelector('.todo__list'),
		enterValue = document.querySelector('.todo__add'),
		saveBtn = document.querySelector('.todo__save'),
		status = document.querySelector('.status'),
		clearBtn = document.querySelector('.todo__clear'),
		infoBtn = document.querySelector('.todo__info'),
		info = document.querySelector('.info'),
		message = {
			save: 'список дел сохранён',
			clear: 'список дел очищен'
		};

	//загружаем данные из localStorage
	loadToDoList();

	//функция загрузки данных из localStorage
	function loadToDoList() {
		const data = localStorage.getItem('todoList');
		if (data) {
			list.innerHTML = data;
			deleteTask();
		}
	}

	//функция создаёт задачу
	function createTask() {
		const li = document.createElement('li'),
			inputValue = input.value;

		li.classList.add('todo__item');
		li.innerHTML = '<span class="todo__del"><img src="img/icons/trash.svg" alt="delete"></span>';
		li.prepend(inputValue);
		list.append(li);
		input.value = "";
		deleteTask();
	}

	//функция удаляет задачу
	function deleteTask() {
		const deleteBtn = document.querySelectorAll('.todo__del');
		deleteBtn.forEach(function (item) {
			item.addEventListener('click', function () {
				this.parentElement.remove();
			});
		});
	}

	//функция вычеркивает задачу
	function checkedTask(e) {
		if (e.target && e.target.tagName == 'LI') {
			e.target.classList.toggle('checked');
		}
	}

	//обработчики

	//вычеркивает задачу по клику
	list.addEventListener('click', checkedTask);

	//добавляет задачу по клику
	enterValue.addEventListener('click', (e) => {
		e.preventDefault();

		if (input.value !== "") {
			createTask();
		}

	});

	//добавляет задачу при нажатии Enter
	document.addEventListener('keydown', (e) => {

		if (e.key === 'Enter' && input.value !== "") {
			e.preventDefault();
			createTask();
		}

	});

	//сохраняет задачу в localStorage
	saveBtn.addEventListener('click', (e) => {
		e.preventDefault();

		if (list.children.length > 0) {
			localStorage.setItem('todoList', list.innerHTML);
			status.textContent = message.save;
			status.classList.remove('hide');
			status.classList.add('show');
			setTimeout(() => {
				status.textContent = '';
				status.classList.remove('show');
				status.classList.add('hide');
			}, 3000);
		}

	});

	//удаляет задачу из localStorage
	clearBtn.addEventListener('click', (e) => {
		e.preventDefault();

		if (list.children.length > 0) {
			list.innerHTML = '';
			status.textContent = message.clear;
			status.classList.remove('hide');
			status.classList.add('show');
			localStorage.removeItem('todoList', list.innerHTML);
			setTimeout(() => {
				status.textContent = '';
				status.classList.remove('show');
				status.classList.add('hide');
			}, 3000);
		}

	});

	//вызываем справку
	infoBtn.addEventListener('click', (e) => {
		e.preventDefault();

		if (info.classList.contains('hide')) {
			info.classList.remove('hide');
			info.classList.add('show');
		} else {
			info.classList.remove('show');
			info.classList.add('hide');
		}

	});
}

export default toDoStart;