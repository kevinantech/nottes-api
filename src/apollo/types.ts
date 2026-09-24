/**
 * https://www.apollographql.com/docs/apollo-server/getting-started#step-3-define-your-graphql-schema
 */
const typeDefs = `#graphql 
	# Base Response
	# type Response {
		# id: id!
	# }
	
	# For register a new user
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
	
	# input CreateProjectInput {
		# name: String!
	#}

	# input UpdateProjectInput {
		# id: id!
		# name: String!
	# }

	# type Project {
		# id: id!
		# name: String
	# }

	# TASK
	
	# input GetTasksInput {
		# projectId: id!
	# }

	# input CreateTaskInput {
		# name: String!
		# projectId: id!
	# }
	
	# input UpdateTaskInput {
		# id: id!
		# name: String
		# status: Boolean!
	# }
	
	# type Task {
		# id: id!
		# name: String
		# status: Boolean
		# projectId: id
	# }

	# RESOLVERS

	type Query {

		getUsers: [Token]
		# PROJECT
		# GetProjects: [Project]

		# TASK
		# GetTasks(input: GetTasksInput): [Task]
	}

	type Mutation {
		# Users
		registerUser(input: RegisterUserInput): Boolean
		login(input: LoginUserInput): Token

		# PROJECT
		# CreateProject(input: CreateProjectInput): Project
		# UpdateProject(input: UpdateProjectInput): Project
		# DeleteProject(id: id!): Response 

		# TASK
		# CreateTask(input: CreateTaskInput): Task
		# UpdateTask(input: UpdateTaskInput): Task
		# DeleteTask(id: id!): Response

	}
`;
export { typeDefs };

