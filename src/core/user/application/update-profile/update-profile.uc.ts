import { Inject, Injectable } from '../../../../di';
import { ValidationException } from '../../../shared/domain/exception';
import { IUserResponse } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';
import {
  UpdateProfileInput,
  UpdateProfileSchema,
} from './update-profile.schema';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  public async execute(
    id: string,
    raw: UpdateProfileInput,
  ): Promise<Partial<IUserResponse>> {
    const { data: input, error } = UpdateProfileSchema.safeParse(raw);
    if (!input) throw ValidationException.fromZod(error);

    const result = await this.userRepository.updateById(id, input);

    return {
      id: result.id,
      name: result.name,
      role: result.role,
      email: result.email,
      membershipCount: result.membershipCount,
      createdAt: result.createdAt.toISOString(),
    } as IUserResponse;
  }
}
