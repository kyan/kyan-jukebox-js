import envVarsSchema from 'constants/env-vars-schema'

const EnvVars = {
  isSet: (key) => {
    return Boolean(process.env[key])
  },

  get: (key) => {
    const value = process.env[key]
    if (!value) {
      throw new Error(`Environment variable "${key}" is empty or undefined`)
    }
    const envVarRegex = envVarsSchema[key]
    if (envVarRegex && !envVarRegex.test(value)) {
      throw new Error(
        `Environment variable "${key}" value is invalid: "${value}" does not match ${envVarRegex.toString()}`
      )
    }
    return value
  }
}

export default EnvVars
