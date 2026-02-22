import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { UIButton } from '@infra/shared/ui/button';
import { lucideIconNodes } from '@infra/shared/ui/icon-nodes';
import { UIInput } from '@infra/shared/ui/input';
import { UILucideIcon } from '@infra/shared/ui/lucide-icon';
import { UIMessage } from '@infra/shared/ui/message';
import { UISection } from '@infra/shared/ui/section';
import { UITextLinkButton } from '@infra/shared/ui/text-link-button';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { useSignInViewModel } from './view-model';

export const SignInView = () => {
  const colors = useAppColors();
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
              secureTextEntry={!isPasswordVisible}
              placeholder="Senha"
              value={value}
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

      <UIButton
        variant="ghost"
        label="Criar conta"
        onPress={() => router.push('/sign-up' as never)}
        containerClassName="mt-3"
      />

      <View className="mt-5 items-center">
        <Link href={'/forgot-password' as never} asChild>
          <UITextLinkButton label="Esqueci minha senha" align="center" />
        </Link>
      </View>
    </UISection>
  );
};
