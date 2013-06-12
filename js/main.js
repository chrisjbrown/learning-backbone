(function() {
	//globals
	window.App = {
		Models: {},
		Collections: {},
		Views: {},
		Routers: {}
	};

	window.template = function(id) {
		return _.template( $('#' + id).html() );
	};

	App.Routers.MyRouter = Backbone.Router.extend({
		routes: {
			'': 'index',
			'show/:id': 'show',
			'search/:query': 'query',

		},

		index: function(){
			
		},

		show: function(id){
			
		}
	});

	new App.Routers.MyRouter;
	Backbone.history.start();
	

	App.Models.Task = Backbone.Model.extend({
		validate: function(attrs){
			if( !$.trim(attrs.title) ){
				return 'A task requires a valid title';
			}
		}
	});

	App.Collections.Tasks = Backbone.Collection.extend({
		model: App.Models.Task
	});

	App.Views.Task = Backbone.View.extend({
		tagName: 'li',

		template: template('taskTemplate'),

		initialize: function(){
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		events: {
			'click .edit': 'editTask',
			'click .delete': 'destroy'
		},

		editTask: function(){
			var newTaskTitle = prompt('what would you like to change the text to?', this.model.get('title'));

			this.model.set({title: newTaskTitle}, {validate: true});
		},

		destroy: function(){
			this.model.destroy();
		},

		remove: function(){
			this.$el.remove();
		},

		render: function(){
			var template = this.template( this.model.toJSON() );
			this.$el.html( template );
			return this;
		}
	});

	App.Views.Tasks = Backbone.View.extend({
		tagName: 'ul',

		initialize: function(){
			this.collection.on('add', this.addOne, this);
		},

		render: function(){
			this.collection.each(this.addOne, this)
			return this;
		},

		addOne: function(task){
			//create child view
			var taskView = new App.Views.Task({ model: task });

			//append to root
			this.$el.append(taskView.render().el);
			$('button').button();
			$(".datePicker").datepicker();
		}
	});

	App.Views.AddTask = Backbone.View.extend({
		el: '#addTask',

		events: {
			'submit': 'submit'
		},

		initialize: function(){},

		submit: function(e){
			e.preventDefault();

			var newTaskTitle = $(e.currentTarget).find('input[type=text]').val();
			var task = new App.Models.Task({ title: newTaskTitle }, {validate: true});

			this.collection.add(task);
		}
	});

	var taskCollection = new App.Collections.Tasks([
		{	
			title: 'Go to the store',
			priority: 4
		},
		{	
			title: 'Go to the mall',
			priority: 3
		},
		{	
			title: 'Go to the work',
			priority: 5
		}	
	]);

	var tasksView = new App.Views.Tasks({ collection: taskCollection});
	var AddTaskView = new App.Views.AddTask({ collection: taskCollection });
	$('.tasks').html(tasksView.render().el);


})();