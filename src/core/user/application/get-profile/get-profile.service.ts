import { Inject, Injectable } from '../../../../di';
import { AppException } from '../../../shared/domain/exception';
import { IUserResponse } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';

@Injectable()
export class GetProfileService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  public async execute(id: string): Promise<IUserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppException('Usuario no encontrado');
    return {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      membershipCount: user.membershipCount,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
