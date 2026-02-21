import { UIButton } from '@infra/shared/ui/button';
import { UICard } from '@infra/shared/ui/card';
import { UIMessage } from '@infra/shared/ui/message';
import { UIScreen } from '@infra/shared/ui/screen';

import { useProfileViewModel } from './view-model';

export const ProfileView = () => {
  const { state, actions, user } = useProfileViewModel();

  return (
    <UIScreen>
      <UICard title="Perfil" subtitle={`E-mail: ${user?.email ?? 'Desconhecido'}`} className="p-5">
        <UIMessage tone="error" message={state.error} className="mt-3" />

        <UIButton
          label="Sair"
          variant="danger"
          onPress={actions.onSignOut}
          containerClassName="mt-6"
        />
      </UICard>
    </UIScreen>
  );
};

