import { ImageBackground, View, Text, TouchableOpacity } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as SecureStore from 'expo-secure-store'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import imgBlur from './src/assets/bg-blur.png'
import Stripes from './src/assets/stripes.svg'
import NlwLogo from './src/assets/nlw-spacetime-logo.svg'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import { styled } from 'nativewind'
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session'
import { useEffect } from 'react'
import { api } from './src/lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/1ae9522acb16b33d42b4',
}

const StyledStripes = styled(Stripes)

export default function App() {
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '1ae9522acb16b33d42b4',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'spacetime',
      }),
    },
    discovery,
  )

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      api
        .post('/register', {
          code,
        })
        .then((response) => {
          const { token } = response.data

          SecureStore.setItemAsync('token', token)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [response])

  if (!hasLoadedFonts) {
    return null
  }

  return (
    <ImageBackground
      source={imgBlur}
      className="relative flex-1 bg-gray-900 px-8 py-10"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyledStripes className="absolute left-2" />

      <View className="flex-1 items-center justify-center gap-6">
        <NlwLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe(se quiser)
            com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
        >
          <Text
            onPress={() => signInWithGithub()}
            className="font-alt text-sm uppercase text-black"
          >
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
      <StatusBar style="light" translucent />
    </ImageBackground>
  )
}
