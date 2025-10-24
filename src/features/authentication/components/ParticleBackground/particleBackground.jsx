import React, { useCallback } from 'react'
import { Particles } from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import { useTheme } from '@/components/theme-provider'
import particleConfig from './config/particle-config'

function ParticleBackground() {
  const { theme } = useTheme()
  const darkMode = theme === 'dark'

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particleConfig(darkMode)}
      className="absolute inset-0 h-full w-full -z-10"
    />
  )
}

export default ParticleBackground
