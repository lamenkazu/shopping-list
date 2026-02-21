import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useForgotPasswordViewModel } from './view-model';

export const ForgotPasswordView = () => {
  const { form, state, actions } = useForgotPasswordViewModel();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <View className="flex-1 justify-center bg-zinc-100 px-6 dark:bg-zinc-900">
      <View className="rounded-3xl bg-white p-6 dark:bg-zinc-800">
        <Text className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Forgot password</Text>
        <Text className="mt-2 text-zinc-600 dark:text-zinc-300">
          We will send a reset link by email.
        </Text>

        <View className="mt-6 gap-3">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="you@email.com"
                  placeholderTextColor="#71717a"
                  value={value}
                  onChangeText={text => {
                    actions.resetMessages();
                    onChange(text);
                  }}
                  className="rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                />
                {errors.email?.message ? (
                  <Text className="text-sm text-red-600">{errors.email.message}</Text>
                ) : null}
              </>
            )}
          />
        </View>

        {state.error ? <Text className="mt-3 text-sm text-red-600">{state.error}</Text> : null}
        {state.success ? (
          <Text className="mt-3 text-sm text-emerald-700">{state.success}</Text>
        ) : null}

        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit(actions.submit)}
          className="mt-6 rounded-xl bg-zinc-900 px-4 py-3 dark:bg-zinc-100"
        >
          <Text className="text-center font-semibold text-zinc-100 dark:text-zinc-900">
            {isSubmitting ? 'Sending...' : 'Send reset email'}
          </Text>
        </Pressable>

        <View className="mt-5">
          <Link href={'/sign-in' as never} asChild>
            <Pressable>
              <Text className="text-center font-medium text-zinc-700 underline dark:text-zinc-200">
                Back to sign in
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
};
