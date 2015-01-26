/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
	.controller('TodoCtrl', function($scope, $routeParams, $filter, $location, $q, Todo) {
		'use strict';

		if (!$scope.currentUser) 
			return $location.path('/login');	

		Todo.find({
			filter: {
				where: {userId: $scope.currentUser.id}
			}
		}, function(todos) {
			$scope.todos = todos;
		});

		$scope.newTodo = '';
		$scope.status = 'all';
		$scope.editedTodo = null;

		$scope.$watch('todos', function (newValue, oldValue) {
			if (!newValue) return;

			$scope.remainingCount = $filter('filter')($scope.todos, { completed: false }).length;
			$scope.completedCount = $scope.todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		$scope.addTodo = function () {
			if (!$scope.newTodo.length) {
				return;
			}

			var newTodo = Todo.create({
				title: $scope.newTodo.trim(),
				completed: false,
				userId: $scope.currentUser.id
			});

			$scope.todos.push(newTodo);
			$scope.newTodo = '';
		};

		$scope.changeCompleted = function(todo) {
			todo.$save();
		};

		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.doneEditing = function (todo) {
			$scope.editedTodo = null;
			todo.title = todo.title.trim();

			if (!todo.title)
				$scope.removeTodo(todo);
			else
				todo.$save();
		};

		$scope.revertEditing = function (todo) {
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.doneEditing($scope.originalTodo);
		};

		$scope.removeTodo = function (todo) {
			Todo.deleteById({id: todo.id });
			$scope.todos.splice($scope.todos.indexOf(todo), 1);
		};

		$scope.clearCompletedTodos = function () {
			$scope.todos = $scope.todos.filter(function (val) {
				return !val.completed;
			});
		};

		$scope.selectStatus = function(status) {
			$scope.status = status;
			// if (status === 'all') {
			// 	$scope.statusFilter = true;
			// 	return;
			// }

			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : null;
		};

		$scope.markAll = function (completed) {
			var promises = [];

			$scope.todos.forEach(function (todo) {
				if (!todo.completed) {
					promises.push(function() {
						todo.completed = true;
						return todo.$save().$promise;
					})
				}
			});

			if (promises.length > 0)
				$q.all(promises);
		};
	});
