import React, { Component, PropTypes } from 'react';

import ReactDOM from 'react-dom';
//add new.
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
//
import Task from './Tasks.jsx';



//acount

import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Meteor } from 'meteor/meteor';

export default class App extends Component {

/*	getTasks() {
		return [
			{ _id: 1, text: 'This is task 1'},
			{ _id: 2, text: 'This is task 2' },
			{ _id: 3, text: 'This is task 3' }
		];
	}
*/

	constructor(props){
		super(props);

		this.state = {
			hideCompleted: false,
		}
	}

	toggleHideCompleted(){
		this.setState({
			hideCompleted: !this.state.hideCompleted,
		});
	}

	handleSubmit(event) {
	    
	    event.preventDefault();

	    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

	   	Meteor.call('tasks.insert',text); 

	    //clear 
	    ReactDOM.findDOMNode(this.refs.textInput).value='';

  }

  renderTasks() {
  	let filteredTasks = this.props.tasks;
  	if (this.state.hideCompleted) {
  		filteredTasks = filteredTasks.filter(task => !task.checked);
  	}
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

	render(){
		return (
			<div className="container">
				<header>
					<h1>Todo List ({this.props.incompleteCount}) </h1>
					<label className="hide-completed">
						
						<input type="checkbox" 
							readOnly
							checked={this.state.hideCompleted}
							onClick={this.toggleHideCompleted.bind(this)} 
						/>
						 Hide Completed Tasks
					</label>

					<AccountsUIWrapper/>
						
						{
							this.props.currentUser ?
							<form className="new-task" onSubmit={this.handleSubmit.bind(this) }>
								<input
									type="text"
									ref="textInput"
									placeholder="Type to add new task"
								/>
							</form> : ''
						}

				</header>
				
				<ul>
					{this.renderTasks()}
				</ul>
			</div>
		);
	}
}

App.propTypes = {
	tasks: PropTypes.array.isRequired,
	incompleteCount:PropTypes.number.isRequired,
	currentUser: PropTypes.object,
}

export default createContainer(() => {
  return {
         tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
         incompleteCount: Tasks.find({checked: { $ne:true }}).count(),
         currentUser: Meteor.user(),
  };
}, App);
