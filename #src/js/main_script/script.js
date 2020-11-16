'use strict';

import '../modules/remove-polyfill.js';
import '../modules/append-polyfill.js';
import '../modules/prepend-polyfill.js';

import toDoStart from '../modules/todo.js';

window.addEventListener('DOMContentLoaded', () => {
	toDoStart();
});