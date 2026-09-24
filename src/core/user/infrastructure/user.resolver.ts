import { UserService } from '../application/user.uc';

export class UserResolver {
  constructor(private useCases: UserService) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  public async register(_parent: any, { input }: any) {
    return await this.useCases.register(input);
  }

  public async login(_parent: any, { input }: any) {
    const data = await this.useCases.login(input);
    return data;
  }
}

