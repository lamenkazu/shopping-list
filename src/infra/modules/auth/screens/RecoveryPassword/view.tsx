import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { lucideIconNodes } from '@infra/shared/ui/icon-nodes';
import { UIInput } from '@infra/shared/ui/input';
import { UILucideIcon } from '@infra/shared/ui/lucide-icon';
import { UIMessage } from '@infra/shared/ui/message';
import { UISection } from '@infra/shared/ui/section';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { useRecoveryPasswordViewModel } from './view-model';

export const RecoveryPasswordView = () => {
  const colors = useAppColors();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const { form, state, actions } = useRecoveryPasswordViewModel();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <UISection
      title="Redefinir senha"
      subtitle="Defina uma nova senha para voltar a acessar sua conta com segurança."
    >
      <UIMessage
        tone="info"
        message={state.isPreparingCallback ? 'Validando link de recuperação...' : null}
        className="mb-3"
      />

      <UIMessage tone="error" message={state.callbackError} className="mb-3" />

      <View className="gap-3">
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <UIInput
              secureTextEntry={!isPasswordVisible}
              placeholder="Nova senha"
              value={value}
              onChangeText={text => {
                actions.resetMessages();
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
              placeholder="Confirmar nova senha"
              value={value}
              onChangeText={text => {
                actions.resetMessages();
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
      <UIMessage tone="success" message={state.success} className="mt-3" />

      <UIButton
        disabled={isSubmitting || state.isPreparingCallback || Boolean(state.callbackError)}
        loading={isSubmitting}
        loadingLabel="Salvando..."
        label="Salvar nova senha"
        onPress={handleSubmit(actions.submit)}
        containerClassName="mt-6"
      />

      {state.success ? (
        <UIButton
          variant="ghost"
          label="Ir para entrar"
          onPress={actions.goToSignIn}
          containerClassName="mt-3"
        />
      ) : null}
    </UISection>
  );
};
