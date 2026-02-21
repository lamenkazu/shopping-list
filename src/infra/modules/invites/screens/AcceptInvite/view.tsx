import { UIButton } from '@infra/shared/ui/button';
import { UICard } from '@infra/shared/ui/card';
import { UIMessage } from '@infra/shared/ui/message';
import { UIScreen } from '@infra/shared/ui/screen';

import { useAcceptInviteViewModel } from './view-model';

export const AcceptInviteView = () => {
  const { state, actions } = useAcceptInviteViewModel();

  return (
    <UIScreen centered padded={false} className="px-6">
      <UICard
        title="Entrar na lista de compras"
        subtitle="Você foi convidado para colaborar em uma lista."
        className="w-full rounded-3xl p-6"
      >
        <UIMessage tone="error" message={state.error} className="mt-3" />

        <UIButton
          disabled={state.isSubmitting}
          loading={state.isSubmitting}
          loadingLabel="Entrando..."
          label="Aceitar convite"
          onPress={actions.acceptInvite}
          containerClassName="mt-6"
        />
      </UICard>
    </UIScreen>
  );
};

