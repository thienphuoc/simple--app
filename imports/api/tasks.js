import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({

   'tasks.insert'(text){
		check(text,String);

		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Tasks.insert({
			text,
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
		});		
	},

	'tasks.remove'(taskId){
		check(taskId,String);
		Tasks.remove(taskId);
	},

	'tasks.setChecked'(taskID,setChecked){
		check(taskID,String);
		check(setChecked,Boolean);

		Tasks.update(taskID,{ $set: { checked:setChecked } });
	},
});

