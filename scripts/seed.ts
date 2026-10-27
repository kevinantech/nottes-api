import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database';
import { Member } from '../src/core/project/domain/member/member.factory';
import Project from '../src/core/project/domain/project/project.factory';
import { MemberModel } from '../src/core/project/infrastructure/member/member.model';
import { ProjectModel } from '../src/core/project/infrastructure/project/project.model';
import { Task } from '../.task/domain/task.value';
import { TaskModel } from '../.task/infrastructure/task.model';
import { IUser } from '../src/core/user/domain/user.entity';
import { User } from '../src/core/user/domain/user.value';
import { UserModel } from '../src/core/user/infrastructure/user.model';
import { UserRole } from '../src/core/user/domain/role.enum';
import bcrypt from 'bcryptjs';

const USERS: IUser[] = [
  new User('Kevin Gomez', 'kevin@mail.com', 'Kevin123'),
  new User('Juan Perez', 'juan@mail.com', 'Juan123'),
  new User('Josue Martinez', 'josue@mail.com', 'Josue123'),
  new User('Maria Lopez', 'maria@mail.com', 'Maria123'),
  new User('Carlos Sanchez', 'carlos@mail.com', 'Carlos123'),
];

const seed = async () => {
  try {
    await connectDatabase();

    // Limpiar la registros
    await Promise.all([
      UserModel.deleteMany({ role: UserRole.USER }),
      ProjectModel.deleteMany({}),
      MemberModel.deleteMany({}),
      TaskModel.deleteMany({}),
    ]);

    // Insertar los usuarios de prueba
    for (const user of USERS) {
      user.password_hash = await bcrypt.hash(user.password_hash, 10);
    }

    const users = await UserModel.insertMany(USERS);

    const projects = [];
    const members = [];
    const tasks = [];

    for (const user of users) {
      for (let i = 1; i <= 4; i++) {
        const project = Project.createNew(
          `Proyecto ${i} de ${user.name}`,
          `Responsable: ${user.name}`,
          user.id,
        );

        members.push(Member.createOwner(project.id, user.id));

        for (let j = 1; j <= 5; j++) {
          const task = new Task(
            `Proyecto ${i} - Tarea ${j}`,
            `Descripción de la tarea ${j} del proyecto ${i}`,
            project.id,
            user.id,
          );

          tasks.push(task);
        }

        projects.push(project);
      }
    }

    const [savedProjects, savedMembers, savedTasks] = await Promise.all([
      ProjectModel.insertMany(projects),
      MemberModel.insertMany(members),
      TaskModel.insertMany(tasks),
    ]);

    console.log(
      `Seed completado\nProyectos: ${savedProjects.length} | Miembros: ${savedMembers.length} | Tareas: ${savedTasks.length} | Usuarios: ${users.length}`,
    );
  } catch (error) {
    console.log('Error en el seed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
