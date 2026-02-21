import { Link } from 'expo-router';
import { Controller } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useSignUpViewModel } from './view-model';

export function SignUpView() {
  const { form, state, actions } = useSignUpViewModel();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <View className="flex-1 justify-center bg-zinc-100 px-6 dark:bg-zinc-900">
      <View className="rounded-3xl bg-white p-6 dark:bg-zinc-800">
        <Text className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Create account</Text>

        <View className="mt-6 gap-3">
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  placeholder="Full name"
                  placeholderTextColor="#71717a"
                  value={value}
                  onChangeText={text => {
                    actions.resetError();
                    onChange(text);
                  }}
                  className="rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
                />
                {errors.fullName?.message ? (
                  <Text className="text-sm text-red-600">{errors.fullName.message}</Text>
                ) : null}
              </>
            )}
          />

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
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Text>
        </Pressable>

        <View className="mt-5">
          <Link href={'/sign-in' as never} asChild>
            <Pressable>
              <Text className="text-center font-medium text-zinc-700 underline dark:text-zinc-200">
                I already have an account
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
