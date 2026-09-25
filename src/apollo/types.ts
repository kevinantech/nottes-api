/**
 * https://www.apollographql.com/docs/apollo-server/getting-started#step-3-define-your-graphql-schema
 */
const typeDefs = `#graphql 
	# USER
	input RegisterUserInput {
		name: String!
		email: String!
		password: String!
	}
	
	input LoginUserInput {
		email: String!
		password: String!
	}
	
	type Token {
		token: String!
	}
	
	# PROJECT
	input CreateProjectInput {
		name: String!
	}

	 input UpdateProjectInput {
		id: ID!
		title: String!
		projectId: ID!
	 }

	type Project {
		id: ID!
		title: String!
	}

	# TASK
	input GetTasksInput {
		projectId: ID!
	}

	input CreateTaskInput {
		title: String!
		projectId: ID!
	}
	
	input UpdateTaskInput {
		id: ID!
		title: String
		status: Boolean!
	}
	
	type Task {
		id: ID!
		title: String
		status: Boolean
		projectId: ID
	}

	# RESOLVERS

	type Query {
		getProjects: [Project]
		getTasks(input: GetTasksInput): [Task]
	}

	type Mutation {
		# Users
		registerUser(input: RegisterUserInput): Boolean
		login(input: LoginUserInput): Token

		# Project
		createProject(input: CreateProjectInput): Project
		updateProject(input: UpdateProjectInput): Project
		deleteProject(id: ID!): Project 

		# Task
		createTask(input: CreateTaskInput): Task
		updateTask(input: UpdateTaskInput): Task
		deleteTask(id: ID!): Task

	}
`;
export { typeDefs };

