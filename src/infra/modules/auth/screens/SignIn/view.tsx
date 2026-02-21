import { UIButton } from '@infra/shared/ui/button';
import { UIInput } from '@infra/shared/ui/input';
import { UIMessage } from '@infra/shared/ui/message';
import { UISection } from '@infra/shared/ui/section';
import { UITextLinkButton } from '@infra/shared/ui/text-link-button';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { useSignInViewModel } from './view-model';

export const SignInView = () => {
  const { form, state, actions } = useSignInViewModel();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <UISection title="Entrar" subtitle="Lista de compras compartilhada em tempo real.">
      <View className="gap-3">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <UIInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="seu@email.com"
              value={value}
              onChangeText={text => {
                actions.resetError();
                onChange(text);
              }}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <UIInput
              secureTextEntry
              placeholder="Senha"
              value={value}
              onChangeText={text => {
                actions.resetError();
                onChange(text);
              }}
              errorMessage={errors.password?.message}
            />
          )}
        />
      </View>

      <UIMessage tone="error" message={state.error} className="mt-3" />

      <UIButton
        disabled={isSubmitting}
        loading={isSubmitting}
        loadingLabel="Entrando..."
        label="Entrar"
        onPress={handleSubmit(actions.submit)}
        containerClassName="mt-6"
      />

      <View className="mt-5 flex-row justify-between">
        <Link href={'/sign-up' as never} asChild>
          <UITextLinkButton label="Criar conta" />
        </Link>

        <Link href={'/forgot-password' as never} asChild>
          <UITextLinkButton label="Esqueci minha senha" />
        </Link>
      </View>
    </UISection>
  );
};

