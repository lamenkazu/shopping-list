import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { lucideIconNodes } from '@infra/shared/ui/icon-nodes';
import { UIInput } from '@infra/shared/ui/input';
import { UILucideIcon } from '@infra/shared/ui/lucide-icon';
import { UIMessage } from '@infra/shared/ui/message';
import { UISection } from '@infra/shared/ui/section';
import { UITextLinkButton } from '@infra/shared/ui/text-link-button';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { useSignUpViewModel } from './view-model';

export const SignUpView = () => {
  const colors = useAppColors();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const { form, state, actions } = useSignUpViewModel();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const submitForm = handleSubmit(actions.submit);

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
              returnKeyType="next"
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
              returnKeyType="next"
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
              secureTextEntry={!isPasswordVisible}
              placeholder="Senha"
              value={value}
              returnKeyType="next"
              onChangeText={text => {
                actions.resetError();
                onChange(text);
              }}
              rightAccessory={
                <UILucideIcon
                  iconNode={isPasswordVisible ? lucideIconNodes.eyeOff : lucideIconNodes.eye}
                  size={18}
                  color={colors.textMuted}
                />
              }
              onPressRightAccessory={() => setIsPasswordVisible(prev => !prev)}
              rightAccessoryAccessibilityLabel={
                isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'
              }
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <UIInput
              secureTextEntry={!isConfirmPasswordVisible}
              placeholder="Confirmar senha"
              value={value}
              returnKeyType="send"
              onSubmitEditing={submitForm}
              onChangeText={text => {
                actions.resetError();
                onChange(text);
              }}
              rightAccessory={
                <UILucideIcon
                  iconNode={isConfirmPasswordVisible ? lucideIconNodes.eyeOff : lucideIconNodes.eye}
                  size={18}
                  color={colors.textMuted}
                />
              }
              onPressRightAccessory={() => setIsConfirmPasswordVisible(prev => !prev)}
              rightAccessoryAccessibilityLabel={
                isConfirmPasswordVisible
                  ? 'Ocultar confirmação de senha'
                  : 'Mostrar confirmação de senha'
              }
              errorMessage={errors.confirmPassword?.message}
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
        onPress={submitForm}
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
