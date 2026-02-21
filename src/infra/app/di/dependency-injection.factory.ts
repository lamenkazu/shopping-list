import type { AuthRepository } from '@core/repositories/auth.repository';
import type { InvitesRepository } from '@core/repositories/invites.repository';
import type { ItemsRepository } from '@core/repositories/items.repository';
import type { ListsRepository } from '@core/repositories/lists.repository';
import { AuthSupabaseRepository } from '@infra/data/supabase/repositories/auth-supabase.repository';
import { InvitesSupabaseRepository } from '@infra/data/supabase/repositories/invites-supabase.repository';
import { ItemsSupabaseRepository } from '@infra/data/supabase/repositories/items-supabase.repository';
import { ListsSupabaseRepository } from '@infra/data/supabase/repositories/lists-supabase.repository';

export class DependencyInjectionFactory {
  private static instance: DependencyInjectionFactory;

  private readonly authRepository: AuthRepository;
  private readonly listsRepository: ListsRepository;
  private readonly itemsRepository: ItemsRepository;
  private readonly invitesRepository: InvitesRepository;

  private constructor() {
    this.authRepository = new AuthSupabaseRepository();
    this.listsRepository = new ListsSupabaseRepository();
    this.itemsRepository = new ItemsSupabaseRepository();
    this.invitesRepository = new InvitesSupabaseRepository();
  }

  static getInstance(): DependencyInjectionFactory {
    if (!DependencyInjectionFactory.instance) {
      DependencyInjectionFactory.instance = new DependencyInjectionFactory();
    }

    return DependencyInjectionFactory.instance;
  }

  getAuthRepository(): AuthRepository {
    return this.authRepository;
  }

  getListsRepository(): ListsRepository {
    return this.listsRepository;
  }

  getItemsRepository(): ItemsRepository {
    return this.itemsRepository;
  }

  getInvitesRepository(): InvitesRepository {
    return this.invitesRepository;
  }
}
