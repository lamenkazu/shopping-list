import { UIButton } from '@infra/shared/ui/button';
import { UIInput } from '@infra/shared/ui/input';
import { UIMessage } from '@infra/shared/ui/message';
import { UISection } from '@infra/shared/ui/section';
import { UITextLinkButton } from '@infra/shared/ui/text-link-button';
import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { useForgotPasswordViewModel } from './view-model';

export const ForgotPasswordView = () => {
  const { form, state, actions } = useForgotPasswordViewModel();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const submitForm = handleSubmit(actions.submit);

  return (
    <UISection title="Esqueci minha senha" subtitle="Enviaremos um link de redefinição por e-mail.">
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
              returnKeyType="send"
              onSubmitEditing={submitForm}
              onChangeText={text => {
                actions.resetMessages();
                onChange(text);
              }}
              errorMessage={errors.email?.message}
            />
          )}
        />
      </View>

      <UIMessage tone="error" message={state.error} className="mt-3" />
      <UIMessage tone="success" message={state.success} className="mt-3" />

      <UIButton
        disabled={isSubmitting}
        loading={isSubmitting}
        loadingLabel="Enviando..."
        label="Enviar e-mail de redefinição"
        onPress={submitForm}
        containerClassName="mt-6"
      />

      <View className="mt-5">
        <Link href={'/sign-in' as never} asChild>
          <UITextLinkButton label="Voltar para entrar" align="center" />
        </Link>
      </View>
    </UISection>
  );
};
