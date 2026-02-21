import { UIButton } from '@infra/shared/ui/button';
import { UIInput } from '@infra/shared/ui/input';
import { UIMessage } from '@infra/shared/ui/message';
import { UISection } from '@infra/shared/ui/section';
import { UITextLinkButton } from '@infra/shared/ui/text-link-button';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { useSignUpViewModel } from './view-model';

export const SignUpView = () => {
  const { form, state, actions } = useSignUpViewModel();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <UISection title="Criar conta">
      <View className="gap-3">
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <UIInput
              placeholder="Nome completo"
              value={value}
              onChangeText={text => {
                actions.resetError();
                onChange(text);
              }}
              errorMessage={errors.fullName?.message}
            />
          )}
        />

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
        loadingLabel="Criando conta..."
        label="Criar conta"
        onPress={handleSubmit(actions.submit)}
        containerClassName="mt-6"
      />

      <View className="mt-5">
        <Link href={'/sign-in' as never} asChild>
          <UITextLinkButton label="Já tenho uma conta" align="center" />
        </Link>
      </View>
    </UISection>
  );
};

