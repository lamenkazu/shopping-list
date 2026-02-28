import { useState } from 'react';

import { UIButton } from '@infra/shared/ui/button';
import { UICard } from '@infra/shared/ui/card';
import { UIConfirmDialog } from '@infra/shared/ui/confirm-dialog';
import { UIMessage } from '@infra/shared/ui/message';
import { UIScreen } from '@infra/shared/ui/screen';
import { UIThemeModeToggle } from '@infra/shared/ui/theme-mode-toggle';

import { useProfileViewModel } from './view-model';

export const ProfileView = () => {
  const { state, actions, user, mode } = useProfileViewModel();
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const onOpenSignOutDialog = () => {
    setIsSignOutDialogOpen(true);
  };

  const onCloseSignOutDialog = () => {
    if (isSigningOut) {
      return;
    }

    setIsSignOutDialogOpen(false);
  };

  const onConfirmSignOut = async () => {
    setIsSigningOut(true);

    try {
      await actions.onSignOut();
      setIsSignOutDialogOpen(false);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <UIScreen>
      <UICard title="Perfil" subtitle={`E-mail: ${user?.email ?? 'Desconhecido'}`} className="p-5">
        <UIThemeModeToggle mode={mode} onChange={actions.onChangeThemeMode} className="mt-1" />

        <UIMessage tone="error" message={state.error} className="mt-4" />

        <UIButton
          label="Sair"
          variant="danger"
          onPress={onOpenSignOutDialog}
          containerClassName="mt-6"
        />
      </UICard>

      <UIConfirmDialog
        visible={isSignOutDialogOpen}
        title="Sair da conta"
        message="Você realmente deseja encerrar sua sessão neste dispositivo?"
        confirmLabel="Sair"
        confirmLoadingLabel="Saindo..."
        onCancel={onCloseSignOutDialog}
        onConfirm={onConfirmSignOut}
        isConfirmLoading={isSigningOut}
      />
    </UIScreen>
  );
};
