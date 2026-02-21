import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useSignInViewModel } from './view-model';

export function SignInView() {
  const { form, state, actions } = useSignInViewModel();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <View className="flex-1 justify-center bg-zinc-100 px-6 dark:bg-zinc-900">
      <View className="rounded-3xl bg-white p-6 dark:bg-zinc-800">
        <Text className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Sign in</Text>
        <Text className="mt-2 text-zinc-600 dark:text-zinc-300">
          Shared shopping list in real time.
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
                    actions.resetError();
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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  secureTextEntry
                  placeholder="Password"
                  placeholderTextColor="#71717a"
                  value={value}
                  onChangeText={text => {
                    actions.resetError();
                    onChange(text);
                  }}
                  className="rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                />
                {errors.password?.message ? (
                  <Text className="text-sm text-red-600">{errors.password.message}</Text>
                ) : null}
              </>
            )}
          />
        </View>

        {state.error ? <Text className="mt-3 text-sm text-red-600">{state.error}</Text> : null}

        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit(actions.submit)}
          className="mt-6 rounded-xl bg-zinc-900 px-4 py-3 dark:bg-zinc-100"
        >
          <Text className="text-center font-semibold text-zinc-100 dark:text-zinc-900">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Text>
        </Pressable>

        <View className="mt-5 flex-row justify-between">
          <Link href={'/sign-up' as never} asChild>
            <Pressable>
              <Text className="font-medium text-zinc-700 underline dark:text-zinc-200">
                Create account
              </Text>
            </Pressable>
          </Link>

          <Link href={'/forgot-password' as never} asChild>
            <Pressable>
              <Text className="font-medium text-zinc-700 underline dark:text-zinc-200">
                Forgot password
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
