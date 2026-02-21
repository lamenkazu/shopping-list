import { UIButton } from '@infra/shared/ui/button';
import { UICard } from '@infra/shared/ui/card';
import { UIMessage } from '@infra/shared/ui/message';
import { UIScreen } from '@infra/shared/ui/screen';
import { UIThemeModeToggle } from '@infra/shared/ui/theme-mode-toggle';

import { useProfileViewModel } from './view-model';

export const ProfileView = () => {
  const { state, actions, user, mode } = useProfileViewModel();

  return (
    <UIScreen>
      <UICard title="Perfil" subtitle={`E-mail: ${user?.email ?? 'Desconhecido'}`} className="p-5">
        <UIThemeModeToggle mode={mode} onChange={actions.onChangeThemeMode} className="mt-1" />

        <UIMessage tone="error" message={state.error} className="mt-4" />

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
